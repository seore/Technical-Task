"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect, 
    useMemo,
    useState,
    type ReactNode,
} from "react";
import type { Product } from "@/lib/types";

export type BasketItem = {
    product: Pick<Product, "id" |  "name" | "brand" | "price" | "imageUrl">;
    quantity: number;
};

type BasketContext = {
    items: BasketItem[];
    itemCount: number;
    total: number;
    add: (product: BasketItem["product"], quantity?: number) => void;
    remove: (productId: string) => void;
    setQuantity: (productId: string, quantity: number) => void;
    clear: () => void;
    hydrated: boolean;
};

const BasketContext = createContext<BasketContext | null>(null);
const STORAGE_VALUE = "product-catalogue:basket:v1";

export function BasketProvider({children} : {children: ReactNode}) {
    const [items, setItems] = useState<BasketItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_VALUE);
            if (raw) {
                const parsed = JSON.parse(raw) as BasketItem[];
                if (Array.isArray(parsed)) setItems(parsed);
            }
        } catch {

        }
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        try {
            localStorage.setItem(STORAGE_VALUE, JSON.stringify(items));
        } catch {

        }
    }, [items, hydrated]);

    const add = useCallback(
        (product: BasketItem["product"], quantity: number = 1) => {
            setItems((prev) => {
                const existing = prev.find((i) => i.product.id === product.id);
                if (existing) {
                    return prev.map((i) =>
                      i.product.id === product.id
                      ? {...i, quantity: i.quantity + quantity}
                      : i,
                    );
                }
                return [...prev, {product, quantity}]
            });
        },
        [],
    );

    const remove = useCallback((productId: string) => {
        setItems((prev) => prev.filter((i) => i.product.id !== productId));
    }, []);

    const setQuantity = useCallback((productId: string, quantity: number) => {
        setItems((prev) => {
            if (quantity <= 0) return prev.filter((i) => i.product.id !== productId);
            return prev.map((i) =>
               i.product.id === productId ? {...i, quantity} : i,
            );
        });
    }, []);

    const clear = useCallback(() => setItems([]), []);

    const itemCount = useMemo(
        () => items.reduce((sum, i) => sum + i.quantity, 0),
        [items],
    );

    const total = useMemo(
        () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
        [items],
    );

    const value = useMemo<BasketContext>(
        () => ({items, itemCount, total, add, remove, setQuantity, clear, hydrated}),
        [items, itemCount, total, add, remove, setQuantity, clear, hydrated],
    );
    
    return ( <BasketContext.Provider value={value}>{children}</BasketContext.Provider>)
}

export function useBasket(): BasketContext {
    const ctx = useContext(BasketContext);
    if (!ctx) throw new Error("useBasket must be used within BasketProvider");
    return ctx;
}