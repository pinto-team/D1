import { Link } from "react-router-dom";
import type { Product } from "@/api/resources/products";

export function ProductRow({ product }: { product: Product }) {
    const price = product.base_price != null ? `${product.base_price} ${product.currency ?? ""}`.trim() : "";

    return (
        <Link to={`/products/${product.id}`} className="block transition-colors hover:bg-muted/40">
            <div className="grid grid-cols-[150px_1fr_auto] items-center gap-4 p-3">
                {/* قاب 16:9 */}
                <div className="relative aspect-[16/9] w-full max-w-[150px] overflow-hidden rounded-lg bg-muted">
                    <img
                        src={product.images?.[0] || ""}
                        alt={product.name}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                    />
                </div>
                {/* متن‌ها */}
                <div>
                    <p className="line-clamp-1 font-medium leading-tight">{product.name}</p>
                    {product.brand && (
                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{product.brand}</p>
                    )}
                </div>
                {/* قیمت */}
                {price && <div className="font-medium text-right">{price}</div>}
            </div>
        </Link>
    );
}
