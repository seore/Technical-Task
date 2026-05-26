import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export function ProductCard({product}: {product: Product}) {
    return(
        <Link
          href={`/products/${product.id}`}
          className="product-card"
          aria-label={`${product.name} by ${product.brand}`}
        >
            <div className="product-card__media">
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt="" loading="lazy"/>
                ) : (
                    <span>No image</span>
                )}
            </div>
            <div className="product-card__body">
                <span className="product-card__brand">{product.brand}</span>
                <span className="product-card__name">{product.name}</span>
                <div className="product-card__meta">
                    <span className="product-card__price">{formatPrice(product.price)}</span>
                    <span className="product-card__rating" aria-label={`Rating ${product.rating}`}>
                      ★ {product.rating.toFixed(1)}
                    </span>
                </div>
            </div>
        </Link>
    );
}