// features/products/hooks/products.queries.ts
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { 
    fetchProducts, 
    fetchProduct, 
    fetchProductCategories, 
    fetchProductBrands,
    fetchProductReviews 
} from '../services/products.api'
import { defaultLogger } from '@/shared/lib/logger'

// Query keys
export const productsQueryKeys = {
    all: ['products'] as const,
    lists: () => [...productsQueryKeys.all, 'list'] as const,
    list: (filters: { limit: number; skip: number; q?: string }) => 
        [...productsQueryKeys.lists(), filters] as const,
    details: () => [...productsQueryKeys.all, 'detail'] as const,
    detail: (id: string) => [...productsQueryKeys.details(), id] as const,
    categories: () => [...productsQueryKeys.all, 'categories'] as const,
    brands: () => [...productsQueryKeys.all, 'brands'] as const,
    reviews: (productId: string) => [...productsQueryKeys.all, 'reviews', productId] as const,
} as const

// Products list query
export function useProducts(limit: number, skip: number, q?: string) {
    const logger = defaultLogger.withContext({ 
        component: 'products.queries', 
        action: 'useProducts',
        limit,
        query: q
    })

    return useQuery({
        queryKey: productsQueryKeys.list({ limit, skip, q }),
        queryFn: () => fetchProducts(limit, skip, q),
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
        enabled: limit > 0,
    })
}

// Infinite products query for pagination
export function useInfiniteProducts(limit: number, q?: string) {
    const logger = defaultLogger.withContext({ 
        component: 'products.queries', 
        action: 'useInfiniteProducts',
        limit,
        query: q
    })

    return useInfiniteQuery({
        queryKey: productsQueryKeys.lists(),
        queryFn: ({ pageParam = 0 }) => fetchProducts(limit, pageParam, q),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const totalPages = Math.ceil(lastPage.pagination.total / limit)
            const currentPage = allPages.length
            return currentPage < totalPages ? currentPage * limit : undefined
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    })
}

// Single product query
export function useProduct(id: string) {
    const logger = defaultLogger.withContext({ 
        component: 'products.queries', 
        action: 'useProduct',
        productId: id
    })

    return useQuery({
        queryKey: productsQueryKeys.detail(id),
        queryFn: () => fetchProduct(id),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        enabled: !!id,
    })
}

// Product categories query
export function useProductCategories() {
    const logger = defaultLogger.withContext({ 
        component: 'products.queries', 
        action: 'useProductCategories'
    })

    return useQuery({
        queryKey: productsQueryKeys.categories(),
        queryFn: fetchProductCategories,
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
    })
}

// Product brands query
export function useProductBrands() {
    const logger = defaultLogger.withContext({ 
        component: 'products.queries', 
        action: 'useProductBrands'
    })

    return useQuery({
        queryKey: productsQueryKeys.brands(),
        queryFn: fetchProductBrands,
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
    })
}

// Product reviews query
export function useProductReviews(productId: string) {
    const logger = defaultLogger.withContext({ 
        component: 'products.queries', 
        action: 'useProductReviews',
        productId
    })

    return useQuery({
        queryKey: productsQueryKeys.reviews(productId),
        queryFn: () => fetchProductReviews(productId),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        enabled: !!productId,
    })
}

// Search products query
export function useProductSearch(query: string, limit: number = 20) {
    const logger = defaultLogger.withContext({ 
        component: 'products.queries', 
        action: 'useProductSearch',
        query,
        limit
    })

    return useQuery({
        queryKey: productsQueryKeys.list({ limit, skip: 0, q: query }),
        queryFn: () => fetchProducts(limit, 0, query),
        staleTime: 1 * 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        enabled: query.trim().length > 0,
    })
}