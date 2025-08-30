import * as React from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/shared/hooks/useI18n";
import type { Category } from "@/api/resources/categories";
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

type Props = Readonly<{ items: ReadonlyArray<Category>; onEdit?: (id: string) => void; onDelete?: (id: string) => void }>;

export default function CategoriesTable({ items, onEdit, onDelete }: Props) {
    const { t } = useI18n();

    const handleDelete = React.useCallback((id: string) => {
        if (!onDelete) return;
        const ok = window.confirm(t("categories.confirm_delete") as string);
        if (!ok) return;
        onDelete(id);
    }, [onDelete, t]);

    const columns = React.useMemo<ColumnDef<Category>[]>(() => [
        { accessorKey: "name", header: () => t("categories.table.name") as string, size: 300 },
        {
            id: "actions",
            header: () => t("categories.table.actions") as string,
            cell: ({ row }) => {
                const c = row.original;
                return (
                    <div className="text-right space-x-2 rtl:space-x-reverse">
                        {onEdit && <Button size="sm" variant="outline" onClick={() => onEdit(c.id)}>{t("actions.edit")}</Button>}
                        {onDelete && <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)}>{t("actions.delete")}</Button>}
                    </div>
                );
            },
            size: 160,
        },
    ], [handleDelete, onDelete, onEdit, t]);

    const table = useReactTable({ data: items as Category[], columns, getCoreRowModel: getCoreRowModel(), columnResizeMode: "onChange" });
    const parentRef = React.useRef<HTMLDivElement>(null);
    const rowVirtualizer = useVirtualizer({ count: table.getRowModel().rows.length, getScrollElement: () => parentRef.current, estimateSize: () => 48, overscan: 8 });
    const rows = table.getRowModel().rows;
    const virtualRows = rowVirtualizer.getVirtualItems();
    const totalSize = rowVirtualizer.getTotalSize();

    return (
        <div className="overflow-hidden rounded-xl border">
            <div className="bg-muted/50 border-b">
                <div className="grid" style={{ gridTemplateColumns: table.getVisibleLeafColumns().map(c => `${c.getSize()}px`).join(" ") }}>
                    {table.getHeaderGroups().map(hg => (
                        <div key={hg.id} className="contents">
                            {hg.headers.map(h => (
                                <div key={h.id} className="px-3 py-2 text-sm font-medium">
                                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div ref={parentRef} className="relative" style={{ height: Math.min(480, Math.max(240, rows.length * 48)), overflow: "auto" }}>
                <div style={{ height: totalSize, position: "relative" }}>
                    {virtualRows.length === 0 && (
                        <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
                            {t("common.no_results")}
                        </div>
                    )}
                    {virtualRows.map(virtualRow => {
                        const row = rows[virtualRow.index];
                        return (
                            <div key={row.id} className="grid items-center border-b" style={{ position: "absolute", top: 0, left: 0, transform: `translateY(${virtualRow.start}px)`, height: virtualRow.size, gridTemplateColumns: table.getVisibleLeafColumns().map(c => `${c.getSize()}px`).join(" ") }}>
                                {row.getVisibleCells().map(cell => (
                                    <div key={cell.id} className="px-3 py-2 text-sm">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

