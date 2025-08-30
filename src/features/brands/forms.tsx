// src/features/brands/forms.tsx
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useI18n } from "@/shared/hooks/useI18n";
import { uploadSingleImage } from "@/api/uploads";
import type { BrandCreate } from "@/api/resources/brands";

const brandSchema = z.object({
    name: z.string().min(2, { message: "validation.min_length" }).max(120, { message: "validation.max_length" }),
    country: z.string().max(60, { message: "validation.max_length" }).optional().or(z.literal("")),
    website: z.string().url({ message: "validation.url" }).optional().or(z.literal("")),
    description: z.string().max(500, { message: "validation.max_length" }).optional().or(z.literal("")),
    logo_url: z.string().url({ message: "validation.url" }).optional().or(z.literal("")),
});

export type BrandFormValues = z.infer<typeof brandSchema>;

type BrandFormProps = Readonly<{
    defaultValues?: Partial<BrandCreate>;
    onSubmit: (values: BrandCreate) => void;
    submitting?: boolean;
    formId?: string;
}>;

export function BrandFormRHF({ defaultValues, onSubmit, submitting, formId = "brand-form" }: BrandFormProps) {
    const { t } = useI18n();
    const form = useForm<BrandFormValues>({
        resolver: zodResolver(brandSchema),
        defaultValues: {
            name: "",
            country: "",
            website: "",
            description: "",
            logo_url: "",
            ...defaultValues,
        },
        mode: "onBlur",
    });

    const [uploading, setUploading] = React.useState(false);

    async function handlePickFile(file: File) {
        setUploading(true);
        try {
            const url = await uploadSingleImage(file);
            form.setValue("logo_url", url, { shouldDirty: true });
        } finally {
            setUploading(false);
        }
    }

    return (
        <form id={formId} noValidate onSubmit={form.handleSubmit(values => onSubmit(values))} className="grid gap-6">
            <Card className="overflow-hidden shadow-sm">
                <CardHeader className="bg-muted/50">
                    <CardTitle className="text-lg font-semibold">{t("brands.form.title")}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 p-6 md:grid-cols-2">
                    <div className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="brand-name">{t("brands.form.name")}*</Label>
                            <Input id="brand-name" placeholder={t("brands.form.name_ph")} aria-invalid={!!form.formState.errors.name}
                                   {...form.register("name", { required: t("validation.required") as string })} />
                            {form.formState.errors.name && <p className="mt-1 text-xs text-destructive">{t(form.formState.errors.name.message as string)}</p>}
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="brand-country">{t("brands.form.country")}</Label>
                                <Input id="brand-country" placeholder={t("brands.form.country_ph")} aria-invalid={!!form.formState.errors.country} {...form.register("country")} />
                                {form.formState.errors.country && <p className="mt-1 text-xs text-destructive">{t(form.formState.errors.country.message as string)}</p>}
                            </div>
                            <div>
                                <Label htmlFor="brand-website">{t("brands.form.website")}</Label>
                                <Input id="brand-website" placeholder={t("brands.form.website_ph")} aria-invalid={!!form.formState.errors.website} {...form.register("website")} />
                                {form.formState.errors.website && <p className="mt-1 text-xs text-destructive">{t(form.formState.errors.website.message as string)}</p>}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="brand-description">{t("brands.form.description")}</Label>
                            <textarea id="brand-description" placeholder={t("brands.form.description_ph")} className="min-h-24 w-full resize-vertical rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground"
                                      aria-invalid={!!form.formState.errors.description} {...form.register("description")} />
                            {form.formState.errors.description && <p className="mt-1 text-xs text-destructive">{t(form.formState.errors.description.message as string)}</p>}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>{t("brands.form.logo")}</Label>
                        <div className="aspect-square rounded-lg border grid place-items-center p-2">
                            {form.watch("logo_url") ? (
                                <img src={form.watch("logo_url") || ""} alt={t("brands.logo_alt") as string} className="h-56 w-full object-contain" />
                            ) : (
                                <div className="text-xs text-muted-foreground">{t("uploader.hint.drag_or_click")}</div>
                            )}
                        </div>
                        <input type="file" accept="image/*" onChange={(e) => e.currentTarget.files && handlePickFile(e.currentTarget.files[0])} disabled={uploading} />
                        <p className="text-xs text-muted-foreground">{t("brands.form.logo_help")}</p>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}

