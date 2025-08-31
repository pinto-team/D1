// src/lib/resourceFactory.ts
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
    type QueryKey,
    type UseInfiniteQueryResult,
    type UseMutationResult,
    type UseQueryResult,
} from "@tanstack/react-query";

export type ListParams = {
    page?: number;
    limit?: number;
    cursor?: string | null;
    q?: string;
    [key: string]: unknown;
};

export type PaginatedResponse<TItem> = {
    items: TItem[];
    pagination?: {
        page?: number;
        limit?: number;
        total?: number;
        total_pages?: number;
        has_next?: boolean;
        has_previous?: boolean;
        cursor?: string | null;
        next_cursor?: string | null;
        prev_cursor?: string | null;
    } | null;
};

export type CrudResource<TItem, TDetail, TCreate, TUpdate, TListParams extends ListParams = ListParams> = {
    key: string; // e.g. "brands"
    list: (params: TListParams, signal?: AbortSignal) => Promise<PaginatedResponse<TItem>>;
    detail: (id: string, signal?: AbortSignal) => Promise<TDetail>;
    create: (payload: TCreate, signal?: AbortSignal) => Promise<TDetail>;
    update: (id: string, payload: TUpdate, signal?: AbortSignal) => Promise<TDetail>;
    remove: (id: string, signal?: AbortSignal) => Promise<unknown>;
    getId?: (item: TItem | TDetail) => string; // fallback assumes (item as any).id
};

type CreateCrudHooksReturn<TItem, TDetail, TCreate, TUpdate, TListParams extends ListParams> = {
    keys: {
        all: () => QueryKey;
        lists: () => QueryKey;
        list: (params: TListParams) => QueryKey;
        details: () => QueryKey;
        detail: (id: string) => QueryKey;
    };
    useList: (
        params: TListParams,
        options?: {
            enabled?: boolean;
            staleTime?: number;
            gcTime?: number;
        }
    ) => UseQueryResult<PaginatedResponse<TItem>>;
    useInfiniteList: (
        params: Omit<TListParams, "page"> & { limit?: number },
        options?: {
            enabled?: boolean;
            staleTime?: number;
            gcTime?: number;
            getNextPageParam?: (
                lastPage: PaginatedResponse<TItem>,
                allPages: PaginatedResponse<TItem>[]
            ) => number | string | null | undefined;
        }
    ) => UseInfiniteQueryResult<import("@tanstack/react-query").InfiniteData<PaginatedResponse<TItem>, unknown>>;
    useDetail: (
        id: string,
        options?: { enabled?: boolean; staleTime?: number; gcTime?: number }
    ) => UseQueryResult<TDetail>;
    useCreate: (
        invalidateOn?: { list?: boolean; detailIdFromResult?: (created: TDetail) => string | null }
    ) => UseMutationResult<TDetail, unknown, TCreate>;
    useUpdate: (
        id: string,
        invalidateOn?: { list?: boolean; detail?: boolean }
    ) => UseMutationResult<TDetail, unknown, TUpdate>;
    useRemove: (
        options?: {
            optimistic?: boolean;
            getListParamsForInvalidate?: () => TListParams | TListParams[];
        }
    ) => UseMutationResult<unknown, unknown, string>;
};

export function createCrudHooks<
    TItem,
    TDetail = TItem,
    TCreate = unknown,
    TUpdate = Partial<TCreate>,
    TListParams extends ListParams = ListParams,
