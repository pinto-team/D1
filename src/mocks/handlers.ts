// mocks/handlers.ts
import { authHandlers } from './auth'
import { productsHandlers } from './products'
import { dashboardHandlers } from './dashboard'

// Aggregate all handlers from different features
export const handlers = [
    ...authHandlers,
    ...productsHandlers,
    ...dashboardHandlers,
]

// Export individual handlers for testing purposes
export { authHandlers, productsHandlers, dashboardHandlers }