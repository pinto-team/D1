import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { useI18n } from "@/shared/hooks/useI18n";

export function ProductsPagination({ page, totalPages, onFirst, onPrev, onNext, onLast, hasPrev, hasNext, pageSize, onPageSize }:{
    page:number; totalPages:number; onFirst:()=>void; onPrev:()=>void; onNext:()=>void; onLast:()=>void;
    hasPrev:boolean; hasNext:boolean; pageSize:number; onPageSize:(n:number)=>void;
}) {
    const { t } = useI18n();
    return (
        <div className="flex items-center justify-between px-4 py-4 lg:px-6 lg:pb-6">
            <div className="hidden flex-1 text-sm text-muted-foreground lg:flex"></div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
                <div className="hidden items-center gap-2 lg:flex">
                    <Label className="text-sm font-medium">{t("common.rows_per_page")}</Label>
                    <Select value={`${pageSize}`} onValueChange={(v)=>onPageSize(Number(v))}>
                        <SelectTrigger size="sm" className="w-20"><SelectValue placeholder={pageSize} /></SelectTrigger>
                        <SelectContent side="top">{[8,12,16,24,32,48].map(n => <SelectItem key={n} value={`${n}`}>{n}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="text-sm font-medium">{t("common.page_of", { page: page + 1, pages: totalPages })}</div>
                <div className="ml-auto flex items-center gap-2 lg:ml-0">
                    <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={onFirst} disabled={!hasPrev}><ChevronsLeft className="h-4 w-4" /></Button>
                    <Button variant="outline" className="size-8" size="icon" onClick={onPrev} disabled={!hasPrev}><ChevronLeft className="h-4 w-4" /></Button>
                    <Button variant="outline" className="size-8" size="icon" onClick={onNext} disabled={!hasNext}><ChevronRight className="h-4 w-4" /></Button>
                    <Button variant="outline" className="hidden size-8 lg:flex" size="icon" onClick={onLast} disabled={!hasNext}><ChevronsRight className="h-4 w-4" /></Button>
                </div>
            </div>
        </div>
    );
}
