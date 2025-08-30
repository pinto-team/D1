import * as React from "react";
import { AppSidebar } from "@/features/sidebar/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/shared/hooks/useI18n";
import useDebounced from "@/shared/hooks/useDebounced";
import { ROUTES } from "@/app/routes/routes";
import { useList as useCategoryList, useRemove as useDeleteCategory } from "@/features/categories/hooks";
import CategoriesTable from "@/features/categories/components/CategoriesTable";

export default function CategoriesPage() {
    const { t } = useI18n();
    const navigate = useNavigate();
    const [page, setPage] = React.useState(1);
    const [limit] = React.useState(20);
    const [q, setQ] = React.useState("");
    const dq = useDebounced(q, 400);

    const { data, isLoading, error, refetch } = useCategoryList({ page, limit, q: dq });
    const items = data?.items ?? [];
    const del = useDeleteCategory();

    const layoutStyle = React.useMemo(() => ({ "--sidebar-width": "calc(var(--spacing)*72)", "--header-height": "calc(var(--spacing)*12)" }) as React.CSSProperties, []);

    return (
        <SidebarProvider style={layoutStyle}>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="flex items-center justify-between px-4 lg:px-6">
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold">{t("menu.basic.categories")}</h1>
                            <p className="text-sm text-muted-foreground">{t("common.showing_count", { count: items.length })}</p>
                        </div>
                        <div className="flex gap-2">
                            <Input placeholder={t("common.search") as string} value={q} onChange={e => setQ(e.target.value)} />
                            <Button onClick={() => navigate(ROUTES.CATEGORIES + "/new")}>{t("categories.add", { defaultValue: "Add Category" } as any)}</Button>
                        </div>
                    </div>
                    <Separator className="mx-4 lg:mx-6" />
                    <div className="px-4 lg:px-6">
                        {error && <div className="text-red-500 text-sm">{t("common.error")}</div>}
                        {isLoading && !items.length ? <div className="text-sm text-muted-foreground">{t("common.loading")}</div> : <CategoriesTable items={items} onDelete={(id) => del.mutate(id, { onSuccess: () => refetch() })} />}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

