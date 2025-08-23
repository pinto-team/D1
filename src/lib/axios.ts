// lib/axios.ts
import axios, {
    AxiosError,
    AxiosHeaders,
    InternalAxiosRequestConfig,
    AxiosRequestConfig,
} from "axios"
import {
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearAuthStorage,
} from "@/features/auth/storage"
import { defaultLogger } from "@/shared/lib/logger"
import { API_ROUTES } from "@/shared/constants/apiRoutes"

type PendingResolver = {
    resolve: (token: string) => void
    reject: (reason?: unknown) => void
}

type RefreshResponse = {
    accessToken: string
    refreshToken: string
}

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: new AxiosHeaders({ "Content-Type": "application/json" }),
})

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

instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken()
        if (token) {
            const headers = toAxiosHeaders(config.headers)
            if (!headers.has("Authorization")) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            config.headers = headers
        }
        defaultLogger.info("API Request", {
            method: config.method?.toUpperCase(),
            url: config.url,
            baseURL: config.baseURL,
            hasAuth: !!token,
        })
        return config
    },
    (err) => Promise.reject(err),
)

instance.interceptors.response.use(
    (response) => {
        defaultLogger.info("API Response", {
            status: response.status,
            url: response.config.url,
            method: response.config.method?.toUpperCase(),
        })
        return response
    },
    (error: AxiosError) => {
        defaultLogger.error("API Error", {
            status: error.response?.status,
            url: error.config?.url,
            method: (error.config as AxiosRequestConfig | undefined)?.method?.toUpperCase(),
            message: error.message,
            data: error.response?.data,
        })
        return Promise.reject(error)
    },
)

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

            const baseURL = import.meta.env.VITE_API_URL
            const refreshUrl = `${baseURL}${API_ROUTES.AUTH.REFRESH}`

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

export default instance
