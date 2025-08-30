// src/api/resources/brands.ts
import { api, request } from "@/api/client";
import { createCrudHooks, type PaginatedResponse } from "@/lib/resourceFactory";
import { API_ROUTES } from "@/shared/constants/apiRoutes";

export type Brand = {
    id: string;
    name: string;
    description?: string | null;
    country?: string | null;
    website?: string | null;
    logo_url?: string | null;
    created_at?: string;
    updated_at?: string;
};

export type BrandCreate = {
    name: string;
    description?: string;
    country?: string;
    website?: string;
    logo_url?: string;
};

export type BrandUpdate = Partial<BrandCreate>;

export type BrandListParams = Readonly<{ limit?: number; page?: number; q?: string }>

const brandsResource = {
    key: "brands",
    list: (params: BrandListParams, signal?: AbortSignal) =>
        request<PaginatedResponse<Brand>>(({ signal: s }) =>
            api.get(API_ROUTES.BRANDS.LIST, { params, signal: signal ?? s }),
        ),
    detail: (id: string, signal?: AbortSignal) =>
        request<Brand>(({ signal: s }) => api.get(API_ROUTES.BRANDS.DETAILS(id), { signal: signal ?? s })),
    create: (payload: BrandCreate, signal?: AbortSignal) =>
        request<Brand>(({ signal: s }) => api.post(API_ROUTES.BRANDS.CREATE, payload, { signal: signal ?? s })),
    update: (id: string, payload: BrandUpdate, signal?: AbortSignal) =>
        request<Brand>(({ signal: s }) => api.put(API_ROUTES.BRANDS.UPDATE(id), payload, { signal: signal ?? s })),
    remove: (id: string, signal?: AbortSignal) =>
        request<void>(({ signal: s }) => api.delete(API_ROUTES.BRANDS.DELETE(id), { signal: signal ?? s })),
};

export const Brands = createCrudHooks<Brand, Brand, BrandCreate, BrandUpdate, BrandListParams>(brandsResource);

