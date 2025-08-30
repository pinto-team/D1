import { Badge } from "@/components/ui/badge";
import { Tag, Package, Percent, ShoppingCart, CheckCircle, Scale, Ruler, Shield, Info, Truck, RotateCcw, Calendar, Barcode } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/shared/hooks/useI18n";
import type { Product } from "@/api/resources/products";

export function ProductFacts({ product }: { product: Product }) {
    const { t } = useI18n();
    const dims = product.attributes?.dimensions;
    const dimsText = dims ? [dims.length, dims.width, dims.height].map(v => v ?? "-").join(" × ") : "-";

    return (
        <div className="space-y-6">
            {product.description && <p className="text-base leading-relaxed text-muted-foreground">{product.description}</p>}
            <Separator />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Fact icon={<Tag className="h-5 w-5 text-primary" />} label={t("products.category")} value={String(product.category_id)} />
                <Fact icon={<Package className="h-5 w-5 text-primary" />} label={t("products.brand")} value={product.brand || "-"} />
                <Fact icon={<Badge variant="secondary" className="text-base font-bold" />} label={t("products.price")} value={`${product.base_price ?? "-"} ${product.currency ?? ""}`.trim()} isPrice />
                <Fact icon={<Percent className="h-5 w-5 text-primary" />} label={t("products.tax_rate")} value={product.tax_rate != null ? `${product.tax_rate}%` : "-"} />
                <Fact icon={<ShoppingCart className="h-5 w-5 text-primary" />} label={t("products.stock")} value={String(product.stock ?? "-")} />
                <Fact icon={<CheckCircle className="h-5 w-5 text-primary" />} label={t("products.min_order")} value={String(product.min_order_quantity ?? "-")} />
            </div>
            <Separator />
            <div className="space-y-3 text-sm">
                <Row icon={<Tag className="h-5 w-5 text-primary" />} label={t("products.tags")} value={product.tags?.length ? product.tags.join(", ") : "-"} />
                <Row icon={<Package className="h-5 w-5 text-primary" />} label={t("products.sku")} value={product.sku || "-"} />
                <Row icon={<Scale className="h-5 w-5 text-primary" />} label={t("products.weight")} value={product.attributes?.weight != null ? `${product.attributes.weight} g` : "-"} />
                <Row icon={<Ruler className="h-5 w-5 text-primary" />} label={t("products.dimensions")} value={dimsText} />
                <Row icon={<Shield className="h-5 w-5 text-primary" />} label={t("products.allow_backorder")} value={product.allow_backorder ? t("common.yes") : t("common.no")} />
                <Row icon={<Info className="h-5 w-5 text-primary" />} label={t("common.status")} value={product.is_active ? t("common.active") : t("common.inactive")} />
                <Row icon={<Truck className="h-5 w-5 text-primary" />} label={t("products.shipping")} value={t("products.shipping_information")} />
                <Row icon={<RotateCcw className="h-5 w-5 text-primary" />} label={t("products.return_policy")} value={t("products.default_return_policy")} />
            </div>
            <Separator />
            <div className="space-y-2 text-xs text-muted-foreground">
                <Row small icon={<Calendar className="h-4 w-4" />} label={t("products.created_at")} value={product.created_at} />
                <Row small icon={<Calendar className="h-4 w-4" />} label={t("products.updated_at")} value={product.updated_at} />
                <Row small icon={<Barcode className="h-4 w-4" />} label={t("products.barcode")} value={product.barcode || "-"} />
            </div>
        </div>
    );
}

function Fact({ icon, label, value, isPrice }:{icon:React.ReactNode;label:string;value:string;isPrice?:boolean}) {
    return (
        <div className="flex items-center gap-3">
            {isPrice ? <Badge variant="secondary" className="text-base font-bold">{value}</Badge> : icon}
            <div><p className="text-sm font-medium">{label}</p><p>{value}</p></div>
        </div>
    );
}
function Row({ icon, label, value, small }:{icon:React.ReactNode;label:string;value:string;small?:boolean}) {
    return (
        <div className="flex items-center gap-3">
            {icon}
            <p className={small ? "text-xs" : "text-base"}><span className="font-medium">{label}: </span>{value}</p>
        </div>
    );
}
