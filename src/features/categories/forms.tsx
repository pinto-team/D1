import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/shared/hooks/useI18n";
import type { CategoryCreate } from "@/api/resources/categories";

const schema = z.object({ name: z.string().min(2, { message: "validation.min_length" }).max(120, { message: "validation.max_length" }) });
type Values = z.infer<typeof schema>;

export function CategoryFormRHF({ defaultValues, onSubmit, formId = "category-form" }: { defaultValues?: Partial<CategoryCreate>; onSubmit: (values: CategoryCreate) => void; formId?: string; }) {
    const { t } = useI18n();
    const { register, handleSubmit, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema) as any, defaultValues: { name: "", ...defaultValues } });
    return (
        <form id={formId} onSubmit={handleSubmit(v => onSubmit(v as unknown as CategoryCreate))} className="grid gap-6">
            <Card className="overflow-hidden shadow-sm">
                <CardHeader className="bg-muted/50"><CardTitle className="text-lg font-semibold">{t("categories.form.title", { defaultValue: "Category" } as any)}</CardTitle></CardHeader>
                <CardContent className="p-6">
                    <Label htmlFor="category-name">{t("categories.form.name", { defaultValue: "Name" } as any)}</Label>
                    <Input id="category-name" placeholder={t("categories.form.name_ph", { defaultValue: "e.g. Snacks" } as any)} aria-invalid={!!errors.name} {...register("name")} />
                    {errors.name && <p className="mt-1 text-xs text-destructive">{t(errors.name.message as string)}</p>}
                </CardContent>
            </Card>
        </form>
    );
}

