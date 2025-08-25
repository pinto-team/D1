import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import type { Product } from "../services/products.api";

export function ProductCard({ product }: { product: Product }) {
    const price = product.base_price != null ? `${product.base_price} ${product.currency ?? ""}`.trim() : "";

    return (
        <Link to={`/products/${product.id}`} className="group block">
            <Card className="!p-0 !gap-0 transition-all hover:shadow-md">
                <CardHeader className="p-0">
                    <div className="p-2">
                        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl bg-muted/20 dark:bg-muted/10">
                            <img
                                src={product.images?.[0] || ""}
                                alt={product.name}
                                className="absolute inset-0 h-full w-full object-cover"
                                loading="lazy"
                                draggable={false}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-3 py-3">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <CardTitle className="line-clamp-1 text-[15px] leading-tight">
                                {product.name}
                            </CardTitle>
                            {product.brand && (
                                <p className="line-clamp-1 text-[12px] text-muted-foreground">
                                    {product.brand}
                                </p>
                            )}
                        </div>
                        {price && (
                            <Badge variant="secondary" className="shrink-0">
                                {price}
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
