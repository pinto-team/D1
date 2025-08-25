// mocks/browser.ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// Create and export the MSW worker
export const worker = setupWorker(...handlers)

// Optional: Add custom logic for the worker
worker.events.on('request:start', ({ request }) => {
    console.log('🔄 MSW intercepted:', request.method, request.url)
})

worker.events.on('request:end', ({ request }) => {
    console.log('✅ MSW request completed:', request.method, request.url)
})

worker.events.on('request:unhandled', ({ request }) => {
    console.warn('⚠️ MSW unhandled request:', request.method, request.url)
})