// src/api/uploads.ts
import { api, request } from "@/api/client";
import { API_ROUTES } from "@/shared/constants/apiRoutes";

export async function uploadSingleImage(file: File, signal?: AbortSignal): Promise<string> {
    const form = new FormData();
    form.append("files", file);
    const res = await request<{ files: Array<{ url: string }> }>(({ signal: s }) =>
        api.post(API_ROUTES.FILES.UPLOAD, form, {
            headers: { "Content-Type": "multipart/form-data" },
            signal: signal ?? s,
        }),
    );
    const url = res?.files?.[0]?.url;
    if (!url) throw new Error("Upload failed");
    return url;
}

