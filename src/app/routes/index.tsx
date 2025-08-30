import { createBrowserRouter } from "react-router-dom"
import AppRoot from "@/app/App"

import LoginPage from "@/features/auth/pages/LoginPage"
import DashboardPage from "@/features/dashboard/pages/DashboardPage"

// Products
import ProductsPage from "@/features/products/pages/ProductsPage"
import ProductDetailsPage from "@/features/products/pages/ProductDetailsPage"
import AddProductPage from "@/features/products/pages/AddProductPage"

// Brands
import BrandsPage from "@/features/brands/pages/BrandsPage"
import AddBrandPage from "@/features/brands/pages/AddBrandPage"
import EditBrandPage from "@/features/brands/pages/EditBrandPage"
import CategoriesPage from "@/features/categories/pages/CategoriesPage"
import AddCategoryPage from "@/features/categories/pages/AddCategoryPage"

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
                    { index: true, element: <DashboardPage /> },                      // پیش‌فرض = داشبورد
                    { path: ROUTES.DASHBOARD, element: <DashboardPage /> },           // /dashboard

                    // Products
                    { path: ROUTES.PRODUCTS, element: <ProductsPage /> },             // /products
                    { path: ROUTES.PRODUCT_ADD, element: <AddProductPage /> },        // /products/add
                    { path: ROUTES.PRODUCT_DETAILS, element: <ProductDetailsPage />}, // /products/:id

                    // Brands
                    { path: ROUTES.BRANDS, element: <BrandsPage /> },                 // /brands
                    { path: ROUTES.BRAND_NEW, element: <AddBrandPage /> },            // /brands/new
                    { path: ROUTES.BRAND_EDIT(), element: <EditBrandPage /> },        // /brands/:id

                    // Categories
                    { path: ROUTES.CATEGORIES, element: <CategoriesPage /> },         // /categories
                    { path: ROUTES.CATEGORIES + "/new", element: <AddCategoryPage /> },
                ],
            },
            { path: ROUTES.LOGIN, element: <LoginPage /> },
            { path: "*", element: <NotFound /> },
        ],
    },
])
