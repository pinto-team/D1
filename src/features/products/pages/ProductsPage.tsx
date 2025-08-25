import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/shared/hooks/useI18n";
import { fetchProducts, type Product } from "../services/products.api";

const LIMIT = 10;

export default function ProductsPage() {
    const { t } = useI18n();
    const [page, setPage] = useState(0);
    const [query, setQuery] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["products", page, query],
        queryFn: () => fetchProducts(LIMIT, page * LIMIT, query),
    });

    const products = data?.items ?? [];
    const total = data?.pagination.total ?? 0;
    const totalPages = Math.ceil(total / LIMIT);
    const hasPrev = page > 0;
    const hasNext = page + 1 < totalPages;

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
                            <div className="flex items-center justify-between gap-2 px-4 lg:px-6">
                                <Input
                                    placeholder={t("common.search")}
                                    value={query}
                                    onChange={(e) => {
                                        setPage(0);
                                        setQuery(e.target.value);
                                    }}
                                    className="max-w-xs"
                                />
                                <Button onClick={() => alert("Add Product")}>+ Add Product</Button>
                            </div>
                            <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:px-6">
                                {isLoading && <div>{t("loading")}</div>}
                                {!isLoading &&
                                    products.map((product: Product) => (
                                        <Link
                                            key={product.id}
                                            to={`/products/${product.id}`}
                                            className="block"
                                        >
                                            <Card className="@container/card">
                                                <CardHeader className="p-0">
                                                    <div className="aspect-square w-full overflow-hidden rounded-t-xl">
                                                        <img
                                                            src={product.images?.[0] || ""}
                                                            alt={product.name}
                                                            className="h-full w-full object-contain"
                                                        />
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="p-4">
                                                    <CardTitle className="text-base">
                                                        {product.name}
                                                    </CardTitle>
                                                    <p className="text-sm text-muted-foreground">
                                                        {product.base_price} {product.currency}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </Link>
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
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <Button
                                            key={i}
                                            variant={i === page ? "default" : "outline"}
                                            onClick={() => setPage(i)}
                                        >
                                            {i + 1}
                                        </Button>
                                    ))}
                                </div>
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

