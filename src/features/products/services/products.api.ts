// features/products/services/products.api.ts
import { catalogClient } from "@/lib/axios"
import { API_ROUTES } from "@/shared/constants/apiRoutes"
import { handleAsyncError } from "@/shared/lib/errors"
import { defaultLogger } from "@/shared/lib/logger"

// New product model and related interfaces
export interface Product {
    id: string;
    seller_id: string;
    warehouse_id: string;
    sku: string;
    name: string;
    description?: string;
    category_id: string;
    brand?: string;
    base_price: number;
    purchase_price?: number;
    currency: string;
    tax_rate: number;
    min_order_quantity: number;
    min_order_multiple?: number | null;
    stock: number;
    warehouse_availability?: WarehouseAvailability[];
    pricing_tiers?: PricingTier[];
    uom?: string;
    pack_size?: number | null;
    case_size?: number | null;
    barcode?: string;
    attributes?: Attributes;
    allow_backorder: boolean;
    is_active: boolean;
    images: string[];
    tags: string[];
    created_at: string;
    updated_at: string;
}

export interface WarehouseAvailability {
    warehouse_id: string;
    stock: number;
    lead_time_days: number;
}

export interface PricingTier {
    min_qty: number;
    unit_price: number;
}

export interface Attributes {
    weight?: number;
    dimensions?: Dimensions;
    packaging?: string;
    storage?: string;
    shelf_life_days?: number;
    halal?: boolean;
}

export interface Dimensions {
    length: number;
    width: number;
    height: number;
}

// New: AddProductRequest interface for creating products
export interface AddProductRequest {
    seller_id: string;          // UUID
    warehouse_id: string;       // UUID
    sku: string;                // e.g., "AB-12345"
    name: string;               // product name
    description?: string;       // optional description
    category_id: string;        // UUID
    brand?: string;             // optional brand

    base_price: number;         // base price
    purchase_price?: number;    // optional purchase price
    currency: string;           // e.g., "USD"
    tax_rate?: number;          // 0.05 means 5%

    min_order_quantity: number; // minimum order quantity
    min_order_multiple?: number;// minimum multiple

    stock: number;              // total stock

    warehouse_availability?: WarehouseAvailability[];
    pricing_tiers?: PricingTier[];

    uom?: string;               // unit (unit, pack, case)
    pack_size?: number;         // units per pack
    case_size?: number;         // packs per case

    barcode?: string;           // EAN/UPC

    attributes?: Attributes;    // extra attributes
    allow_backorder?: boolean;  // allow backorder
    is_active?: boolean;        // active flag

    images?: string[];          // 1..4 image URLs
    tags?: string[];            // tags
}

export interface ProductListResponse {
    items: Product[];
    pagination: Pagination;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
}

export interface ProductReview {
    reviewerName: string;
    reviewerEmail: string;
    rating: number;
    comment: string;
    date: string;
}

export async function fetchProducts(limit: number, p0: number, q?: string): Promise<ProductListResponse> {
    const logger = defaultLogger.withContext({
        component: 'products.api',
        action: 'fetchProducts',
        limit,
        query: q
    })

    logger.info('Fetching products')

    const params: Record<string, string | number> = { limit };
    const route = q && q.trim().length > 0 ? API_ROUTES.PRODUCTS.SEARCH : API_ROUTES.PRODUCTS.LIST;
    
    if (q && q.trim().length > 0) {
        params.q = q;
    }

    return handleAsyncError(
        catalogClient.get(route, { params })
            .then(({ data }) => {
                logger.info('Products fetched successfully', { count: data.items?.length })
                return data as ProductListResponse
            }),
        'Failed to fetch products'
    )
}

export async function fetchProduct(id: string): Promise<Product> {
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
                return data as Product
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

export async function fetchProductReviews(productId: string): Promise<ProductReview[]> {
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
                return data as ProductReview[]
            }),
        'Failed to fetch product reviews'
    )
}

// New: Create product API
export async function createProduct(payload: AddProductRequest): Promise<Product> {
    const logger = defaultLogger.withContext({
        component: 'products.api',
        action: 'createProduct',
        sku: payload.sku,
        name: payload.name,
    })

    logger.info('Creating product')

    return handleAsyncError(
        catalogClient.post(API_ROUTES.PRODUCTS.CREATE, payload)
            .then(({ data }) => {
                logger.info('Product created successfully', { id: data?.id })
                return data as Product
            }),
        'Failed to create product'
    )
}