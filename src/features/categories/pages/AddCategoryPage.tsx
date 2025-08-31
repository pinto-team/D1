import * as React from "react";
import { AppSidebar } from "@/features/sidebar/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/shared/hooks/useI18n";
import { ROUTES } from "@/app/routes/routes";
import { CategoryFormRHF } from "@/features/categories/forms";
import { useCreate as useCreateCategory } from "@/features/categories/hooks";
import type { CategoryCreate } from "@/api/resources/categories";
import { toast } from "sonner";

export default function AddCategoryPage() {
    const { t } = useI18n();
    const navigate = useNavigate();
    const create = useCreateCategory();

    function handleSubmit(values: CategoryCreate) {
        create.mutate(values, {
            onSuccess: () => {
                toast.success(t("categories.created_success", { defaultValue: "Category created" } as any));
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
                        <h1 className="text-2xl font-bold">{t("categories.add", { defaultValue: "Add Category" } as any)}</h1>
                        <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" onClick={() => navigate(-1)}>{t("common.back")}</Button>
                            <Button type="submit" form="category-form" disabled={create.isPending}>{create.isPending ? t("common.saving") : t("common.save")}</Button>
                        </div>
                    </div>

                    <CategoryFormRHF onSubmit={handleSubmit} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

