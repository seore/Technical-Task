"use client";

import Link from "next/link";
import { useBasket } from "@/context/basket";

export function BasketNavigation() {
    const {itemCount, hydrated} = useBasket();
    return (
        <Link href="/basket" className="basket-link">
            <span>Basket</span>
            {hydrated && itemCount > 0 && (
                <span className="basket-badge" aria-label={`${itemCount} items in basket`}>
                    {itemCount}
                </span>
            )}
        </Link>
    );
}
