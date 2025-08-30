import * as React from "react";
import { AppSidebar } from "@/features/sidebar/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "@/shared/hooks/useI18n";
import { ROUTES } from "@/app/routes/routes";
import { CategoryFormRHF } from "@/features/categories/forms";
import { useDetail as useCategory, useUpdate as useUpdateCategory, useRemove as useDeleteCategory } from "@/features/categories/hooks";
import type { Category, CategoryCreate } from "@/api/resources/categories";
import { toast } from "sonner";

export default function EditCategoryPage() {
    const { t } = useI18n();
    const navigate = useNavigate();
    const params = useParams();
    const id = String(params.id || "");
    const { data, isLoading, error, refetch } = useCategory(id);
    const update = useUpdateCategory(id);
    const del = useDeleteCategory();

    function handleSubmit(values: CategoryCreate) {
        update.mutate(values, {
            onSuccess: () => {
                toast.success(t("categories.saved_success", { defaultValue: "Category saved" } as any));
                navigate(ROUTES.CATEGORIES);
            },
            onError: () => toast.error(t("common.error")),
        });
    }

    function handleDelete() {
        if (!id) return;
        if (!window.confirm(t("categories.confirm_delete") as string)) return;
        del.mutate(id, {
            onSuccess: () => {
                toast.success(t("categories.deleted", { defaultValue: "Category deleted" } as any));
                navigate(ROUTES.CATEGORIES);
            },
            onError: () => toast.error(t("common.error")),
        });
    }

    const style = { "--sidebar-width": "calc(var(--spacing)*72)", "--header-height": "calc(var(--spacing)*12)" } as React.CSSProperties;

    return (
        <SidebarProvider style={style}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col gap-4 p-6 md:gap-6 md:p-8 lg:p-10">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">{t("categories.edit", { defaultValue: "Edit Category" } as any)}</h1>
                        <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" onClick={() => navigate(-1)}>{t("common.back")}</Button>
                            <Button type="submit" form="category-form" disabled={update.isPending}>{update.isPending ? t("common.saving") : t("common.save")}</Button>
                            <Button type="button" variant="destructive" onClick={handleDelete}>{t("actions.delete")}</Button>
                        </div>
                    </div>
                    {isLoading && <div className="text-sm text-muted-foreground">{t("common.loading")}</div>}
                    {error && <div className="text-sm text-red-500">{t("common.error")}</div>}
                    {data && <CategoryFormRHF defaultValues={{ name: (data as Category).name }} onSubmit={handleSubmit} />}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