>(resource: CrudResource<TItem, TDetail, TCreate, TUpdate, TListParams>): CreateCrudHooksReturn<TItem, TDetail, TCreate, TUpdate, TListParams> {
    const getId = (item: TItem | TDetail): string =>
        resource.getId?.(item) ?? (item as unknown as { id: string }).id;

    const keys = {
        all: () => [resource.key] as const,
        lists: () => [resource.key, "list"] as const,
        list: (params: TListParams) => [resource.key, "list", params] as const,
        details: () => [resource.key, "detail"] as const,
        detail: (id: string) => [resource.key, "detail", id] as const,
    } as const;

    function useList(params: TListParams, options?: { enabled?: boolean; staleTime?: number; gcTime?: number }) {
        return useQuery({
            queryKey: keys.list(params),
            queryFn: ({ signal }) => resource.list(params, signal),
            enabled: options?.enabled ?? true,
            staleTime: options?.staleTime,
            gcTime: options?.gcTime,
        });
    }

    function useInfiniteList(
        params: Omit<TListParams, "page"> & { limit?: number },
        options?: {
            enabled?: boolean;
            staleTime?: number;
            gcTime?: number;
            getNextPageParam?: (
                lastPage: PaginatedResponse<TItem>,
                allPages: PaginatedResponse<TItem>[]
            ) => number | string | null | undefined;
        },
    ) {
        return useInfiniteQuery({
            queryKey: keys.lists(),
            initialPageParam: ("cursor" in params && (params as any).cursor) ? (params as any).cursor : 1,
            queryFn: ({ pageParam, signal }) => {
                const isCursor = typeof pageParam === "string" || pageParam === null;
                const merged = {
                    ...(params as object),
                    ...(isCursor ? { cursor: pageParam } : { page: Number(pageParam) || 1 }),
                } as TListParams;
                return resource.list(merged, signal);
            },
            getNextPageParam: (lastPage, allPages) => {
                if (options?.getNextPageParam) return options.getNextPageParam(lastPage, allPages);
                const pg = lastPage.pagination;
                if (!pg) return undefined;
                if (pg.next_cursor !== undefined) return pg.next_cursor ?? undefined;
                if (pg.has_next && pg.page && pg.limit) {
                    const totalPages = pg.total_pages ?? (pg.total && pg.limit ? Math.ceil(pg.total / pg.limit) : undefined);
                    const nextPageIndex = (allPages.length + 1);
                    if (!totalPages || nextPageIndex <= totalPages) return nextPageIndex;
                }
                return undefined;
            },
            enabled: options?.enabled ?? true,
            staleTime: options?.staleTime,
            gcTime: options?.gcTime,
        });
    }

    function useDetail(
        id: string,
        options?: { enabled?: boolean; staleTime?: number; gcTime?: number },
    ) {
        const enabled = options?.enabled ?? (!!id && id !== ":id");
        return useQuery({
            queryKey: keys.detail(id),
            queryFn: ({ signal }) => resource.detail(id, signal),
            enabled,
            staleTime: options?.staleTime,
            gcTime: options?.gcTime,
        });
    }

    function useCreate(invalidateOn?: { list?: boolean; detailIdFromResult?: (created: TDetail) => string | null }) {
        const qc = useQueryClient();
        return useMutation({
            mutationFn: (payload: TCreate) => resource.create(payload),
            onSuccess: (created) => {
                if (invalidateOn?.list !== false) {
                    qc.invalidateQueries({ queryKey: keys.lists() });
                }
                const id = invalidateOn?.detailIdFromResult?.(created) ?? getId(created);
                if (id) qc.invalidateQueries({ queryKey: keys.detail(id) });
            },
        });
    }

    function useUpdate(id: string, invalidateOn?: { list?: boolean; detail?: boolean }) {
        const qc = useQueryClient();
        return useMutation({
            mutationFn: (payload: TUpdate) => resource.update(id, payload),
            onSuccess: (updated) => {
                if (invalidateOn?.detail !== false) {
                    qc.invalidateQueries({ queryKey: keys.detail(id) });
                }
                if (invalidateOn?.list !== false) {
                    qc.invalidateQueries({ queryKey: keys.lists() });
                }
            },
        });
    }

    function useRemove(options?: { optimistic?: boolean; getListParamsForInvalidate?: () => TListParams | TListParams[] }) {
        const qc = useQueryClient();
        return useMutation({
            mutationFn: (id: string) => resource.remove(id),
            onMutate: async (id: string) => {
                if (!options?.optimistic) return;
                await qc.cancelQueries({ queryKey: keys.lists() });
                const listKeys = qc.getQueryCache().findAll({ queryKey: keys.lists() });
                const previous = listKeys.map((q) => ({ key: q.queryKey, data: q.state.data as PaginatedResponse<TItem> | undefined }));
                // Optimistically remove item from cached lists
                previous.forEach(({ key, data }) => {
                    if (!data?.items) return;
                    const newItems = data.items.filter((it) => getId(it) !== id);
                    qc.setQueryData(key, { ...data, items: newItems });
                });
                return { previous };
            },
            onError: (_err, _id, ctx) => {
                if (!options?.optimistic || !ctx) return;
                (ctx.previous as Array<{ key: QueryKey; data: unknown }>).forEach(({ key, data }) => {
                    qc.setQueryData(key, data);
                });
            },
            onSettled: () => {
                const toInvalidate = options?.getListParamsForInvalidate?.();
                if (!toInvalidate) {
                    qc.invalidateQueries({ queryKey: keys.lists() });
                } else if (Array.isArray(toInvalidate)) {
                    toInvalidate.forEach((p) => qc.invalidateQueries({ queryKey: keys.list(p) }));
                } else {
                    qc.invalidateQueries({ queryKey: keys.list(toInvalidate as TListParams) });
                }
            },
        });
    }

    return { keys, useList, useInfiniteList, useDetail, useCreate, useUpdate, useRemove };
}

export type { QueryKey };

