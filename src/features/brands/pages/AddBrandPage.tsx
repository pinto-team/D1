import * as React from "react"
import { useNavigate } from "react-router-dom"
import { AppSidebar } from "@/features/sidebar/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useI18n } from "@/shared/hooks/useI18n"
import { isRTLLocale } from "@/shared/i18n/utils"
import { ROUTES } from "@/app/routes/routes"
import BrandForm from "@/features/brands/components/BrandForm"
import ResultDialog from "@/features/brands/components/ResultDialog"
import { useCreateBrand } from "@/features/brands/hooks/brands.queries"
import type { CreateBrandRequest } from "@/features/brands/services/brands.api"
import {JSX} from "react";

const FORM_ID = "brand-form"

export default function AddBrandPage(): JSX.Element {
    const navigate = useNavigate()
    const { t, locale } = useI18n()
    const rtl = isRTLLocale(locale)
    const create = useCreateBrand()

    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [dialogState, setDialogState] = React.useState<{
        variant: "success" | "error"
        title: string
        message: string
        createdId?: string
    }>({ variant: "success", title: "", message: "" })

    function handleSubmit(values: CreateBrandRequest) {
        create.mutate(values, {
            onSuccess: (created) => {
                setDialogState({
                    variant: "success",
                    title: t("brands.dialog.created_title") ?? "Brand created",
                    message: t("brands.dialog.created_body") ?? "The brand was created successfully.",
                    createdId: created.id,
                })
                setDialogOpen(true)
            },
            onError: () => {
                setDialogState({
                    variant: "error",
                    title: t("brands.dialog.error_title") ?? "Failed to create",
                    message: t("brands.dialog.error_body") ?? "Something went wrong. Please try again.",
                })
                setDialogOpen(true)
            },
        })
    }

    return (
        <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing)*72)", "--header-height": "calc(var(--spacing)*12)" } as React.CSSProperties}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col gap-4 p-6 md:gap-6 md:p-8 lg:p-10">
                    {/* Top bar: Back + Title | Save */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                className="shadow-none"
                                onClick={() => navigate(-1)}
                                aria-label={t("common.back") ?? "Back"}
                                title={t("common.back") ?? "Back"}
                            >
                                {rtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                            </Button>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {t("brands.add") ?? "Add Brand"}
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="submit"
                                form={FORM_ID}
                                disabled={create.isPending}
                            >
                                {create.isPending ? (t("common.saving") ?? "Saving...") : (t("common.save") ?? "Save")}
                            </Button>
                        </div>
                    </div>

                    {/* Form card */}
                    <BrandForm
                        formId={FORM_ID}
                        onSubmit={handleSubmit}
                        submitting={create.isPending}
                    />
                </div>
            </SidebarInset>

            {/* Result dialog */}
            <ResultDialog
                open={dialogOpen}
                variant={dialogState.variant}
                title={dialogState.title}
                description={dialogState.message}
                onOpenChange={setDialogOpen}
                actions={
                    dialogState.variant === "success"
                        ? [
                            {
                                label: t("brands.dialog.view_brand") ?? "View brand",
                                onClick: () => {
                                    setDialogOpen(false)
                                    if (dialogState.createdId) {
                                        navigate(ROUTES.BRAND_EDIT(dialogState.createdId))
                                    }
                                },
                            },
                            {
                                label: t("brands.dialog.add_another") ?? "Add another",
                                onClick: () => {
                                    setDialogOpen(false)
                                    navigate(ROUTES.BRAND_NEW)
                                },
                            },
                        ]
                        : [
                            {
                                label: t("common.close") ?? "Close",
                                onClick: () => setDialogOpen(false),
                            },
                        ]
                }
            />
        </SidebarProvider>
    )
}
