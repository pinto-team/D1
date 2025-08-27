import { AppSidebar } from "@/features/sidebar/app-sidebar.tsx"
import { ChartAreaInteractive } from "@/components/layout/chart-area-interactive.tsx"
import { DataTable } from "@/components/layout/data-table.tsx"
import { SectionCards } from "@/components/layout/section-cards.tsx"
import { SiteHeader } from "@/components/layout/site-header.tsx"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"
import React from "react";

export default function Page() {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <SectionCards />
                            <div className="px-4 lg:px-6">
                                <ChartAreaInteractive />
                            </div>
                            <DataTable data={data} />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
