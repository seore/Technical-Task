export type Product = {
    id: string;
    name: string;
    brand: string;
    price: number;
    description: string;
    tags: string[];
    rating: number;
    imageUrl?: string;
};

export type ProductList = {
    items: Product[];
    total: number;
    page: number;
    pageSize: number;
};
