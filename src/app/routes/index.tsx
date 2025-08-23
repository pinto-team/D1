// @/app/routes/index.tsx
import { createBrowserRouter } from "react-router-dom"
import AppRoot from "@/app/App"
import LoginPage from "@/features/auth/pages/LoginPage"
import DashboardPage from "@/features/dashboard/pages/DashboardPage"
import ProductsPage from "@/features/products/pages/ProductsPage"
import ProtectedRoute from "./ProtectedRoute"
import NotFound from "./NotFound"
import { ROUTES } from "@/app/routes/routes"

export const router = createBrowserRouter([
    {
        path: ROUTES.ROOT,
        element: <AppRoot />,
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    { index: true, element: <DashboardPage /> },               // پیش‌فرض = داشبورد
                    { path: ROUTES.DASHBOARD, element: <DashboardPage /> },    // مسیر /dashboard
                    { path: ROUTES.PRODUCTS, element: <ProductsPage /> },      // مسیر /products
                ],
            },
            { path: ROUTES.LOGIN, element: <LoginPage /> },
            { path: "*", element: <NotFound /> },
        ],
    },
])
