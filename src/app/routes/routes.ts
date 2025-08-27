export const ROUTES = {
    ROOT: "/",
    LOGIN: "/login",

    DASHBOARD: "/dashboard",

    // Products
    PRODUCTS: "/products",
    PRODUCT_DETAILS: "/products/:id",
    PRODUCT_ADD: "/products/add",


    CATEGORIES: "/categories",

    // Brands
    BRANDS: "/brands",
    BRAND_NEW: "/brands/new",
    BRAND_EDIT: (id = ":id") => `/brands/${id}`, // برای Route: ROUTES.BRAND_EDIT() بزن
} as const
