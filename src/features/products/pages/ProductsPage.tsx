import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppSidebar } from "@/features/sidebar/app-sidebar.tsx";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useI18n } from "@/shared/hooks/useI18n";
import { fetchProducts, type Product } from "../services/products.api";

import { ProductsToolbar } from "../components/ProductsToolbar";
import { ProductsPagination } from "../components/ProductsPagination";
import { ProductCard } from "../components/ProductCard";
import { ProductRow } from "../components/ProductRow";
import { EmptyState, ErrorState, ProductsSkeleton } from "../components/States";
import { Separator } from "@/components/ui/separator";
import useDebounced from "@/shared/hooks/useDebounced";

type SortKey = "relevance" | "price_asc" | "price_desc";

export default function ProductsPage() {
    const { t } = useI18n();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(12);
    const [query, setQuery] = useState("");
    const [view, setView] = useState<"grid" | "list">("grid");
    const [sort, setSort] = useState<SortKey>("relevance");
    const debouncedQuery = useDebounced(query, 450);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["products", page, debouncedQuery, pageSize],
        queryFn: () => fetchProducts(pageSize, page * pageSize, debouncedQuery), // ✅ سه آرگومان
    });

    const products: Product[] = data?.items ?? [];
    const total = data?.pagination?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const hasPrev = page > 0;
    const hasNext = page + 1 < totalPages;

    const sorted = useMemo(() => {
        if (sort === "relevance") return products;
        return [...products].sort((a, b) =>
            sort === "price_asc"
                ? (a.base_price ?? 0) - (b.base_price ?? 0)
                : (b.base_price ?? 0) - (a.base_price ?? 0)
        );
    }, [products, sort]);

    useEffect(() => setPage(0), [debouncedQuery, pageSize, sort]);

    return (
        <SidebarProvider style={{"--sidebar-width":"calc(var(--spacing)*72)","--header-height":"calc(var(--spacing)*12)"} as React.CSSProperties}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col @container/main gap-4 py-4 md:gap-6 md:py-6">
                    <ProductsToolbar
                        query={query} onQuery={setQuery}
                        pageSize={pageSize} onPageSize={setPageSize}
                        sort={sort} onSort={setSort}
                        view={view} onView={v => v && setView(v)}
                        onRefresh={refetch}
                        isRefreshing={isLoading}
                        title={t("menu.products")}
                        subtitle={total ? t("common.showing_count", {count: total}) : t("common.search_hint")}
                    />

                    <Separator className="mx-4 lg:mx-6" />

                    <div className="px-4 lg:px-6">
                        {isError ? (
                            <ErrorState onRetry={refetch} />
                        ) : isLoading && !products.length ? (
                            <ProductsSkeleton view={view} />
                        ) : sorted.length ? (
                            view === "grid" ? (
                                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
                                    {sorted.map(p => <ProductCard key={p.id} product={p} />)}
                                </div>
                            ) : (
                                <div className="divide-y rounded-xl border">
                                    {sorted.map(p => <ProductRow key={p.id} product={p} />)}
                                </div>
                            )
                        ) : (
                            <EmptyState />
                        )}
                    </div>

                    <ProductsPagination
                        page={page} totalPages={totalPages}
                        onFirst={() => setPage(0)}
                        onPrev={() => setPage(p => Math.max(0, p - 1))}
                        onNext={() => setPage(p => p + 1)}
                        onLast={() => setPage(totalPages - 1)}
                        hasPrev={hasPrev} hasNext={hasNext}
                        pageSize={pageSize} onPageSize={setPageSize}
                    />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
