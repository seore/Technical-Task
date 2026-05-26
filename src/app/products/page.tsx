import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductFilter } from "@/components/ProductFilter";
import { ProductCard } from "@/components/ProductCard";
import { Pagination } from "@/components/Pagination";
import { ProductGrid } from "@/components/ProductGrid";
import { getAllTags, queryProducts } from "@/lib/products";
import { productQuerySchema } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse the full product catalogue.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const tags = getAllTags();

  return (
    <section>
      <h1 className="page-title">Products</h1>
      <ProductFilter tags={tags} />
      {/* */}
      <Suspense
        key={JSON.stringify(sp)}
        fallback={<ProductGrid count={8} />}
      >
        <ProductResults searchParams={sp} />
      </Suspense>
    </section>
  );
}

async function ProductResults({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const flat: Record<string, string> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") flat[key] = value;
    else if (Array.isArray(value) && value.length > 0) flat[key] = value[0];
  }

  const parsed = productQuerySchema.safeParse(flat);
  const query = parsed.success
    ? parsed.data
    : productQuerySchema.parse({});

  const { items, total, page, pageSize } = queryProducts(query);

  if (items.length === 0) {
    return (
      <div className="state">
        <p>No products match your filters.</p>
        <p className="muted" style={{ fontSize: "0.85rem" }}>
          Try removing a filter or clearing the search.
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="muted" style={{ marginBottom: "1rem", fontSize: "0.85rem" }}>
        {total} {total === 1 ? "product" : "products"}
      </p>
      <div className="product-grid">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <Pagination page={page} pageSize={pageSize} total={total} />
    </>
  );
}
