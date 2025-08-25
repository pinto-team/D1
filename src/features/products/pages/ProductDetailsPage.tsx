import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useI18n } from "@/shared/hooks/useI18n";
import { fetchProduct, type Product } from "../services/products.api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ImageCarousel } from "../components/ImageCarousel";
import { ProductFacts } from "../components/ProductFacts";
import { ErrorState } from "../components/States";

export default function ProductDetailsPage() {
    const { t } = useI18n();
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["product", id],
        queryFn: () => fetchProduct(String(id)),
        enabled: !!id,
    });

    const product = data as Product | undefined;

    return (
        <SidebarProvider style={{"--sidebar-width":"calc(var(--spacing)*72)","--header-height":"calc(var(--spacing)*12)"} as React.CSSProperties}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col @container/main gap-6 p-6 md:p-8 lg:p-10">
                    {isLoading && <div className="text-sm text-muted-foreground">{t("loading")}</div>}
                    {isError && <ErrorState onRetry={refetch} />}
                    {!isLoading && !product && !isError && <div>{t("products.not_found")}</div>}

                    {product && (
                        <>
                            <div className="flex items-center gap-4">
                                <Button variant="outline" className="rounded-full" onClick={() => navigate(-1)}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    {t("common.back")}
                                </Button>
                                <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
                                <Card className="shadow-lg rounded-xl overflow-hidden">
                                    <CardHeader className="bg-muted/50">
                                        <CardTitle className="text-lg font-semibold">{t("products.images")}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <ImageCarousel images={product.images} altBase={product.name} />
                                    </CardContent>
                                </Card>

                                <Card className="shadow-lg rounded-xl">
                                    <CardHeader className="bg-muted/50">
                                        <CardTitle className="text-lg font-semibold">{t("products.details")}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <ProductFacts product={product} />
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
