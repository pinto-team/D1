/**
 * Brand API service
 * -----------------
 * - No hardcoded URLs (uses API_ROUTES)
 * - Strongly typed requests & responses
 * - ESLint-friendly (no `any`, explicit return types)
 * - Small DX niceties: AbortSignal support, safe null fallbacks
 */

import { catalogClient } from "@/lib/axios";
import { API_ROUTES } from "@/shared/constants/apiRoutes";
import { handleAsyncError } from "@/shared/lib/errors";
import { defaultLogger } from "@/shared/lib/logger";

/** Brand entity as returned by the backend */
export interface Brand {
    id: string;
    name: string;
    description?: string | null;
    country?: string | null;
    website?: string | null;
    logo_url?: string | null;
    created_at: string;
    updated_at: string;
}

/** Payload for creating a brand */
export interface CreateBrandRequest {
    name: string;
    description?: string;
    country?: string;
    website?: string;
    logo_url?: string;
}

/** Payload for updating a brand (all fields optional) */
export type UpdateBrandRequest = Partial<CreateBrandRequest>;

/** Generic pagination shape used by list endpoints */
export interface Pagination {
    page: number;
    limit: number;
    total: number;
}

/** List response for brands (aligned with products list shape) */
export interface BrandListResponse {
    items: Brand[];
    pagination: Pagination;
}

/** Shape of /files/upload response (only what we need) */
interface UploadFilesResponse {
    files: Array<{
        id: string;
        url: string;
        filename: string;
        content_type: string;
        size: number;
        created_at: string;
    }>;
}

/** Query params for listing brands */
type BrandListParams = Readonly<{
    limit: number;
    skip: number;
    q?: string;
}>;

/**
 * Fetch paginated brands list
 * @param limit - page size (must be > 0)
 * @param skip  - offset (must be >= 0)
 * @param q     - optional search term
 * @param signal - optional AbortSignal to cancel the request
 */
export async function fetchBrands(
    limit: number,
    skip: number,
    q?: string,
    signal?: AbortSignal
): Promise<BrandListResponse> {
    const logger = defaultLogger.withContext({
        component: "brands.api",
        action: "fetchBrands",
        limit,
        skip,
        q,
    });
    logger.info("Fetching brands list");

    if (signal?.aborted) {
        logger.warn("Request aborted before sending");
        throw new Error("Request aborted");
    }

    const params: BrandListParams = {
        limit: Math.max(1, limit),
        skip: Math.max(0, skip),
        ...(q && q.trim() ? { q } : {}),
    };

    return handleAsyncError(
        catalogClient
            .get<BrandListResponse>(API_ROUTES.BRANDS.LIST, { params, signal, timeout: 10000 })
            .then(({ data }) => {
                console.log("Raw server response:", data); // برای دیباگ
                logger.info("Brands fetched", { count: data?.items?.length, rawData: data });
                return data;
            }),
        "Failed to fetch brands"
    );
}

/**
 * Fetch a single brand by id
 * @param id - brand id (uuid)
 * @param signal - optional AbortSignal
 */
export async function fetchBrand(id: string, signal?: AbortSignal): Promise<Brand> {
    const logger = defaultLogger.withContext({ component: "brands.api", action: "fetchBrand", id });
    logger.info("Fetching brand details");

    return handleAsyncError(
        catalogClient
            .get<Brand>(API_ROUTES.BRANDS.DETAILS(id), { signal })
            .then(({ data }) => data),
        "Failed to fetch brand"
    );
}

/**
 * Create a new brand
 * @param payload - CreateBrandRequest
 * @param signal - optional AbortSignal
 */
export async function createBrand(payload: CreateBrandRequest, signal?: AbortSignal): Promise<Brand> {
    const logger = defaultLogger.withContext({ component: "brands.api", action: "createBrand", name: payload.name });
    logger.info("Creating brand");

    return handleAsyncError(
        catalogClient
            .post<Brand>(API_ROUTES.BRANDS.CREATE, payload, { signal })
            .then(({ data }) => data),
        "Failed to create brand"
    );
}

/**
 * Update an existing brand
 * @param id - brand id (uuid)
 * @param payload - partial fields to update
 * @param signal - optional AbortSignal
 */
export async function updateBrand(
    id: string,
    payload: UpdateBrandRequest,
    signal?: AbortSignal
): Promise<Brand> {
    const logger = defaultLogger.withContext({ component: "brands.api", action: "updateBrand", id });
    logger.info("Updating brand");

    return handleAsyncError(
        catalogClient
            .patch<Brand>(API_ROUTES.BRANDS.UPDATE(id), payload, { signal })
            .then(({ data }) => data),
        "Failed to update brand"
    );
}

/**
 * Delete a brand
 * @param id - brand id (uuid)
 * @param signal - optional AbortSignal
 */
export async function deleteBrand(id: string, signal?: AbortSignal): Promise<void> {
    const logger = defaultLogger.withContext({ component: "brands.api", action: "deleteBrand", id });
    logger.info("Deleting brand");

    return handleAsyncError(
        catalogClient.delete<void>(API_ROUTES.BRANDS.DELETE(id), { signal }).then(() => {
            logger.info("Brand deleted", { id });
        }),
        "Failed to delete brand"
    );
}

/**
 * Upload a single image file and return its public URL
 * - Sends multipart/form-data with key "files"
 * - Returns the first uploaded file URL
 * @param file - image file (validated by caller if needed)
 * @param signal - optional AbortSignal
 */
export async function uploadSingleImage(file: File, signal?: AbortSignal): Promise<string> {
    const logger = defaultLogger.withContext({
        component: "brands.api",
        action: "uploadSingleImage",
        file: file.name,
        size: file.size,
        type: file.type,
    });

    const form = new FormData();
    form.append("files", file);

    return handleAsyncError(
        catalogClient
            .post<UploadFilesResponse>(API_ROUTES.FILES.UPLOAD, form, {
                headers: { "Content-Type": "multipart/form-data" },
                signal,
            })
            .then(({ data }) => {
                const url = data?.files?.[0]?.url;
                if (!url) {
                    throw new Error("Upload response missing files[0].url");
                }
                logger.info("File uploaded", { url });
                return url;
            }),
        "Failed to upload file"
    );
}