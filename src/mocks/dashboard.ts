// mocks/dashboard.ts
import { http, HttpResponse } from 'msw'
import { API_ROUTES } from '@/shared/constants/apiRoutes'

export type KpiKey = "visits" | "newUsers" | "orders" | "tickets";

export type DashboardKpi = {
    key: KpiKey;
    value: number;
    deltaPercent: number; // positive or negative
};

export const dashboardKpis: DashboardKpi[] = [
    { key: "visits", value: 12450, deltaPercent: 12 },
    { key: "newUsers", value: 1248, deltaPercent: 5 },
    { key: "orders", value: 328, deltaPercent: -3 },
    { key: "tickets", value: 57, deltaPercent: 2 },
];

export type RecentActivity =
    | { type: "userSignedUp"; minutesAgo: number }
    | { type: "orderCreated"; minutesAgo: number; orderId: number }
    | { type: "ticketAnswered"; hoursAgo: number; ticketId: number };

export const recentActivities: RecentActivity[] = [
    { type: "userSignedUp", minutesAgo: 2 },
    { type: "orderCreated", minutesAgo: 10, orderId: 4392 },
    { type: "ticketAnswered", hoursAgo: 1, ticketId: 981 },
];

// Mock chart data
const chartData = {
    sales: [
        { month: 'Jan', value: 12000 },
        { month: 'Feb', value: 19000 },
        { month: 'Mar', value: 15000 },
        { month: 'Apr', value: 22000 },
        { month: 'May', value: 18000 },
        { month: 'Jun', value: 25000 },
    ],
    users: [
        { month: 'Jan', value: 1000 },
        { month: 'Feb', value: 1200 },
        { month: 'Mar', value: 1100 },
        { month: 'Apr', value: 1400 },
        { month: 'May', value: 1300 },
        { month: 'Jun', value: 1600 },
    ]
}

export const dashboardHandlers = [
    // Dashboard stats
    http.get(API_ROUTES.DASHBOARD.STATS, () => {
        return HttpResponse.json({
            kpis: dashboardKpis,
            totalRevenue: 125000,
            totalOrders: 1248,
            totalUsers: 8900,
        })
    }),

    // Dashboard charts
    http.get(API_ROUTES.DASHBOARD.CHARTS, ({ request }) => {
        const url = new URL(request.url)
        const type = url.searchParams.get('type') || 'sales'
        
        return HttpResponse.json({
            data: chartData[type as keyof typeof chartData] || chartData.sales,
            type,
        })
    }),

    // Dashboard activity
    http.get(API_ROUTES.DASHBOARD.ACTIVITY, () => {
        return HttpResponse.json({
            activities: recentActivities,
            total: recentActivities.length,
        })
    }),

    // Dashboard notifications
    http.get(API_ROUTES.DASHBOARD.NOTIFICATIONS, () => {
        return HttpResponse.json({
            notifications: [
                { id: 1, message: 'New order received', type: 'info', read: false },
                { id: 2, message: 'System maintenance scheduled', type: 'warning', read: true },
                { id: 3, message: 'Payment processed successfully', type: 'success', read: false },
            ],
            unreadCount: 2,
        })
    }),
]