"use client";

import { useState } from "react";
import { useBasket } from "@/context/basket";
import type { Product } from "@/lib/types";

export function AddToBasket({
    product,
}: {
    product: Pick<Product, "id" | "name" | "brand" | "price" | "imageUrl">;
}) {
    const {add} = useBasket();
    const [justAdded, setJustAdded] = useState(false);

    const handleAdd = () => {
        add(product, 1);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1500);
    };

    return (
        <button type="button" className="btn" onClick={handleAdd}>
            {justAdded ? "Added" : "Add To Basket"}
        </button>
    );
}