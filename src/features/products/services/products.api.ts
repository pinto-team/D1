import axios from "axios";

export interface Product {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export async function fetchProducts(limit: number, skip: number): Promise<ProductsResponse> {
    const { data } = await axios.get("https://dummyjson.com/products", {
        params: { limit, skip },
    });
    return data;
}
