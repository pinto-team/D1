import React from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/features/sidebar/app-sidebar.tsx";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/shared/hooks/useI18n";
import { useForm } from "react-hook-form";
import { useCreate as useCreateProduct } from "@/features/products/hooks";
import { type ProductCreate as AddProductRequest, type Product } from "@/api/resources/products";
import { toast } from "sonner";
import { ROUTES } from "@/app/routes/routes";
import { ProductFormRHF } from "@/features/products/forms";

export default function AddProductPage() {
    const { t } = useI18n();
    const navigate = useNavigate();
    const { reset } = useForm<AddProductRequest>();

    const createMutation = useCreateProduct();

    function onSubmit(values: AddProductRequest) {
        createMutation.mutate(values, {
            onSuccess: (created: Product) => {
                toast.success(t("products.add") + " موفق بود")
                reset()
                navigate(ROUTES.PRODUCT_DETAILS.replace(":id", created.id))
            },
            onError: () => {
                toast.error(t("products.error_message"))
            },
        })
    }

    return (
        <SidebarProvider style={{"--sidebar-width":"calc(var(--spacing)*72)","--header-height":"calc(var(--spacing)*12)"} as React.CSSProperties}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col @container/main gap-6 p-6 md:p-8 lg:p-10">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight">{t("products.add")}</h1>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => navigate(-1)}>{t("common.back")}</Button>
                            <Button type="submit" form="product-form" disabled={createMutation.isPending}>{createMutation.isPending ? t("loading") : t("products.add")}</Button>
                        </div>
                    </div>
                    <ProductFormRHF formId="product-form" onSubmit={onSubmit} submitting={createMutation.isPending} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

