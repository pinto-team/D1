// src/api/resources/categories.ts
import { api, request } from "@/api/client";
import { createCrudHooks, type PaginatedResponse } from "@/lib/resourceFactory";

export type Category = {
    id: string;
    name: string;
    parent_id?: string | null;
    created_at?: string;
    updated_at?: string;
};

export type CategoryCreate = {
    name: string;
    parent_id?: string | null;
};

export type CategoryUpdate = Partial<CategoryCreate>;

export type CategoryListParams = Readonly<{ limit?: number; page?: number; q?: string }>;

const categoriesResource = {
    key: "categories",
    list: (params: CategoryListParams, signal?: AbortSignal) =>
        request<PaginatedResponse<Category>>(({ signal: s }) => api.get("/categories", { params, signal: signal ?? s })),
    detail: (id: string, signal?: AbortSignal) =>
        request<Category>(({ signal: s }) => api.get(`/categories/${id}`, { signal: signal ?? s })),
    create: (payload: CategoryCreate, signal?: AbortSignal) =>
        request<Category>(({ signal: s }) => api.post(`/categories`, payload, { signal: signal ?? s })),
    update: (id: string, payload: CategoryUpdate, signal?: AbortSignal) =>
        request<Category>(({ signal: s }) => api.put(`/categories/${id}`, payload, { signal: signal ?? s })),
    remove: (id: string, signal?: AbortSignal) =>
        request<void>(({ signal: s }) => api.delete(`/categories/${id}`, { signal: signal ?? s })),
};

export const Categories = createCrudHooks<Category, Category, CategoryCreate, CategoryUpdate, CategoryListParams>(categoriesResource);

