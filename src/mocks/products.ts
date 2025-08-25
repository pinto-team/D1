// mocks/products.ts
import { http, HttpResponse } from 'msw'
import { API_ROUTES } from '@/shared/constants/apiRoutes'
import type { AddProductRequest, Product } from '@/features/products/services/products.api'

// Mock product data with new model
const mockProducts: Product[] = [
    {
        id: '1',
        seller_id: 'seller-1',
        warehouse_id: 'wh-1',
        sku: 'IPH15PRO-001',
        name: 'iPhone 15 Pro',
        description: 'The latest iPhone with advanced features and premium design.',
        category_id: 'electronics',
        brand: 'Apple',
        base_price: 999,
        purchase_price: 850,
        currency: 'USD',
        tax_rate: 9,
        min_order_quantity: 1,
        min_order_multiple: null,
        stock: 50,
        warehouse_availability: [
            { warehouse_id: 'wh-1', stock: 30, lead_time_days: 2 },
            { warehouse_id: 'wh-2', stock: 20, lead_time_days: 5 },
        ],
        pricing_tiers: [
            { min_qty: 10, unit_price: 979 },
            { min_qty: 50, unit_price: 949 },
        ],
        uom: 'unit',
        pack_size: null,
        case_size: null,
        barcode: '1234567890123',
        attributes: {
            weight: 0.187,
            dimensions: { length: 14.67, width: 7.15, height: 0.825 },
            packaging: 'box',
            storage: 'ambient',
            shelf_life_days: 365,
            halal: false,
        },
        allow_backorder: true,
        is_active: true,
        images: [
            'https://picsum.photos/800/600?random=1',
            'https://picsum.photos/800/600?random=2',
            'https://picsum.photos/800/600?random=3',
        ],
        tags: ['smartphone', 'apple', '5g'],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z',
    },
    {
        id: '2',
        seller_id: 'seller-1',
        warehouse_id: 'wh-1',
        sku: 'MBA-M2-001',
        name: 'MacBook Air M2',
        description: 'Lightweight laptop with M2 chip for ultimate performance.',
        category_id: 'electronics',
        brand: 'Apple',
        base_price: 1199,
        purchase_price: 999,
        currency: 'USD',
        tax_rate: 9,
        min_order_quantity: 1,
        min_order_multiple: null,
        stock: 25,
        warehouse_availability: [
            { warehouse_id: 'wh-1', stock: 15, lead_time_days: 2 },
            { warehouse_id: 'wh-2', stock: 10, lead_time_days: 5 },
        ],
        pricing_tiers: [
            { min_qty: 10, unit_price: 1179 },
            { min_qty: 50, unit_price: 1149 },
        ],
        uom: 'unit',
        pack_size: null,
        case_size: null,
        barcode: '1234567890124',
        attributes: {
            weight: 1.24,
            dimensions: { length: 21.24, width: 30.41, height: 1.13 },
            packaging: 'box',
            storage: 'ambient',
            shelf_life_days: 365,
            halal: false,
        },
        allow_backorder: false,
        is_active: true,
        images: [
            'https://picsum.photos/800/600?random=4',
            'https://picsum.photos/800/600?random=5',
            'https://picsum.photos/800/600?random=6',
        ],
        tags: ['laptop', 'apple', 'm2'],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-10T00:00:00Z',
    },
    {
        id: '3',
        seller_id: 'seller-2',
        warehouse_id: 'wh-2',
        sku: 'SGS24-001',
        name: 'Samsung Galaxy S24',
        description: 'Android flagship with cutting-edge features.',
        category_id: 'electronics',
        brand: 'Samsung',
        base_price: 899,
        purchase_price: 799,
        currency: 'USD',
        tax_rate: 9,
        min_order_quantity: 1,
        min_order_multiple: null,
        stock: 75,
        warehouse_availability: [
            { warehouse_id: 'wh-2', stock: 75, lead_time_days: 3 },
        ],
        pricing_tiers: [
            { min_qty: 10, unit_price: 879 },
            { min_qty: 50, unit_price: 849 },
        ],
        uom: 'unit',
        pack_size: null,
        case_size: null,
        barcode: '1234567890125',
        attributes: {
            weight: 0.168,
            dimensions: { length: 14.73, width: 7.06, height: 0.76 },
            packaging: 'box',
            storage: 'ambient',
            shelf_life_days: 365,
            halal: false,
        },
        allow_backorder: true,
        is_active: true,
        images: [
            'https://picsum.photos/800/600?random=7',
            'https://picsum.photos/800/600?random=8',
            'https://picsum.photos/800/600?random=9',
        ],
        tags: ['smartphone', 'samsung', 'android'],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-12T00:00:00Z',
    },
]

const mockCategories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports']
const mockBrands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony']

