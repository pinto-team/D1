// src/api/client.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_CONFIG } from "@/shared/config/api.config";
import { getAccessToken } from "@/features/auth/storage";

const baseURL = API_CONFIG?.CATALOG?.BASE_URL || API_CONFIG?.BASE_URL || "/";

export const api: AxiosInstance = axios.create({
    baseURL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = getAccessToken?.();
    if (token) {
        config.headers = config.headers ?? {};
        if (!("Authorization" in config.headers)) {
            (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Centralized error logging; let callers handle messages
        // Optionally map backend error shape here
        return Promise.reject(error);
    },
);

export type RequestFn<T> = (signal?: AbortSignal) => Promise<T>;

// Wraps a request to support AbortController and consistent error surfaces
export async function request<T>(fn: (config: { signal?: AbortSignal }) => Promise<AxiosResponse<T>>): Promise<T> {
    const controller = new AbortController();
    try {
        const res = await fn({ signal: controller.signal });
        return res.data as T;
    } catch (e) {
        if ((e as any)?.name === "CanceledError" || (e as any)?.code === "ERR_CANCELED") {
            throw e;
        }
        throw e;
    }
}

export function withSignal<T>(config: AxiosRequestConfig, signal?: AbortSignal): AxiosRequestConfig {
    return { ...config, signal };
}

