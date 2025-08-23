import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/shared/hooks/useI18n";
import { fetchProduct, type ProductDetails } from "../services/products.api";

export default function ProductDetailsPage() {
    const { t } = useI18n();
    const { id } = useParams();

    const { data, isLoading } = useQuery({
        queryKey: ["product", id],
        queryFn: () => fetchProduct(Number(id)),
        enabled: !!id,
    });

    const product = data as ProductDetails | undefined;

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
                                    <h1 className="text-2xl font-semibold">{product.title}</h1>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            {product.images.map((img) => (
                                                <div key={img} className="aspect-square w-full overflow-hidden rounded-md">
                                                    <img src={img} alt={product.title} className="h-full w-full object-contain" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-2">
                                            <p>{product.description}</p>
                                            <p>Category: {product.category}</p>
                                            <p>Brand: {product.brand}</p>
                                            <p>Price: ${product.price}</p>
                                            <p>Discount: {product.discountPercentage}%</p>
                                            <p>Rating: {product.rating}</p>
                                            <p>Stock: {product.stock}</p>
                                            <p>Tags: {product.tags.join(", ")}</p>
                                            <p>SKU: {product.sku}</p>
                                            <p>Weight: {product.weight}</p>
                                            <p>
                                                Dimensions: {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth}
                                            </p>
                                            <p>Warranty Information: {product.warrantyInformation}</p>
                                            <p>Shipping Information: {product.shippingInformation}</p>
                                            <p>Availability Status: {product.availabilityStatus}</p>
                                            <p>Return Policy: {product.returnPolicy}</p>
                                            <p>Minimum Order Quantity: {product.minimumOrderQuantity}</p>
                                            <p>Created At: {product.meta.createdAt}</p>
                                            <p>Updated At: {product.meta.updatedAt}</p>
                                            <p>Barcode: {product.meta.barcode}</p>
                                            <p>QR Code: {product.meta.qrCode}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold">Reviews</h2>
                                        <div className="space-y-4 mt-2">
                                            {product.reviews.map((review, idx) => (
                                                <Card key={idx}>
                                                    <CardHeader className="pb-2">
                                                        <CardTitle className="text-base">{review.reviewerName}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-1">
                                                        <p className="text-sm text-muted-foreground">{review.reviewerEmail}</p>
                                                        <p>Rating: {review.rating}</p>
                                                        <p>{review.comment}</p>
                                                        <p className="text-sm text-muted-foreground">{review.date}</p>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

