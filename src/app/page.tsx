import Link from "next/link";

export default function Home() {
    return (
        <section style={{ padding: "3rem 0", maxWidth: 640 }}>
            <h1 className="page-title">Product Catalogue</h1>
            <p className="muted" style={{ marginTop: "1.5rem" }}>
                A small demo with search, filtering, detail pages and more.
            </p>
            <Link href="/products" className="btn">Browse Products</Link>
        </section>
    );
}