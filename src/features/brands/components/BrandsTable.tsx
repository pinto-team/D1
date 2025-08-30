import * as React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/shared/hooks/useI18n"
import { ROUTES } from "@/app/routes/routes"
import type { Brand } from "@/api/resources/brands"
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import {JSX} from "react";

type Props = Readonly<{
    items: ReadonlyArray<Brand>
    onDelete?: (id: string) => void
}>

export default function BrandsTable({ items, onDelete }: Props): JSX.Element {
    const { t } = useI18n()

    const handleDelete = React.useCallback(
        (id: string) => {
            if (!onDelete) return
            const ok = window.confirm(t("brands.confirm_delete") as string)
            if (!ok) return
            onDelete(id)
        },
        [onDelete, t]
    )

    const columns = React.useMemo<ColumnDef<Brand>[]>(() => [
        {
            id: "logo",
            header: () => t("brands.table.logo") as string,
            cell: ({ row }) => {
                const b = row.original
                return b.logo_url ? (
                    <img src={b.logo_url} alt={t("brands.logo_alt", { name: b.name }) as string} className="h-10 w-10 rounded object-contain" loading="lazy" />
                ) : (
                    <div className="h-10 w-10 rounded bg-muted" aria-label={t("brands.no_logo") as string} />
                )
            },
            size: 64,
        },
        { accessorKey: "name", header: () => t("brands.table.name") as string, size: 240 },
        { accessorKey: "country", header: () => t("brands.table.country") as string, size: 160 },
        {
            id: "website",
            header: () => t("brands.table.website") as string,
            cell: ({ row }) => {
                const b = row.original
                return b.website ? (
                    <a href={b.website} target="_blank" rel="noopener noreferrer external" className="text-primary underline underline-offset-2">
                        {b.website}
                    </a>
                ) : (
                    "-"
                )
            },
            size: 240,
        },
        {
            id: "actions",
            header: () => t("brands.table.actions") as string,
            cell: ({ row }) => {
                const b = row.original
                return (
                    <div className="text-right space-x-2 rtl:space-x-reverse">
                        <Button asChild size="sm" variant="outline" aria-label={t("brands.actions.edit_aria", { name: b.name }) as string} title={t("brands.actions.edit") as string}>
                            <Link to={ROUTES.BRAND_EDIT(b.id)}>{t("brands.actions.edit")}</Link>
                        </Button>
                        {onDelete && (
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(b.id)} aria-label={t("brands.actions.delete_aria", { name: b.name }) as string} title={t("brands.actions.delete") as string}>
                                {t("brands.actions.delete")}
                            </Button>
                        )}
                    </div>
                )
            },
            size: 160,
        },
    ], [handleDelete, onDelete, t])

    const table = useReactTable({
        data: items as Brand[],
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: "onChange",
    })

    const parentRef = React.useRef<HTMLDivElement>(null)
    const rowVirtualizer = useVirtualizer({
        count: table.getRowModel().rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 48,
        overscan: 8,
    })

    const rows = table.getRowModel().rows
    const virtualRows = rowVirtualizer.getVirtualItems()
    const totalSize = rowVirtualizer.getTotalSize()

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
                        const row = rows[virtualRow.index]
                        return (
                            <div key={row.id} className="grid items-center border-b" style={{ position: "absolute", top: 0, left: 0, transform: `translateY(${virtualRow.start}px)`, height: virtualRow.size, gridTemplateColumns: table.getVisibleLeafColumns().map(c => `${c.getSize()}px`).join(" ") }}>
                                {row.getVisibleCells().map(cell => (
                                    <div key={cell.id} className="px-3 py-2 text-sm">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                ))}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
