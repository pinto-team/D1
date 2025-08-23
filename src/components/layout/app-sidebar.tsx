// AppSidebar.tsx (اصلاح‌شده)
import * as React from "react"
import { useMemo } from "react"
import {
    ChevronDown, CircleUser, DollarSignIcon, NotebookIcon,
    Settings as SettingsIcon, ShoppingBagIcon, Store, Truck, Warehouse,
} from "lucide-react"
import { IconInnerShadowTop } from "@tabler/icons-react"
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
} from "@/components/ui/sidebar.tsx"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible.tsx"
import { NavUser } from "@/components/layout/nav-user.tsx"
import { useI18n } from "@/shared/hooks/useI18n.ts"
import { useAuth } from "@/features/auth/hooks/useAuth.ts"
import { isRTLLocale, getSidebarSide, getTextAlignClass } from "@/shared/i18n/utils.ts"

type TranslateFn = (key: string) => string
type MenuChild = { titleKey: string; url: string }
type MenuItem = {
    titleKey: string; url?: string;
    icon: React.ComponentType<{ className?: string }>;
    children?: MenuChild[];
}

const itemsSchema: MenuItem[] = [
    { titleKey: "menu.orders", icon: ShoppingBagIcon, children: [
            { titleKey: "menu.orders.active", url: "#orders-active" },
            { titleKey: "menu.orders.history", url: "#orders-history" },
        ]},
    { titleKey: "menu.store", icon: Store, children: [
            { titleKey: "menu.store.restaurants", url: "#store-restaurants" },
            { titleKey: "menu.store.supermarket", url: "#store-supermarket" },
        ]},
    { titleKey: "menu.pinto", icon: Warehouse, children: [
            { titleKey: "menu.pinto.max", url: "#pinto-max" },
            { titleKey: "menu.pinto.eco", url: "#pinto-eco" },
            { titleKey: "menu.pinto.pro", url: "#pinto-pro" },
        ]},
    { titleKey: "menu.users", icon: CircleUser, children: [
            { titleKey: "menu.users.customers", url: "#users-customers" },
            { titleKey: "menu.users.admins", url: "#users-admins" },
        ]},
    { titleKey: "menu.logistics", icon: Truck, children: [
            { titleKey: "menu.logistics.motorcycle", url: "#logistics-motorcycle" },
            { titleKey: "menu.logistics.van", url: "#logistics-van" },
        ]},
    { titleKey: "menu.finance", icon: DollarSignIcon, children: [
            { titleKey: "menu.finance.dailySales", url: "#finance-daily-sales" },
            { titleKey: "menu.finance.logisticsCosts", url: "#finance-logistics-costs" },
        ]},
    { titleKey: "menu.reports", icon: NotebookIcon, children: [
            { titleKey: "menu.reports.orders", url: "#reports-orders" },
            { titleKey: "menu.reports.topProducts", url: "#reports-top-products" },
        ]},
    { titleKey: "menu.settings", icon: SettingsIcon, children: [
            { titleKey: "menu.settings.shippingRate", url: "#settings-shipping-rate" },
            { titleKey: "menu.settings.addProducts", url: "#settings-add-products" },
        ]},
]

const translateItems = (items: MenuItem[], t: TranslateFn) =>
    items.map((item) => ({
        ...item,
        title: t(item.titleKey),
        children: item.children?.map((child) => ({ ...child, title: t(child.titleKey) })) ?? [],
    }))

function MenuSection({
                         label, items, isRTL,
                     }: { label: string; items: ReturnType<typeof translateItems>; isRTL: boolean }) {
    const align = getTextAlignClass(isRTL ? "fa" : "en")
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/70">{label}</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <Collapsible key={item.titleKey} className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    {/* رنگ متن/آیکن از توکن‌ها */}
                                    <SidebarMenuButton className={`w-full ${align} text-sidebar-foreground`}>
                                        <item.icon className="shrink-0" />
                                        <span className="flex-1">{item.title}</span>
                                        <ChevronDown className={`ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 ${isRTL ? 'ml-0 mr-auto' : ''}`} />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                {item.children.length > 0 && (
                                    <CollapsibleContent className="data-[state=closed]:hidden">
                                        <SidebarMenuSub>
                                            {item.children.map((subItem, index) => (
                                                <SidebarMenuSubItem key={`${item.titleKey}-${subItem.url}-${index}`}>
                                                    <SidebarMenuSubButton asChild>
                                                        {/* زیرمنو با رنگ سایدبار */}
                                                        <a
                                                            href={subItem.url}
                                                            className={`w-full ${align} text-sidebar-foreground/90 hover:text-sidebar-foreground`}
                                                        >
                                                            <span>{subItem.title}</span>
                                                        </a>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                )}
                            </SidebarMenuItem>
                        </Collapsible>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const { t, locale } = useI18n()
    const { user: authUser, logout } = useAuth()

    const user = authUser
        ? {
            name: `${authUser.firstName} ${authUser.lastName}`.trim() || authUser.username,
            email: authUser.email,
            avatar: authUser.image ?? "/avatars/placeholder.png",
        }
        : {
            name: t("guest"),
            email: "",
            avatar: "/avatars/placeholder.png",
        }

    // Check if current locale is RTL
    const isRTL = isRTLLocale(locale)
    const side = getSidebarSide(locale)
    const items = useMemo(() => translateItems(itemsSchema, t), [t])

    return (
        <Sidebar collapsible="offcanvas" side={side} dir={isRTL ? "rtl" : "ltr"} {...props}>
            <SidebarHeader className="data-[slot=sidebar-menu-button]:!p-1.5">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="text-sidebar-foreground">
                            <a href="#">
                                <IconInnerShadowTop className="!size-5" />
                                <span className="text-base font-semibold">{t("appTitle")}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <MenuSection label={t("appTitle")} items={items} isRTL={isRTL} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={user} onLogout={logout} />
            </SidebarFooter>
        </Sidebar>
    )
}
