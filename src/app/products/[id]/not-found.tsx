import Link from "next/link";

export default function NotFound() {
  return (
    <section className="state" style={{ marginTop: "2rem" }}>
      <h1 style={{ margin: "0 0 0.5rem", fontSize: "1.4rem" }}>
        Product not found
      </h1>
      <p>The product you were looking for doesn&apos;t exist or was removed.</p>
      <p style={{ marginTop: "1rem" }}>
        <Link href="/products" className="btn btn--secondary">
          Back to products
        </Link>
      </p>
    </section>
  );
}
