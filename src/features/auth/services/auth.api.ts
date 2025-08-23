// features/auth/services/auth.api.ts
import api from "@/lib/axios"
import { API_ROUTES } from "@/shared/constants/apiRoutes"
import { handleAsyncError } from "@/shared/lib/errors"
import { defaultLogger } from "@/shared/lib/logger"

export async function apiLogin(username: string, password: string) {
    const logger = defaultLogger.withContext({
        component: 'auth.api',
        action: 'login',
        username
    })

    logger.info('Attempting login')

    return handleAsyncError(
        api.post(API_ROUTES.AUTH.LOGIN, { username, password })
            .then(({ data }) => {
                logger.info('Login successful')
                return data
            }),
        'Login failed'
    )
}

export async function apiMe(token: string) {
    const logger = defaultLogger.withContext({
        component: 'auth.api',
        action: 'fetchUserInfo'
    })

    logger.info('Fetching user info')

    return handleAsyncError(
        api.get(API_ROUTES.AUTH.ME, {
            headers: { Authorization: `Bearer ${token}` },
        }).then(({ data }) => {
            logger.info('User info fetched successfully')
            return data
        }),
        'Failed to fetch user info'
    )
}

export async function apiRefresh(refreshToken: string) {
    const logger = defaultLogger.withContext({
        component: 'auth.api',
        action: 'refreshToken'
    })

    logger.info('Attempting token refresh')

    return handleAsyncError(
        api.post(API_ROUTES.AUTH.REFRESH, { refreshToken })
            .then(({ data }) => {
                logger.info('Token refresh successful')
                return data
            }),
        'Token refresh failed'
    )
}
