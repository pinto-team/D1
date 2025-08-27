import * as React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AppSidebar } from "@/features/sidebar/app-sidebar.tsx"
import { SiteHeader } from "@/components/layout/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { toast } from "sonner"
import BrandForm from "../components/BrandForm"
import { useBrand, useUpdateBrand, useDeleteBrand } from "../hooks/brands.queries"
import { Button } from "@/components/ui/button"
import type {Brand, CreateBrandRequest} from "../services/brands.api"

function brandToFormDefaults(b?: Brand): Partial<CreateBrandRequest> {
    if (!b) return {}
    return {
        name: b.name ?? "",
        description: b.description ?? "",
        country: b.country ?? "",
        website: b.website ?? "",
        logo_url: b.logo_url ?? "",
    }
}

export default function EditBrandPage() {
    const { id = "" } = useParams()
    const navigate = useNavigate()
    const { data, isLoading } = useBrand(id)
    const update = useUpdateBrand(id)
    const del = useDeleteBrand()

    return (
        <SidebarProvider style={{"--sidebar-width":"calc(var(--spacing)*72)","--header-height":"calc(var(--spacing)*12)"} as React.CSSProperties}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex-1 p-6 md:p-8 lg:p-10">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">ویرایش برند</h1>
                        <Button
                            variant="destructive"
                            onClick={() =>
                                del.mutate(id, {
                                    onSuccess: () => { toast.success("برند حذف شد"); navigate("/brands") },
                                    onError: () => toast.error("حذف ناموفق بود")
                                })
                            }
                        >
                            حذف
                        </Button>
                    </div>

                    {isLoading || !data ? (
                        <div className="text-sm text-muted-foreground">در حال بارگذاری...</div>
                    ) : (
                        <BrandForm
                            defaultValues={brandToFormDefaults(data)} // ✅ حالا بدون any
                            onSubmit={(values) => {
                                update.mutate(values, {
                                    onSuccess: () => toast.success("تغییرات ذخیره شد"),
                                    onError: () => toast.error("ذخیره ناموفق بود"),
                                })
                            }}
                            submitting={update.isPending}
                            submitLabel="ذخیره تغییرات"
                        />
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
