// features/products/services/products.api.ts
import { catalogClient } from "@/lib/axios"
import { API_ROUTES } from "@/shared/constants/apiRoutes"
import { handleAsyncError } from "@/shared/lib/errors"
import { defaultLogger } from "@/shared/lib/logger"

export interface Product {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export interface ProductDetails extends Product {
    description: string;
    category: string;
    brand: string;
    discountPercentage: number;
    rating: number;
    stock: number;
    tags: string[];
    sku: string;
    weight: number;
    dimensions: {
        width: number;
        height: number;
        depth: number;
    };
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    reviews: {
        reviewerName: string;
        reviewerEmail: string;
        rating: number;
        comment: string;
        date: string;
    }[];
    returnPolicy: string;
    minimumOrderQuantity: number;
    meta: {
        createdAt: string;
        updatedAt: string;
        barcode: string;
        qrCode: string;
    };
    images: string[];
}

export async function fetchProducts(limit: number, skip: number, q?: string): Promise<ProductsResponse> {
    const logger = defaultLogger.withContext({
        component: 'products.api',
        action: 'fetchProducts',
        limit,
        skip,
        query: q
    })

    logger.info('Fetching products')

    const params: Record<string, string | number> = { limit, skip };
    const route = q && q.trim().length > 0 ? API_ROUTES.PRODUCTS.SEARCH : API_ROUTES.PRODUCTS.LIST;
    
    if (q && q.trim().length > 0) {
        params.q = q;
    }

    return handleAsyncError(
        catalogClient.get(route, { params })
            .then(({ data }) => {
                logger.info('Products fetched successfully', { count: data.products?.length })
                return data
            }),
        'Failed to fetch products'
    )
}

export async function fetchProduct(id: number): Promise<ProductDetails> {
    const logger = defaultLogger.withContext({
        component: 'products.api',
        action: 'fetchProduct',
        productId: id
    })

    logger.info('Fetching product details')

    return handleAsyncError(
        catalogClient.get(API_ROUTES.PRODUCTS.DETAILS(id))
            .then(({ data }) => {
                logger.info('Product details fetched successfully')
                return data
            }),
        'Failed to fetch product details'
    )
}

export async function fetchProductCategories(): Promise<string[]> {
    const logger = defaultLogger.withContext({
        component: 'products.api',
        action: 'fetchProductCategories'
    })

    logger.info('Fetching product categories')

    return handleAsyncError(
        catalogClient.get(API_ROUTES.PRODUCTS.CATEGORIES)
            .then(({ data }) => {
                logger.info('Product categories fetched successfully')
                return data
            }),
        'Failed to fetch product categories'
    )
}

export async function fetchProductBrands(): Promise<string[]> {
    const logger = defaultLogger.withContext({
        component: 'products.api',
        action: 'fetchProductBrands'
    })

    logger.info('Fetching product brands')

    return handleAsyncError(
        catalogClient.get(API_ROUTES.PRODUCTS.BRANDS)
            .then(({ data }) => {
                logger.info('Product brands fetched successfully')
                return data
            }),
        'Failed to fetch product brands'
    )
}

export async function fetchProductReviews(productId: number): Promise<ProductDetails['reviews']> {
    const logger = defaultLogger.withContext({
        component: 'products.api',
        action: 'fetchProductReviews',
        productId
    })

    logger.info('Fetching product reviews')

    return handleAsyncError(
        catalogClient.get(API_ROUTES.PRODUCTS.REVIEWS(productId))
            .then(({ data }) => {
                logger.info('Product reviews fetched successfully')
                return data
            }),
        'Failed to fetch product reviews'
    )
}
