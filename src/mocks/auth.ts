// mocks/auth.ts
import { http, HttpResponse } from 'msw'
import { API_ROUTES } from '@/shared/constants/apiRoutes'

// Mock user data
const mockUsers = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
    {
        id: 2,
        username: 'user',
        email: 'user@example.com',
        firstName: 'Regular',
        lastName: 'User',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    },
]

// Mock tokens
const mockTokens = {
    admin: {
        accessToken: 'mock-admin-access-token',
        refreshToken: 'mock-admin-refresh-token',
    },
    user: {
        accessToken: 'mock-user-access-token',
        refreshToken: 'mock-user-refresh-token',
    },
}

// Type definitions for request bodies
interface LoginRequest {
    username: string
    password: string
}

interface RefreshRequest {
    refreshToken: string
}

interface RegisterRequest {
    username: string
    email: string
    password: string
    firstName?: string
    lastName?: string
}

interface ForgotPasswordRequest {
    email: string
}

export const authHandlers = [
    // Login
    http.post(API_ROUTES.AUTH.LOGIN, async ({ request }) => {
        const body = await request.json() as LoginRequest
        const { username, password } = body
        
        const user = mockUsers.find(u => u.username === username)
        
        if (user && password === 'password') {
            const tokens = mockTokens[user.username as keyof typeof mockTokens]
            
            return HttpResponse.json({
                user,
                ...tokens,
                message: 'Login successful',
            })
        }
        
        return new HttpResponse(
            JSON.stringify({
                message: 'Invalid credentials',
                errors: ['Username or password is incorrect'],
            }),
            { status: 401 }
        )
    }),

    // Get current user
    http.get(API_ROUTES.AUTH.ME, ({ request }) => {
        const authHeader = request.headers.get('Authorization')
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new HttpResponse(
                JSON.stringify({
                    message: 'Unauthorized',
                    errors: ['No valid token provided'],
                }),
                { status: 401 }
            )
        }
        
        const token = authHeader.replace('Bearer ', '')
        const user = mockUsers.find(u => 
            mockTokens[u.username as keyof typeof mockTokens]?.accessToken === token
        )
        
        if (user) {
            return HttpResponse.json(user)
        }
        
        return new HttpResponse(
            JSON.stringify({
                message: 'Unauthorized',
                errors: ['Invalid token'],
            }),
            { status: 401 }
        )
    }),

    // Refresh token
    http.post(API_ROUTES.AUTH.REFRESH, async ({ request }) => {
        const body = await request.json() as RefreshRequest
        const { refreshToken } = body
        
        const user = mockUsers.find(u => 
            mockTokens[u.username as keyof typeof mockTokens]?.refreshToken === refreshToken
        )
        
        if (user) {
            const tokens = mockTokens[user.username as keyof typeof mockTokens]
            
            return HttpResponse.json({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                message: 'Token refreshed successfully',
            })
        }
        
        return new HttpResponse(
            JSON.stringify({
                message: 'Invalid refresh token',
                errors: ['Refresh token is invalid or expired'],
            }),
            { status: 401 }
        )
    }),

    // Logout
    http.post(API_ROUTES.AUTH.LOGOUT, () => {
        return HttpResponse.json({
            message: 'Logout successful',
        })
    }),

    // Register
    http.post(API_ROUTES.AUTH.REGISTER, async ({ request }) => {
        const body = await request.json() as RegisterRequest
        const userData = body
        
        // Check if user already exists
        const existingUser = mockUsers.find(u => 
            u.username === userData.username || u.email === userData.email
        )
        
        if (existingUser) {
            return new HttpResponse(
                JSON.stringify({
                    message: 'Registration failed',
                    errors: ['Username or email already exists'],
                }),
                { status: 409 }
            )
        }
        
        // Create new user
        const newUser = {
            id: mockUsers.length + 1,
            username: userData.username,
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            role: 'user',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
        }
        
        mockUsers.push(newUser)
        
        return HttpResponse.json({
            user: newUser,
            message: 'Registration successful',
        }, { status: 201 })
    }),

    // Forgot password
    http.post(API_ROUTES.AUTH.FORGOT_PASSWORD, async ({ request }) => {
        const body = await request.json() as ForgotPasswordRequest
        const { email } = body
        
        const user = mockUsers.find(u => u.email === email)
        
        if (user) {
            return HttpResponse.json({
                message: 'Password reset email sent',
                email: user.email,
            })
        }
        
        // Don't reveal if email exists or not
        return HttpResponse.json({
            message: 'If an account with that email exists, a password reset email has been sent',
        })
    }),
]