import React from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/shared/hooks/useI18n";
import { useForm, Controller } from "react-hook-form";
import { useCreateProduct } from "../hooks/products.queries";
import { type AddProductRequest } from "../services/products.api";
import { toast } from "sonner";
import { ROUTES } from "@/app/routes/routes";

export default function AddProductPage() {
    const { t } = useI18n();
    const navigate = useNavigate();
    const { register, control, handleSubmit, formState: { errors }, reset } = useForm<AddProductRequest>({
        defaultValues: {
            currency: "USD",
            min_order_quantity: 1,
            tax_rate: 0,
            allow_backorder: false,
            is_active: true,
            images: [],
            tags: [],
        },
    });

    const createMutation = useCreateProduct();

    function onSubmit(values: AddProductRequest) {
        createMutation.mutate(values, {
            onSuccess: (created) => {
                toast.success(t("products.add") + " موفق بود")
                reset()
                navigate(ROUTES.PRODUCT_DETAILS.replace(":id", created.id))
            },
            onError: () => {
                toast.error(t("products.error_message"))
            },
        })
    }

    return (
        <SidebarProvider style={{"--sidebar-width":"calc(var(--spacing)*72)","--header-height":"calc(var(--spacing)*12)"} as React.CSSProperties}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col @container/main gap-6 p-6 md:p-8 lg:p-10">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight">{t("products.add")}</h1>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => navigate(-1)}>{t("common.back")}</Button>
                            <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? t("loading") : t("products.add")}</Button>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <Card className="lg:col-span-2">
                            <CardHeader className="bg-muted/50">
                                <CardTitle className="text-lg font-semibold">اطلاعات اصلی</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="name">نام</Label>
                                    <Input id="name" placeholder="مثلاً iPhone 15 Pro" {...register("name", { required: true })} />
                                </div>
                                <div>
                                    <Label htmlFor="sku">SKU</Label>
                                    <Input id="sku" placeholder="AB-12345" {...register("sku", { required: true })} />
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="description">توضیحات</Label>
                                    <Input id="description" placeholder="توضیحات محصول" {...register("description")} />
                                </div>
                                <div>
                                    <Label htmlFor="seller_id">Seller ID</Label>
                                    <Input id="seller_id" placeholder="UUID" {...register("seller_id", { required: true })} />
                                </div>
                                <div>
                                    <Label htmlFor="warehouse_id">Warehouse ID</Label>
                                    <Input id="warehouse_id" placeholder="UUID" {...register("warehouse_id", { required: true })} />
                                </div>
                                <div>
                                    <Label htmlFor="category_id">Category ID</Label>
                                    <Input id="category_id" placeholder="UUID" {...register("category_id", { required: true })} />
                                </div>
                                <div>
                                    <Label htmlFor="brand">برند</Label>
                                    <Input id="brand" placeholder="Apple" {...register("brand")} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="bg-muted/50">
                                <CardTitle className="text-lg font-semibold">قیمت و سفارش</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="base_price">قیمت پایه</Label>
                                        <Input id="base_price" type="number" step="0.01" {...register("base_price", { required: true, valueAsNumber: true })} />
                                    </div>
                                    <div>
                                        <Label htmlFor="purchase_price">قیمت خرید</Label>
                                        <Input id="purchase_price" type="number" step="0.01" {...register("purchase_price", { valueAsNumber: true })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="currency">ارز</Label>
                                        <Input id="currency" placeholder="USD" {...register("currency", { required: true })} />
                                    </div>
                                    <div>
                                        <Label htmlFor="tax_rate">مالیات (%)</Label>
                                        <Input id="tax_rate" type="number" step="0.01" {...register("tax_rate", { valueAsNumber: true })} />
                                    </div>
                                    <div>
                                        <Label htmlFor="min_order_quantity">حداقل سفارش</Label>
                                        <Input id="min_order_quantity" type="number" {...register("min_order_quantity", { required: true, valueAsNumber: true })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="min_order_multiple">مضرب سفارش</Label>
                                        <Input id="min_order_multiple" type="number" {...register("min_order_multiple", { valueAsNumber: true })} />
                                    </div>
                                    <div>
                                        <Label htmlFor="stock">موجودی</Label>
                                        <Input id="stock" type="number" {...register("stock", { required: true, valueAsNumber: true })} />
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label htmlFor="is_active">وضعیت</Label>
                                        <div className="text-xs text-muted-foreground">{t("common.active")}/{t("common.inactive")}</div>
                                    </div>
                                    <Controller
                                        name="is_active"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch id="is_active" checked={!!field.value} onCheckedChange={field.onChange} />
                                        )}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label htmlFor="allow_backorder">اجازه پیش‌سفارش</Label>
                                        <div className="text-xs text-muted-foreground">{t("products.allow_backorder")}</div>
                                    </div>
                                    <Controller
                                        name="allow_backorder"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch id="allow_backorder" checked={!!field.value} onCheckedChange={field.onChange} />
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader className="bg-muted/50">
                            <CardTitle className="text-lg font-semibold">لجستیک و بسته‌بندی</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid gap-4 md:grid-cols-3">
                            <div>
                                <Label htmlFor="uom">واحد</Label>
                                <Input id="uom" placeholder="unit / pack / case" {...register("uom")} />
                            </div>
                            <div>
                                <Label htmlFor="pack_size">تعداد در هر بسته</Label>
                                <Input id="pack_size" type="number" {...register("pack_size", { valueAsNumber: true })} />
                            </div>
                            <div>
                                <Label htmlFor="case_size">تعداد بسته در هر کارتن</Label>
                                <Input id="case_size" type="number" {...register("case_size", { valueAsNumber: true })} />
                            </div>
                            <div className="md:col-span-3 grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="attributes.dimensions.length">طول</Label>
                                    <Input id="attributes.dimensions.length" type="number" step="0.01" {...register("attributes.dimensions.length" as any, { valueAsNumber: true })} />
                                </div>
                                <div>
                                    <Label htmlFor="attributes.dimensions.width">عرض</Label>
                                    <Input id="attributes.dimensions.width" type="number" step="0.01" {...register("attributes.dimensions.width" as any, { valueAsNumber: true })} />
                                </div>
                                <div>
                                    <Label htmlFor="attributes.dimensions.height">ارتفاع</Label>
                                    <Input id="attributes.dimensions.height" type="number" step="0.01" {...register("attributes.dimensions.height" as any, { valueAsNumber: true })} />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="attributes.weight">وزن (کیلوگرم)</Label>
                                <Input id="attributes.weight" type="number" step="0.001" {...register("attributes.weight" as any, { valueAsNumber: true })} />
                            </div>
                            <div>
                                <Label htmlFor="barcode">بارکد</Label>
                                <Input id="barcode" placeholder="EAN/UPC" {...register("barcode")} />
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </SidebarInset>
        </SidebarProvider>
    );
}

