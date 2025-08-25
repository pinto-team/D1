import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/shared/hooks/useI18n";
import { fetchProduct, type Product } from "../services/products.api";

export default function ProductDetailsPage() {
    const { t } = useI18n();
    const { id } = useParams();

    const { data, isLoading } = useQuery({
        queryKey: ["product", id],
        queryFn: () => fetchProduct(String(id)),
        enabled: !!id,
    });

    const product = data as Product | undefined;

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            {isLoading && <div className="px-4">{t("loading")}</div>}
                            {product && (
                                <div className="px-4 lg:px-6 space-y-6">
                                    <h1 className="text-2xl font-semibold">{product.name}</h1>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            {product.images.map((img) => (
                                                <div key={img} className="aspect-square w-full overflow-hidden rounded-md">
                                                    <img src={img} alt={product.name} className="h-full w-full object-contain" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-2">
                                            <p>{product.description}</p>
                                            <p>Category ID: {product.category_id}</p>
                                            <p>Brand: {product.brand}</p>
                                            <p>Price: {product.base_price} {product.currency}</p>
                                            <p>Tax Rate: {product.tax_rate}%</p>
                                            <p>Stock: {product.stock}</p>
                                            <p>Tags: {product.tags.join(", ")}</p>
                                            <p>SKU: {product.sku}</p>
                                            <p>Weight: {product.attributes?.weight}</p>
                                            <p>
                                                Dimensions: {product.attributes?.dimensions?.length} x {product.attributes?.dimensions?.width} x {product.attributes?.dimensions?.height}
                                            </p>
                                            <p>Allow Backorder: {product.allow_backorder ? 'Yes' : 'No'}</p>
                                            <p>Active: {product.is_active ? 'Yes' : 'No'}</p>
                                            <p>Min Order Quantity: {product.min_order_quantity}</p>
                                            <p>Created At: {product.created_at}</p>
                                            <p>Updated At: {product.updated_at}</p>
                                            <p>Barcode: {product.barcode}</p>
                                        </div>
                                    </div>
                                    {/* Reviews section removed here; reviews are fetched separately via hook if needed */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

