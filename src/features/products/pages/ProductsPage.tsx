import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/shared/hooks/useI18n";
import { fetchProducts, type Product } from "../services/products.api";

const LIMIT = 10;

export default function ProductsPage() {
    const { t } = useI18n();
    const [page, setPage] = useState(0);

    const { data, isLoading } = useQuery({
        queryKey: ["products", page],
        queryFn: () => fetchProducts(LIMIT, page * LIMIT),
    });

    const products = data?.products ?? [];
    const total = data?.total ?? 0;
    const hasPrev = page > 0;
    const hasNext = (page + 1) * LIMIT < total;

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
                            <h1 className="px-4 text-2xl font-semibold lg:px-6">
                                {t("menu.products")}
                            </h1>
                            <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:px-6">
                                {isLoading && <div>{t("loading")}</div>}
                                {!isLoading &&
                                    products.map((product: Product) => (
                                        <Card key={product.id} className="@container/card">
                                            <CardHeader className="p-0">
                                                <img
                                                    src={product.thumbnail}
                                                    alt={product.title}
                                                    className="h-40 w-full rounded-t-xl object-cover"
                                                />
                                            </CardHeader>
                                            <CardContent className="p-4">
                                                <CardTitle className="text-base">
                                                    {product.title}
                                                </CardTitle>
                                                <p className="text-sm text-muted-foreground">
                                                    ${product.price}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                            </div>
                            <div className="flex items-center justify-between px-4 lg:px-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setPage((p) => p - 1)}
                                    disabled={!hasPrev}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={!hasNext}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

