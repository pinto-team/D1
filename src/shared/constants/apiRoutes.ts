// shared/constants/apiRoutes.ts
import { API_CONFIG } from "@/shared/config/api.config"

export const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
        REFRESH: '/auth/refresh',
        REGISTER: '/auth/register',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_EMAIL: '/auth/verify-email',
    },
    
    DASHBOARD: {
        STATS: '/dashboard/stats',
        CHARTS: '/dashboard/charts',
        ACTIVITY: '/dashboard/activity',
        NOTIFICATIONS: '/dashboard/notifications',
    },
    
    USERS: {
        LIST: '/users',
        CREATE: '/users',
        UPDATE: (id: string | number) => `/users/${id}`,
        DELETE: (id: string | number) => `/users/${id}`,
        PROFILE: (id: string | number) => `/users/${id}/profile`,
        AVATAR: (id: string | number) => `/users/${id}/avatar`,
    },
    
    PRODUCTS: {
        LIST: '/products',
        SEARCH: '/products/search',
        CREATE: '/products',
        UPDATE: (id: string | number) => `/products/${id}`,
        DELETE: (id: string | number) => `/products/${id}`,
        DETAILS: (id: string | number) => `/products/${id}`,
        CATEGORIES: '/products/categories',
        BRANDS: '/products/brands',
        REVIEWS: (id: string | number) => `/products/${id}/reviews`,
        IMAGES: (id: string | number) => `/products/${id}/images`,
    },
    
    CATALOG: {
        CATEGORIES: '/catalog/categories',
        BRANDS: '/catalog/brands',
        TAGS: '/catalog/tags',
        FEATURED: '/catalog/featured',
        POPULAR: '/catalog/popular',
        NEW_ARRIVALS: '/catalog/new-arrivals',
        DISCOUNTS: '/catalog/discounts',
    },
    
    ORDERS: {
        LIST: '/orders',
        CREATE: '/orders',
        UPDATE: (id: string | number) => `/orders/${id}`,
        DELETE: (id: string | number) => `/orders/${id}`,
        DETAILS: (id: string | number) => `/orders/${id}`,
        STATUS: (id: string | number) => `/orders/${id}/status`,
        TRACKING: (id: string | number) => `/orders/${id}/tracking`,
    },
    
    CART: {
        GET: '/cart',
        ADD_ITEM: '/cart/items',
        UPDATE_ITEM: (id: string | number) => `/cart/items/${id}`,
        REMOVE_ITEM: (id: string | number) => `/cart/items/${id}`,
        CLEAR: '/cart/clear',
        APPLY_COUPON: '/cart/coupon',
    },
    
    FILES: {
        UPLOAD: '/files/upload',
        DELETE: (id: string | number) => `/files/${id}`,
        GET: (id: string | number) => `/files/${id}`,
        THUMBNAIL: (id: string | number) => `/files/${id}/thumbnail`,
    },
    
    NOTIFICATIONS: {
        LIST: '/notifications',
        MARK_READ: (id: string | number) => `/notifications/${id}/read`,
        MARK_ALL_READ: '/notifications/read-all',
        DELETE: (id: string | number) => `/notifications/${id}`,
        SETTINGS: '/notifications/settings',
    },
    
    SETTINGS: {
        PROFILE: '/settings/profile',
        PASSWORD: '/settings/password',
        PREFERENCES: '/settings/preferences',
        NOTIFICATIONS: '/settings/notifications',
        SECURITY: '/settings/security',
    },
} as const

export type ApiRoute = typeof API_ROUTES

// Helper function to build full URLs
export function buildApiUrl(route: string, baseUrl?: string): string {
    const base = baseUrl || import.meta.env.VITE_API_URL || 'http://localhost:3000'
    return `${base}${route}`
}

// Helper function to build feature-specific URLs
export function buildFeatureUrl(feature: keyof typeof API_CONFIG, route: string): string {
    const base = API_CONFIG[feature]?.BASE_URL || API_CONFIG.BASE_URL
    return `${base}${route}`
}