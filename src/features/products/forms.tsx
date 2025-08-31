// src/features/products/forms.tsx
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/shared/hooks/useI18n";
import type { ProductCreate } from "@/api/resources/products";

const productSchema = z.object({
    name: z.string().min(1, { message: "validation.required" }),
    sku: z.string().min(1, { message: "validation.required" }),
    description: z.string().optional().or(z.literal("")),
    seller_id: z.string().min(1, { message: "validation.required" }),
    warehouse_id: z.string().min(1, { message: "validation.required" }),
    category_id: z.string().min(1, { message: "validation.required" }),
    brand: z.string().optional().or(z.literal("")),
    base_price: z.coerce.number(),
    purchase_price: z.coerce.number().optional(),
    currency: z.string().min(1, { message: "validation.required" }),
    tax_rate: z.coerce.number().optional(),
    min_order_quantity: z.coerce.number().min(1, { message: "validation.min" }),
    min_order_multiple: z.coerce.number().optional(),
    stock: z.coerce.number().min(0),
    allow_backorder: z.boolean().optional(),
    is_active: z.boolean().optional(),
    uom: z.string().optional(),
    pack_size: z.coerce.number().nullable().optional(),
    case_size: z.coerce.number().nullable().optional(),
    attributes: z
        .object({
            weight: z.coerce.number().optional(),
            dimensions: z
                .object({ length: z.coerce.number(), width: z.coerce.number(), height: z.coerce.number() })
                .partial()
                .optional(),
        })
        .partial()
        .optional(),
    barcode: z.string().optional(),
    images: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

type ProductFormProps = Readonly<{
    defaultValues?: Partial<ProductCreate>;
    onSubmit: (values: ProductCreate) => void;
    submitting?: boolean;
    formId?: string;
}>;

export function ProductFormRHF({ defaultValues, onSubmit, submitting, formId = "product-form" }: ProductFormProps) {
    const { t } = useI18n();
    const { register, control, handleSubmit, formState: { errors } } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            currency: "USD",
            min_order_quantity: 1,
            tax_rate: 0,
            allow_backorder: false,
            is_active: true,
            images: [],
            tags: [],
            ...defaultValues,
        },
    });

    return (
        <form id={formId} onSubmit={handleSubmit(values => onSubmit(values as unknown as ProductCreate))} className="flex flex-1 flex-col @container/main gap-6">
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader className="bg-muted/50">
                        <CardTitle className="text-lg font-semibold">{t("products.details")}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="name">{t("products.name", { defaultValue: "Name" } as any)}</Label>
                            <Input id="name" placeholder="iPhone 15 Pro" {...register("name")} />
                            {errors.name && <p className="mt-1 text-xs text-destructive">{t(errors.name.message as string)}</p>}
                        </div>
                        <div>
                            <Label htmlFor="sku">{t("products.sku")}</Label>
                            <Input id="sku" placeholder="AB-12345" {...register("sku")} />
                            {errors.sku && <p className="mt-1 text-xs text-destructive">{t(errors.sku.message as string)}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <Label htmlFor="description">{t("products.details")}</Label>
                            <Input id="description" placeholder={t("products.details")} {...register("description")} />
                        </div>
                        <div>
                            <Label htmlFor="seller_id">Seller ID</Label>
                            <Input id="seller_id" placeholder="UUID" {...register("seller_id")} />
                        </div>
                        <div>
                            <Label htmlFor="warehouse_id">Warehouse ID</Label>
                            <Input id="warehouse_id" placeholder="UUID" {...register("warehouse_id")} />
                        </div>
                        <div>
                            <Label htmlFor="category_id">{t("products.category")}</Label>
                            <Input id="category_id" placeholder="UUID" {...register("category_id")} />
                        </div>
                        <div>
                            <Label htmlFor="brand">{t("products.brand")}</Label>
                            <Input id="brand" placeholder="Apple" {...register("brand")} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="bg-muted/50">
                        <CardTitle className="text-lg font-semibold">{t("products.price")}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="base_price">{t("products.price")}</Label>
                                <Input id="base_price" type="number" step="0.01" {...register("base_price", { valueAsNumber: true })} />
                            </div>
                            <div>
                                <Label htmlFor="purchase_price">{t("products.purchase_price", { defaultValue: "Purchase price" } as any)}</Label>
                                <Input id="purchase_price" type="number" step="0.01" {...register("purchase_price", { valueAsNumber: true })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="currency">{t("products.currency", { defaultValue: "Currency" } as any)}</Label>
                                <Input id="currency" placeholder="USD" {...register("currency")} />
                            </div>
                            <div>
                                <Label htmlFor="tax_rate">{t("products.tax_rate")}</Label>
                                <Input id="tax_rate" type="number" step="0.01" {...register("tax_rate", { valueAsNumber: true })} />
                            </div>
                            <div>
                                <Label htmlFor="min_order_quantity">{t("products.min_order")}</Label>
                                <Input id="min_order_quantity" type="number" {...register("min_order_quantity", { valueAsNumber: true })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="min_order_multiple">{t("products.min_order_multiple", { defaultValue: "Min multiple" } as any)}</Label>
                                <Input id="min_order_multiple" type="number" {...register("min_order_multiple", { valueAsNumber: true })} />
                            </div>
                            <div>
                                <Label htmlFor="stock">{t("products.stock")}</Label>
                                <Input id="stock" type="number" {...register("stock", { valueAsNumber: true })} />
                            </div>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="is_active">{t("common.status")}</Label>
                            </div>
                            <Controller name="is_active" control={control} render={({ field }) => (
                                <Switch id="is_active" checked={!!field.value} onCheckedChange={field.onChange} />
                            )} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="allow_backorder">{t("products.allow_backorder")}</Label>
                            </div>
                            <Controller name="allow_backorder" control={control} render={({ field }) => (
                                <Switch id="allow_backorder" checked={!!field.value} onCheckedChange={field.onChange} />
                            )} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="bg-muted/50">
                    <CardTitle className="text-lg font-semibold">{t("products.shipping")}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid gap-4 md:grid-cols-3">
                    <div>
                        <Label htmlFor="uom">{t("products.uom", { defaultValue: "Unit" } as any)}</Label>
                        <Input id="uom" placeholder="unit / pack / case" {...register("uom")} />
                    </div>
                    <div>
                        <Label htmlFor="pack_size">{t("products.pack_size", { defaultValue: "Pack size" } as any)}</Label>
                        <Input id="pack_size" type="number" {...register("pack_size", { valueAsNumber: true })} />
                    </div>
                    <div>
                        <Label htmlFor="case_size">{t("products.case_size", { defaultValue: "Case size" } as any)}</Label>
                        <Input id="case_size" type="number" {...register("case_size", { valueAsNumber: true })} />
                    </div>
                    <div className="md:col-span-3 grid grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="attributes.dimensions.length">{t("products.dimensions")}: L</Label>
                            <Input id="attributes.dimensions.length" type="number" step="0.01" {...register("attributes.dimensions.length" as any, { valueAsNumber: true })} />
                        </div>
                        <div>
                            <Label htmlFor="attributes.dimensions.width">{t("products.dimensions")}: W</Label>
                            <Input id="attributes.dimensions.width" type="number" step="0.01" {...register("attributes.dimensions.width" as any, { valueAsNumber: true })} />
                        </div>
                        <div>
                            <Label htmlFor="attributes.dimensions.height">{t("products.dimensions")}: H</Label>
                            <Input id="attributes.dimensions.height" type="number" step="0.01" {...register("attributes.dimensions.height" as any, { valueAsNumber: true })} />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="attributes.weight">{t("products.weight")}</Label>
                        <Input id="attributes.weight" type="number" step="0.001" {...register("attributes.weight" as any, { valueAsNumber: true })} />
                    </div>
                    <div>
                        <Label htmlFor="barcode">{t("products.barcode")}</Label>
                        <Input id="barcode" placeholder="EAN/UPC" {...register("barcode")} />
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}

