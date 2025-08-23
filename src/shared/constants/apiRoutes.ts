// shared/constants/apiRoutes.ts

export const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        ME: '/auth/me',
        REFRESH: '/auth/refresh',
    },
    DASHBOARD: {
        STATS: '/dashboard/stats',
        CHARTS: '/dashboard/charts',
    },
    USERS: {
        LIST: '/users',
        CREATE: '/users',
        UPDATE: (id: string | number) => `/users/${id}`,
        DELETE: (id: string | number) => `/users/${id}`,
    },
} as const

export type ApiRoute = typeof API_ROUTES