// src/api/resources/products.ts
import { api, request } from "@/api/client";
import { createCrudHooks, type PaginatedResponse } from "@/lib/resourceFactory";
import { API_ROUTES } from "@/shared/constants/apiRoutes";

export type Product = {
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
    allow_backorder?: boolean;
    is_active?: boolean;
    attributes?: {
        weight?: number;
        dimensions?: { length: number; width: number; height: number };
        packaging?: string;
        storage?: string;
        shelf_life_days?: number;
        halal?: boolean;
    };
    barcode?: string;
    warehouse_availability?: Array<{ warehouse_id: string; stock: number; lead_time_days: number }>;
    pricing_tiers?: Array<{ min_qty: number; unit_price: number }>;
    uom?: string;
    pack_size?: number | null;
    case_size?: number | null;
    images: string[];
    tags: string[];
    created_at: string;
    updated_at: string;
};

export type ProductCreate = {
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
    tax_rate?: number;
    min_order_quantity: number;
    min_order_multiple?: number;
    stock: number;
    allow_backorder?: boolean;
    is_active?: boolean;
    uom?: string;
    pack_size?: number | null;
    case_size?: number | null;
    attributes?: {
        weight?: number;
        dimensions?: { length: number; width: number; height: number };
    };
    barcode?: string;
    warehouse_availability?: Array<{ warehouse_id: string; stock: number; lead_time_days: number }>;
    pricing_tiers?: Array<{ min_qty: number; unit_price: number }>;
    images?: string[];
    tags?: string[];
};

export type ProductUpdate = Partial<ProductCreate>;

export type ProductListParams = Readonly<{ limit?: number; page?: number; q?: string }>;

const productsResource = {
    key: "products",
    list: (params: ProductListParams, signal?: AbortSignal) =>
        request<PaginatedResponse<Product>>(({ signal: s }) =>
            api.get(params.q ? API_ROUTES.PRODUCTS.SEARCH : API_ROUTES.PRODUCTS.LIST, {
                params: params.q ? { limit: params.limit, q: params.q } : params,
                signal: signal ?? s,
            }),
        ),
    detail: (id: string, signal?: AbortSignal) =>
        request<Product>(({ signal: s }) => api.get(API_ROUTES.PRODUCTS.DETAILS(id), { signal: signal ?? s })),
    create: (payload: ProductCreate, signal?: AbortSignal) =>
        request<Product>(({ signal: s }) => api.post(API_ROUTES.PRODUCTS.CREATE, payload, { signal: signal ?? s })),
    update: (id: string, payload: ProductUpdate, signal?: AbortSignal) =>
        request<Product>(({ signal: s }) => api.put(API_ROUTES.PRODUCTS.UPDATE(id), payload, { signal: signal ?? s })),
    remove: (id: string, signal?: AbortSignal) =>
        request<void>(({ signal: s }) => api.delete(API_ROUTES.PRODUCTS.DELETE(id), { signal: signal ?? s })),
};

export const Products = createCrudHooks<Product, Product, ProductCreate, ProductUpdate, ProductListParams>(productsResource);

