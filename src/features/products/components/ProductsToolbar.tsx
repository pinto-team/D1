import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RefreshCw, LayoutGrid, List, Search, Plus } from "lucide-react";
import { useI18n } from "@/shared/hooks/useI18n";

type Props = {
    query: string; onQuery: (v: string) => void;
    pageSize: number; onPageSize: (n: number) => void;
    sort: "relevance" | "price_asc" | "price_desc"; onSort: (s: any) => void;
    view: "grid" | "list"; onView: (v: "grid" | "list") => void;
    onRefresh: () => void; isRefreshing?: boolean;
    title: string; subtitle: string;
};

export function ProductsToolbar(p: Props) {
    const { t } = useI18n();
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3 px-4 lg:px-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">{p.title}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{p.subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="default" size="sm" onClick={() => alert("Add Product")}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t("products.add")}
                    </Button>
                    <Button variant="outline" size="icon" onClick={p.onRefresh} disabled={p.isRefreshing}>
                        <RefreshCw className={`h-4 w-4 ${p.isRefreshing ? "animate-spin" : ""}`} />
                        <span className="sr-only">{t("products.refresh")}</span>
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-3 px-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
                <div className="flex w-full items-center gap-2 md:max-w-md">
                    <div className="relative w-full">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder={t("common.search")} value={p.query} onChange={(e) => p.onQuery(e.target.value)} className="pl-9" />
                    </div>
                </div>

                <div className="flex flex-1 items-center justify-between gap-3">
                    <div className="hidden items-center gap-2 md:flex">
                        <Label htmlFor="rows-per-page" className="text-sm font-medium">{t("common.rows_per_page")}</Label>
                        <Select value={`${p.pageSize}`} onValueChange={(v) => p.onPageSize(Number(v))}>
                            <SelectTrigger id="rows-per-page" className="w-24"><SelectValue placeholder={p.pageSize} /></SelectTrigger>
                            <SelectContent align="end">{[8,12,16,24,32,48].map(n => <SelectItem key={n} value={`${n}`}>{n}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                        <Label htmlFor="sort" className="text-sm font-medium">{t("common.sort_by")}</Label>
                        <Select value={p.sort} onValueChange={p.onSort}>
                            <SelectTrigger id="sort" className="w-44"><SelectValue /></SelectTrigger>
                            <SelectContent align="end">
                                <SelectItem value="relevance">{t("common.relevance")}</SelectItem>
                                <SelectItem value="price_asc">{t("common.price_low_high")}</SelectItem>
                                <SelectItem value="price_desc">{t("common.price_high_low")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <ToggleGroup type="single" value={p.view} onValueChange={(v) => v && p.onView(v as any)} className="ml-auto">
                        <ToggleGroupItem value="grid" aria-label={t("products.grid_view")} className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                            <LayoutGrid className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="list" aria-label={t("products.list_view")} className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                            <List className="h-4 w-4" />
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </div>
        </div>
    );
}
