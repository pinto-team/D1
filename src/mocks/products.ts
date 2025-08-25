// mocks/products.ts
import { http, HttpResponse } from 'msw'
import { API_ROUTES } from '@/shared/constants/apiRoutes'

// Mock product data
const mockProducts = [
    {
        id: 1,
        title: 'iPhone 15 Pro',
        price: 999,
        thumbnail: 'https://picsum.photos/300/300?random=1',
        description: 'The latest iPhone with advanced features and premium design.',
        category: 'Electronics',
        brand: 'Apple',
        discountPercentage: 0,
        rating: 4.8,
        stock: 50,
        tags: ['smartphone', 'apple', '5g'],
        sku: 'IPH15PRO-001',
        weight: 0.187,
        dimensions: { width: 71.5, height: 146.7, depth: 8.25 },
        warrantyInformation: '1 year limited warranty',
        shippingInformation: 'Free shipping',
        availabilityStatus: 'In Stock',
        reviews: [
            {
                reviewerName: 'John Doe',
                reviewerEmail: 'john@example.com',
                rating: 5,
                comment: 'Excellent phone, great camera quality!',
                date: '2024-01-15',
            },
        ],
        returnPolicy: '30-day return policy',
        minimumOrderQuantity: 1,
        meta: {
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            barcode: '1234567890123',
            qrCode: 'data:image/png;base64,mock-qr-code',
        },
        images: [
            'https://picsum.photos/800/600?random=1',
            'https://picsum.photos/800/600?random=2',
            'https://picsum.photos/800/600?random=3',
        ],
    },
    {
        id: 2,
        title: 'MacBook Air M2',
        price: 1199,
        thumbnail: 'https://picsum.photos/300/300?random=4',
        description: 'Lightweight laptop with M2 chip for ultimate performance.',
        category: 'Electronics',
        brand: 'Apple',
        discountPercentage: 5,
        rating: 4.9,
        stock: 25,
        tags: ['laptop', 'apple', 'm2'],
        sku: 'MBA-M2-001',
        weight: 1.24,
        dimensions: { width: 304.1, height: 212.4, depth: 11.3 },
        warrantyInformation: '1 year limited warranty',
        shippingInformation: 'Free shipping',
        availabilityStatus: 'In Stock',
        reviews: [
            {
                reviewerName: 'Jane Smith',
                reviewerEmail: 'jane@example.com',
                rating: 5,
                comment: 'Amazing performance and battery life!',
                date: '2024-01-10',
            },
        ],
        returnPolicy: '30-day return policy',
        minimumOrderQuantity: 1,
        meta: {
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-10T00:00:00Z',
            barcode: '1234567890124',
            qrCode: 'data:image/png;base64,mock-qr-code-2',
        },
        images: [
            'https://picsum.photos/800/600?random=4',
            'https://picsum.photos/800/600?random=5',
            'https://picsum.photos/800/600?random=6',
        ],
    },
    {
        id: 3,
        title: 'Samsung Galaxy S24',
        price: 899,
        thumbnail: 'https://picsum.photos/300/300?random=7',
        description: 'Android flagship with cutting-edge features.',
        category: 'Electronics',
        brand: 'Samsung',
        discountPercentage: 10,
        rating: 4.7,
        stock: 75,
        tags: ['smartphone', 'samsung', 'android'],
        sku: 'SGS24-001',
        weight: 0.168,
        dimensions: { width: 70.6, height: 147.3, depth: 7.6 },
        warrantyInformation: '2 year warranty',
        shippingInformation: 'Free shipping',
        availabilityStatus: 'In Stock',
        reviews: [
            {
                reviewerName: 'Mike Johnson',
                reviewerEmail: 'mike@example.com',
                rating: 4,
                comment: 'Great phone, but battery could be better.',
                date: '2024-01-12',
            },
        ],
        returnPolicy: '30-day return policy',
        minimumOrderQuantity: 1,
        meta: {
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-12T00:00:00Z',
            barcode: '1234567890125',
            qrCode: 'data:image/png;base64,mock-qr-code-3',
        },
        images: [
            'https://picsum.photos/800/600?random=7',
            'https://picsum.photos/800/600?random=8',
            'https://picsum.photos/800/600?random=9',
        ],
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
            products: paginatedProducts,
            total: mockProducts.length,
            skip,
            limit,
        })
    }),

    // Search products
    http.get(API_ROUTES.PRODUCTS.SEARCH, ({ request }) => {
        const url = new URL(request.url)
        const q = url.searchParams.get('q') || ''
        const limit = parseInt(url.searchParams.get('limit') || '10')
        const skip = parseInt(url.searchParams.get('skip') || '0')
        
        const filteredProducts = mockProducts.filter(product =>
            product.title.toLowerCase().includes(q.toLowerCase()) ||
            product.description.toLowerCase().includes(q.toLowerCase()) ||
            product.brand.toLowerCase().includes(q.toLowerCase()) ||
            product.category.toLowerCase().includes(q.toLowerCase())
        )
        
        const paginatedProducts = filteredProducts.slice(skip, skip + limit)
        
        return HttpResponse.json({
            products: paginatedProducts,
            total: filteredProducts.length,
            skip,
            limit,
        })
    }),

    // Get single product
    http.get(API_ROUTES.PRODUCTS.DETAILS(':id'), ({ params }) => {
        const id = parseInt(params.id as string)
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
        const id = parseInt(params.id as string)
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
        
        return HttpResponse.json(product.reviews)
    }),

    // Get product images
    http.get(API_ROUTES.PRODUCTS.IMAGES(':id'), ({ params }) => {
        const id = parseInt(params.id as string)
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