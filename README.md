# My Dashboard - React + TypeScript + Vite

A modern React dashboard application with a clean, feature-based API architecture, built with TypeScript, Vite, and React Query.

## 🏗️ Project API Architecture

This project follows a clean, feature-based API architecture designed for scalability and maintainability:

### Core Components

- **Central Configuration** (`src/shared/config/api.config.ts`)
  - Environment-based API base URLs
  - Feature-specific API configurations
  - MSW and development settings

- **API Client Factory** (`src/lib/axios.ts`)
  - Configurable axios instances per feature
  - Built-in interceptors for auth, refresh, logging
  - Feature headers and conditional functionality

- **Centralized Routes** (`src/shared/constants/apiRoutes.ts`)
  - All API endpoints defined in one place
  - No hardcoded URLs allowed
  - Helper functions for building feature-specific URLs

- **Feature-Based Services** (`src/features/*/services/*.api.ts`)
  - Each feature has its own API service layer
  - Uses centralized clients and routes
  - Consistent error handling and logging

- **React Query Hooks** (`src/features/*/hooks/*.queries.ts`)
  - Feature-specific query hooks
  - Optimized caching and state management
  - Type-safe API interactions

### Architecture Benefits

- **No Hardcoded URLs**: ESLint rule prevents hardcoded URLs
- **Feature Isolation**: Each feature manages its own API layer
- **Centralized Configuration**: Easy to change API endpoints and settings
- **Type Safety**: Full TypeScript support throughout the API layer
- **Consistent Patterns**: Standardized approach across all features

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_AUTH_API_URL=http://localhost:3000
VITE_CATALOG_API_URL=http://localhost:3000

# MSW Configuration
VITE_ENABLE_MSW=true

# Development Settings
NODE_ENV=development
```

### Development

```bash
npm run dev
```

The application will start with MSW enabled (if `VITE_ENABLE_MSW=true`), providing mock API responses for development.

## 🔧 Configuration

### API Base URLs

Configure different API endpoints for different features:

```typescript
// .env.local
VITE_API_URL=http://localhost:3000          # Main API
VITE_AUTH_API_URL=http://localhost:3001     # Auth service
VITE_CATALOG_API_URL=http://localhost:3002  # Catalog service
```

### MSW (Mock Service Worker)

MSW is automatically enabled in development when `VITE_ENABLE_MSW=true`:

- **Auth Handlers**: Mock authentication endpoints
- **Product Handlers**: Mock product catalog endpoints  
- **Dashboard Handlers**: Mock dashboard data endpoints

## 📚 Usage Examples

### Using API Services

```typescript
// ✅ Correct: Use centralized client and routes
import { authClient } from '@/lib/axios'
import { API_ROUTES } from '@/shared/constants/apiRoutes'

export async function login(username: string, password: string) {
    return authClient.post(API_ROUTES.AUTH.LOGIN, { username, password })
}

// ❌ Wrong: Hardcoded URLs
export async function login(username: string, password: string) {
    return axios.post('http://localhost:3000/auth/login', { username, password })
}
```

### Using React Query Hooks

```typescript
import { useProducts, useProduct } from '@/features/products/hooks/products.queries'

function ProductList() {
    const { data: products, isLoading } = useProducts(20, 0)
    const { data: product } = useProduct(1)
    
    // ... component logic
}
```

### Creating a New Feature API

1. **Create the API service**:
```typescript
// src/features/orders/services/orders.api.ts
import { apiClient } from '@/lib/axios'
import { API_ROUTES } from '@/shared/constants/apiRoutes'

export async function fetchOrders() {
    return apiClient.get(API_ROUTES.ORDERS.LIST)
}
```

2. **Create React Query hooks**:
```typescript
// src/features/orders/hooks/orders.queries.ts
import { useQuery } from '@tanstack/react-query'
import { fetchOrders } from '../services/orders.api'

export function useOrders() {
    return useQuery({
        queryKey: ['orders'],
        queryFn: fetchOrders,
    })
}
```

3. **Add MSW handlers**:
```typescript
// src/mocks/orders.ts
import { http, HttpResponse } from 'msw'
import { API_ROUTES } from '@/shared/constants/apiRoutes'

export const ordersHandlers = [
    http.get(API_ROUTES.ORDERS.LIST, () => {
        return HttpResponse.json({ orders: [] })
    }),
]
```

4. **Register in root handlers**:
```typescript
// src/mocks/handlers.ts
import { ordersHandlers } from './orders'

export const handlers = [
    ...authHandlers,
    ...productsHandlers,
    ...ordersHandlers, // Add new handlers
]
```

## 🧪 Development Tools

### Dev Panel

A development-only panel shows:
- Current API configuration
- Recent API calls with timing
- MSW status
- Feature headers

Access via the floating button in the bottom-right corner (development only).

### ESLint Rules

The project includes custom ESLint rules:
- **No hardcoded URLs**: Forces use of `API_ROUTES` constants
- **Consistent patterns**: Ensures proper API architecture usage

## 📁 Project Structure

```
src/
├── shared/
│   ├── config/
│   │   └── api.config.ts          # Central API configuration
│   └── constants/
│       └── apiRoutes.ts           # All API endpoints
├── lib/
│   └── axios.ts                   # API client factory
├── features/
│   ├── auth/
│   │   ├── services/
│   │   │   └── auth.api.ts        # Auth API service
│   │   └── hooks/
│   │       └── auth.queries.ts    # Auth React Query hooks
│   └── products/
│       ├── services/
│       │   └── products.api.ts    # Products API service
│       └── hooks/
│           └── products.queries.ts # Products React Query hooks
├── mocks/
│   ├── auth.ts                    # Auth MSW handlers
│   ├── products.ts                # Products MSW handlers
│   ├── handlers.ts                # Root handler aggregator
│   └── browser.ts                 # MSW browser setup
└── components/
    └── dev/
        └── DevPanel.tsx           # Development panel
```

## 🚫 Coding Rules

### API Layer

- **Never hardcode URLs**: Always use `API_ROUTES` constants
- **Use feature clients**: Use `authClient`, `catalogClient`, or create custom ones
- **Centralized configuration**: All API settings in `api.config.ts`
- **Consistent error handling**: Use `handleAsyncError` utility
- **Feature-based organization**: Keep API logic within feature boundaries

### React Query

- **Feature-specific hooks**: Create hooks in `*.queries.ts` files
- **Proper query keys**: Use structured query keys for caching
- **Error boundaries**: Handle errors gracefully in components
- **Optimistic updates**: Use mutations for data modifications

## 🔍 Troubleshooting

### Common Issues

1. **ESLint errors about hardcoded URLs**
   - Solution: Replace hardcoded URLs with `API_ROUTES` constants

2. **MSW not working**
   - Check `VITE_ENABLE_MSW=true` in `.env.local`
   - Ensure you're in development mode

3. **API calls failing**
   - Verify environment variables are set correctly
   - Check browser console for CORS issues
   - Ensure MSW handlers are properly configured

### Debug Mode

Enable detailed logging by setting:
```bash
VITE_DEBUG=true
```

## 🤝 Contributing

1. Follow the established API architecture patterns
2. Add MSW handlers for new features
3. Create React Query hooks for data fetching
4. Update this README for new features
5. Ensure ESLint passes with no hardcoded URL violations

## 📄 License

This project is licensed under the MIT License.
