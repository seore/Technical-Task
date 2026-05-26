import productsData from "../../data/products.json";
import type { Product, ProductList } from "./types";
import type { ProductQ } from "./validation";

const products: Product[] = productsData as Product[];

export function getAllProducts(): Product[] {
    return products;
}

export function getProductById(id: string): Product | undefined {
    return products.find((p) => p.id === id);
}

export function getAllTags(): string[] {
    const set = new Set<string>();
    for (const p of products) {
        for (const t of p.tags) set.add(t);
    }
    return Array.from(set).sort();
}

export function queryProducts(query: ProductQ): ProductList {
    let items = products.slice();

    if (query.q) {
        const needle = query.q.toLowerCase();
        items = items.filter(
            (p) => 
                p.name.toLowerCase().includes(needle) ||
                p.brand.toLowerCase().includes(needle) ||
                p.tags.some((t) => t.toLowerCase().includes(needle)),
        );
    }

    if (query.tag) {
        const tag = query.tag.toLowerCase();
        items = items.filter((p) => p.tags.some((t) => t.toLowerCase() === tag));
    }

     if (typeof query.minPrice === "number") {
        items = items.filter((p) => p.price >= query.minPrice!);
    }

     if (typeof query.maxPrice === "number") {
        items = items.filter((p) => p.price <= query.maxPrice!);
    }

     if (query.sort === "price_asc") {
        items.sort((a,b) => a.price - b.price);
    } else if (query.sort === "price_desc") {
        items.sort((a,b) => b.price - a.price);
    } else if (query.sort === "rating_desc") {
        items.sort((a,b) => b.rating - a.rating);
    }

    const total = items.length;
    const page = query.page;
    const pageSize = query.pageSize;
    const start = (page - 1) * pageSize;
    const paged = items.slice(start, start + pageSize);

    return { items: paged, total, page, pageSize };
}