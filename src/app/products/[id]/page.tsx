import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getProductById } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { AddToBasket } from "@/components/AddToBasket";

type Params = Promise<{ id: string }>;

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) {
    return { title: "Product not found" };
  }
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} · ${product.brand}`,
      description: product.description,
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const product = getProductById(id);
  // notFound() throws and triggers not-found.tsx — the App Router idiom.
  if (!product) notFound();

  return (
    <article>
      <p style={{ marginBottom: "1rem" }}>
        <Link href="/products" className="muted">
          ← Back to products
        </Link>
      </p>
      <div className="product-detail">
        <div className="product-detail__media">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt="" />
          ) : (
            <span>No image</span>
          )}
        </div>
        <div>
          <p className="product-detail__brand">{product.brand}</p>
          <h1 className="product-detail__name">{product.name}</h1>
          <p className="product-detail__price">{formatPrice(product.price)}</p>
          <p className="muted" style={{ fontSize: "0.85rem" }}>
            ★ {product.rating.toFixed(1)} rating
          </p>
          <p className="product-detail__description">{product.description}</p>

          <div className="tag-row" aria-label="Tags">
            {product.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>

          <AddToBasket
            product={{
              id: product.id,
              name: product.name,
              brand: product.brand,
              price: product.price,
              imageUrl: product.imageUrl,
            }}
          />
        </div>
      </div>
    </article>
  );
}
