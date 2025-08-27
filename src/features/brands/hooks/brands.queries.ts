/**
 * React Query hooks for Brand feature
 * -----------------------------------
 * - Strongly typed query keys
 * - Abortable queries (passes AbortSignal from react-query to API layer)
 * - Pagination-friendly (placeholderData: keepPreviousData)
 * - ESLint/TypeScript friendly (no `any`, explicit types)
 */

import {
    useMutation,
    useQuery,
    useQueryClient,
    keepPreviousData,
    type UseQueryResult,
} from "@tanstack/react-query";
import {
    fetchBrands,
    fetchBrand,
    createBrand,
    updateBrand,
    deleteBrand,
    type CreateBrandRequest,
    type UpdateBrandRequest,
} from "../services/brands.api";
import { defaultLogger } from "@/shared/lib/logger";

/** Filters used for list queries */
export type BrandListFilters = Readonly<{
    limit: number;
    page: number; // 1-based page index as per backend
    q?: string;
}>;

/** Centralized query keys to keep cache consistent and type-safe */
export const brandsQueryKeys = {
    all: ["brands"] as const,
    lists: () => [...brandsQueryKeys.all, "list"] as const,
    list: (filters: BrandListFilters) => [...brandsQueryKeys.lists(), filters] as const,
    details: () => [...brandsQueryKeys.all, "detail"] as const,
    detail: (id: string) => [...brandsQueryKeys.details(), id] as const,
} as const;

/**
 * Fetch paginated brands
 * - Uses placeholderData: keepPreviousData for smoother page transitions (RQ v5)
 * - Enabled only when `limit > 0`
 */
export function useBrands(
    limit: number,
    page: number,
    q?: string
): UseQueryResult<Awaited<ReturnType<typeof fetchBrands>>> {
    const logger = defaultLogger.withContext({
        component: "brands.queries",
        action: "useBrands",
        limit,
        page,
        q,
    });

    return useQuery({
        queryKey: brandsQueryKeys.list({ limit, page, q }),
        queryFn: ({ signal }) => {
            logger.info("Query: fetch brands");
            return fetchBrands(limit, page, q, signal);
        },
        staleTime: 2 * 60_000, // 2 دقیقه
        gcTime: 5 * 60_000, // 5 دقیقه
        enabled: limit > 0 && page > 0,
        retry: 1, // یک بار تلاش مجدد
        placeholderData: keepPreviousData,
    });
}

/**
 * Fetch single brand by id
 * - Guarded with `enabled` to avoid firing with empty id
 */
export function useBrand(id: string): UseQueryResult<Awaited<ReturnType<typeof fetchBrand>>> {
    const logger = defaultLogger.withContext({
        component: "brands.queries",
        action: "useBrand",
        id,
    });

    return useQuery({
        queryKey: brandsQueryKeys.detail(id),
        queryFn: ({ signal }) => {
            logger.info("Query: fetch brand");
            return fetchBrand(id, signal);
        },
        staleTime: 5 * 60_000,
        gcTime: 10 * 60_000,
        enabled: Boolean(id),
    });
}

/**
 * Create brand mutation
 * - Invalidates list caches on success
 */
export function useCreateBrand() {
    const qc = useQueryClient();
    const logger = defaultLogger.withContext({
        component: "brands.queries",
        action: "useCreateBrand",
    });

    return useMutation({
        mutationFn: (payload: CreateBrandRequest) => {
            logger.info("Mutating: create brand");
            return createBrand(payload);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: brandsQueryKeys.lists() });
        },
    });
}

/**
 * Update brand mutation
 * - Invalidates both detail and list caches on success
 */
export function useUpdateBrand(id: string) {
    const qc = useQueryClient();
    const logger = defaultLogger.withContext({
        component: "brands.queries",
        action: "useUpdateBrand",
        id,
    });

    return useMutation({
        mutationFn: (payload: UpdateBrandRequest) => {
            logger.info("Mutating: update brand");
            return updateBrand(id, payload);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: brandsQueryKeys.detail(id) });
            qc.invalidateQueries({ queryKey: brandsQueryKeys.lists() });
        },
    });
}

/**
 * Delete brand mutation
 * - Invalidates list caches on success
 */
export function useDeleteBrand() {
    const qc = useQueryClient();
    const logger = defaultLogger.withContext({
        component: "brands.queries",
        action: "useDeleteBrand",
    });

    return useMutation({
        mutationFn: (id: string) => {
            logger.info("Mutating: delete brand", { id });
            return deleteBrand(id);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: brandsQueryKeys.lists() });
        },
    });
}