export const productsHandlers = [
    // Get products list
    http.get(API_ROUTES.PRODUCTS.LIST, ({ request }) => {
        const url = new URL(request.url)
        const limit = parseInt(url.searchParams.get('limit') || '10')
        const skip = parseInt(url.searchParams.get('skip') || '0')
        
        const paginatedProducts = mockProducts.slice(skip, skip + limit)
        
        return HttpResponse.json({
            items: paginatedProducts,
            pagination: {
                page: Math.floor(skip / limit),
                limit,
                total: mockProducts.length,
            },
        })
    }),

    // New: Create product
    http.post(API_ROUTES.PRODUCTS.CREATE, async ({ request }) => {
        try {
            const body = await request.json() as AddProductRequest | null
            const now = new Date().toISOString()
            const newId = String(mockProducts.length + 1)
            const taxRate = body && typeof body.tax_rate === 'number' ? body.tax_rate : 0
            const newProduct = {
                id: newId,
                seller_id: body?.seller_id ?? 'seller-unknown',
                warehouse_id: body?.warehouse_id ?? 'wh-unknown',
                sku: body?.sku ?? `SKU-${newId}`,
                name: body?.name ?? 'New Product',
                description: body?.description ?? '',
                category_id: body?.category_id ?? 'uncategorized',
                brand: body?.brand ?? '',
                base_price: body?.base_price ?? 0,
                purchase_price: body?.purchase_price ?? (body?.base_price ?? 0),
                currency: body?.currency ?? 'USD',
                tax_rate: taxRate,
                min_order_quantity: body?.min_order_quantity ?? 1,
                min_order_multiple: body?.min_order_multiple ?? null,
                stock: body?.stock ?? 0,
                warehouse_availability: body?.warehouse_availability ?? [],
                pricing_tiers: body?.pricing_tiers ?? [],
                uom: body?.uom ?? 'unit',
                pack_size: body?.pack_size ?? null,
                case_size: body?.case_size ?? null,
                barcode: body?.barcode ?? undefined,
                attributes: body?.attributes ?? {},
                allow_backorder: body?.allow_backorder ?? false,
                is_active: body?.is_active ?? true,
                images: Array.isArray(body?.images) && body!.images!.length ? body!.images!.slice(0,4) : [
                    `https://picsum.photos/800/600?random=${Math.floor(Math.random()*1000)}`
                ],
                tags: Array.isArray(body?.tags) ? body!.tags! : [],
                created_at: now,
                updated_at: now,
            } as Product

            mockProducts.unshift(newProduct)
            return HttpResponse.json(newProduct, { status: 201 })
        } catch (e) {
            return new HttpResponse(
                JSON.stringify({ message: 'Invalid request body' }),
                { status: 400 }
            )
        }
    }),

    // Search products
    http.get(API_ROUTES.PRODUCTS.SEARCH, ({ request }) => {
        const url = new URL(request.url)
        const q = url.searchParams.get('q') || ''
        const limit = parseInt(url.searchParams.get('limit') || '10')
        const skip = parseInt(url.searchParams.get('skip') || '0')
        
        const filteredProducts = mockProducts.filter(product =>
            product.name.toLowerCase().includes(q.toLowerCase()) ||
            product.description?.toLowerCase().includes(q.toLowerCase()) ||
            product.brand?.toLowerCase().includes(q.toLowerCase())
        )
        
        const paginatedProducts = filteredProducts.slice(skip, skip + limit)
        
        return HttpResponse.json({
            items: paginatedProducts,
            pagination: {
                page: Math.floor(skip / limit),
                limit,
                total: filteredProducts.length,
            },
        })
    }),

    // Get single product
    http.get(API_ROUTES.PRODUCTS.DETAILS(':id'), ({ params }) => {
        const id = String(params.id as string)
        const product = mockProducts.find(p => p.id === id)
        
        if (!product) {
            return new HttpResponse(
                JSON.stringify({
                    message: 'Product not found',
                    errors: ['Product with the specified ID does not exist'],
                }),
                { status: 404 }
            )
        }
        
        return HttpResponse.json(product)
    }),

    // Get product categories
    http.get(API_ROUTES.PRODUCTS.CATEGORIES, () => {
        return HttpResponse.json(mockCategories)
    }),

    // Get product brands
    http.get(API_ROUTES.PRODUCTS.BRANDS, () => {
        return HttpResponse.json(mockBrands)
    }),

    // Get product reviews
    http.get(API_ROUTES.PRODUCTS.REVIEWS(':id'), ({ params }) => {
        const id = String(params.id as string)
        const product = mockProducts.find(p => p.id === id)
        
        if (!product) {
            return new HttpResponse(
                JSON.stringify({
                    message: 'Product not found',
                    errors: ['Product with the specified ID does not exist'],
                }),
                { status: 404 }
            )
        }
        
        return HttpResponse.json([
            {
                reviewerName: 'John Doe',
                reviewerEmail: 'john@example.com',
                rating: 5,
                comment: 'Excellent product!',
                date: '2024-01-15',
            },
        ])
    }),

    // Get product images
    http.get(API_ROUTES.PRODUCTS.IMAGES(':id'), ({ params }) => {
        const id = String(params.id as string)
        const product = mockProducts.find(p => p.id === id)
        
        if (!product) {
            return new HttpResponse(
                JSON.stringify({
                    message: 'Product not found',
                    errors: ['Product with the specified ID does not exist'],
                }),
                { status: 404 }
            )
        }
        
        return HttpResponse.json(product.images)
    }),
]