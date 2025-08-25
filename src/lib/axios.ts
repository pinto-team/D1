// lib/axios.ts
import axios, {
    AxiosError,
    AxiosHeaders,
    InternalAxiosRequestConfig,
    AxiosRequestConfig,
    AxiosInstance,
} from "axios"
import {
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearAuthStorage,
} from "@/features/auth/storage"
import { defaultLogger } from "@/shared/lib/logger"
import { API_CONFIG } from "@/shared/config/api.config"

type PendingResolver = {
    resolve: (token: string) => void
    reject: (reason?: unknown) => void
}

type RefreshResponse = {
    accessToken: string
    refreshToken: string
}

type ClientConfig = {
    baseURL: string
    feature?: string
    enableAuth?: boolean
    enableRefresh?: boolean
}

const RETRY_FLAG = "__isRetryRequest"

let isRefreshing = false
let pendingQueue: PendingResolver[] = []

function toAxiosHeaders(h?: unknown): AxiosHeaders {
    if (!h) return new AxiosHeaders()
    return h instanceof AxiosHeaders ? h : new AxiosHeaders(h as Record<string, string>)
}

function processQueue(error: unknown | null, token?: string) {
    if (error) {
        pendingQueue.forEach(({ reject }) => reject(error))
    } else if (token) {
        pendingQueue.forEach(({ resolve }) => resolve(token))
    }
    pendingQueue = []
}

function setAuthHeaderOnConfig(config: AxiosRequestConfig, token: string) {
    const headers = toAxiosHeaders(config.headers)
    headers.set("Authorization", `Bearer ${token}`)
    config.headers = headers
}

function createApiClient(config: ClientConfig): AxiosInstance {
    const instance = axios.create({
        baseURL: config.baseURL,
        headers: new AxiosHeaders({ "Content-Type": "application/json" }),
    })

    // Add feature header if specified
    if (config.feature) {
        instance.defaults.headers.common["X-Feature"] = config.feature
    }

    // Request interceptor
    instance.interceptors.request.use(
        (requestConfig: InternalAxiosRequestConfig) => {
            const token = getAccessToken()
            if (token) {
                const headers = toAxiosHeaders(requestConfig.headers)
                if (!headers.has("Authorization")) {
                    headers.set("Authorization", `Bearer ${token}`)
                }
                requestConfig.headers = headers
            }

            // Development logging
            if (API_CONFIG.DEV.LOG_REQUESTS) {
                defaultLogger.info("API Request", {
                    method: requestConfig.method?.toUpperCase(),
                    url: requestConfig.url,
                    baseURL: requestConfig.baseURL,
                    hasAuth: !!token,
                    feature: config.feature,
                })
            }

            return requestConfig
        },
        (err) => Promise.reject(err),
    )

    // Response interceptor for logging
    instance.interceptors.response.use(
        (response) => {
            if (API_CONFIG.DEV.LOG_RESPONSES) {
                defaultLogger.info("API Response", {
                    status: response.status,
                    url: response.config.url,
                    method: response.config.method?.toUpperCase(),
                    feature: config.feature,
                })
            }
            return response
        },
        (error: AxiosError) => {
            defaultLogger.error("API Error", {
                status: error.response?.status,
                url: error.config?.url,
                method: (error.config as AxiosRequestConfig | undefined)?.method?.toUpperCase(),
                message: error.message,
                data: error.response?.data,
                feature: config.feature,
            })
            return Promise.reject(error)
        },
    )

    // Response interceptor for auth refresh (only if enabled)
    if (config.enableRefresh !== false) {
        instance.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as (InternalAxiosRequestConfig & {
                    [RETRY_FLAG]?: boolean
                }) | undefined
                const status = error.response?.status

                if (status !== 401 || !originalRequest || originalRequest[RETRY_FLAG]) {
                    return Promise.reject(error)
                }

                if (isRefreshing) {
                    try {
                        const newToken = await new Promise<string>((resolve, reject) => {
                            pendingQueue.push({ resolve, reject })
                        })
                        setAuthHeaderOnConfig(originalRequest, newToken)
                        return instance(originalRequest)
                    } catch (e) {
                        return Promise.reject(e)
                    }
                }

                originalRequest[RETRY_FLAG] = true
                isRefreshing = true

                try {
                    const rt = getRefreshToken()
                    if (!rt) {
                        throw error
                    }

                    // Use auth API for refresh
                    const refreshUrl = `${API_CONFIG.AUTH.BASE_URL}/auth/refresh`

                    const { data } = await axios.post<RefreshResponse>(
                        refreshUrl,
                        { refreshToken: rt },
                        { headers: new AxiosHeaders({ "Content-Type": "application/json" }) },
                    )

                    const newAccess = data.accessToken
                    const newRefresh = data.refreshToken

                    setTokens(newAccess, newRefresh)
                    instance.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`

                    processQueue(null, newAccess)

                    setAuthHeaderOnConfig(originalRequest, newAccess)
                    return instance(originalRequest)
                } catch (refreshErr) {
                    processQueue(refreshErr)
                    clearAuthStorage()
                    return Promise.reject(refreshErr)
                } finally {
                    isRefreshing = false
                }
            },
        )
    }

    return instance
}

// Default client instances
export const apiClient = createApiClient({
    baseURL: API_CONFIG.BASE_URL,
    enableAuth: true,
    enableRefresh: true,
})

export const authClient = createApiClient({
    baseURL: API_CONFIG.AUTH.BASE_URL,
    feature: "auth",
    enableAuth: true,
    enableRefresh: true,
})

export const catalogClient = createApiClient({
    baseURL: API_CONFIG.CATALOG.BASE_URL,
    feature: "catalog",
    enableAuth: true,
    enableRefresh: false, // Catalog might not need refresh
})

// Factory function for creating custom clients
export function createFeatureClient(config: ClientConfig): AxiosInstance {
    return createApiClient(config)
}

// Legacy export for backward compatibility
export default apiClient
