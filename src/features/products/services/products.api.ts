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

export interface ProductDetails extends Product {
    description: string;
    category: string;
    brand: string;
    discountPercentage: number;
    rating: number;
    stock: number;
    tags: string[];
    sku: string;
    weight: number;
    dimensions: {
        width: number;
        height: number;
        depth: number;
    };
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    reviews: {
        reviewerName: string;
        reviewerEmail: string;
        rating: number;
        comment: string;
        date: string;
    }[];
    returnPolicy: string;
    minimumOrderQuantity: number;
    meta: {
        createdAt: string;
        updatedAt: string;
        barcode: string;
        qrCode: string;
    };
    images: string[];
}

export async function fetchProducts(limit: number, skip: number, q?: string): Promise<ProductsResponse> {
    const params: Record<string, string | number> = { limit, skip };
    let url = "https://dummyjson.com/products";
    if (q && q.trim().length > 0) {
        params.q = q;
        url = "https://dummyjson.com/products/search";
    }
    const { data } = await axios.get(url, { params });
    return data;
}

export async function fetchProduct(id: number): Promise<ProductDetails> {
    const { data } = await axios.get(`https://dummyjson.com/products/${id}`);
    return data;
}
