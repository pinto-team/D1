import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useI18n } from "@/shared/hooks/useI18n";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EmptyState() {
    const { t } = useI18n();
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border py-16 text-center">
            <div className="mb-3"><Search className="h-8 w-8" /></div>
            <h3 className="text-lg font-medium">{t("products.no_products_found")}</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{t("products.try_adjust_search")}</p>
        </div>
    );
}

export function ErrorState({ onRetry }:{ onRetry:()=>void }) {
    const { t } = useI18n();
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border py-16 text-center">
            <h3 className="text-lg font-semibold">{t("products.error_title")}</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{t("products.error_message")}</p>
            <Button onClick={onRetry} className="mt-4">{t("products.try_again")}</Button>
        </div>
    );
}

export function ProductsSkeleton({ view }:{ view:"grid"|"list" }) {
    return view === "list" ? (
        <div className="divide-y rounded-xl border">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="grid grid-cols-[80px_1fr_auto] items-center gap-4 p-3 sm:grid-cols-[100px_1fr_auto]">
                    <Skeleton className="aspect-square w-20 rounded-lg sm:w-24" />
                    <div><Skeleton className="h-4 w-2/3" /><Skeleton className="mt-2 h-3 w-1/3" /></div>
                    <Skeleton className="h-5 w-16 justify-self-end" />
                </div>
            ))}
        </div>
    ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="!gap-0 !p-0">
                    <div className="p-2"><Skeleton className="w-full aspect-square rounded-xl" /></div>
                    <div className="space-y-2 px-3 py-3">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <div className="flex justify-end pt-1"><Skeleton className="h-5 w-16" /></div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
