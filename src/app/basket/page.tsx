"use client";

import Link from "next/link";
import { useBasket } from "@/context/basket";
import { formatPrice } from "@/lib/format";

export default function BasketPage() {
  const { items, total, setQuantity, remove, clear, hydrated } = useBasket();

  // Avoid SSR/CSR mismatch — render a stable shell until hydrated.
  if (!hydrated) {
    return (
      <section>
        <h1 className="page-title">Basket</h1>
        <div className="state">Loading…</div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section>
        <h1 className="page-title">Basket</h1>
        <div className="state">
          <p>Your basket is empty.</p>
          <p style={{ marginTop: "1rem" }}>
            <Link href="/products" className="btn btn--secondary">
              Browse products
            </Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h1 className="page-title">Basket</h1>
      <table className="basket-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th aria-label="Remove" />
          </tr>
        </thead>
        <tbody>
          {items.map(({ product, quantity }) => (
            <tr key={product.id}>
              <td>
                <Link href={`/products/${product.id}`}>
                  <strong>{product.name}</strong>
                </Link>
                <div className="muted" style={{ fontSize: "0.8rem" }}>
                  {product.brand}
                </div>
              </td>
              <td>{formatPrice(product.price)}</td>
              <td>
                <div className="qty-control">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity(product.id, quantity - 1)}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(product.id, quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </td>
              <td>{formatPrice(product.price * quantity)}</td>
              <td>
                <button
                  type="button"
                  className="btn btn--small btn--danger"
                  onClick={() => remove(product.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="basket-summary">
        <button type="button" className="btn btn--secondary" onClick={clear}>
          Clear basket
        </button>
        <div className="basket-total">Total: {formatPrice(total)}</div>
      </div>
    </section>
  );
}
