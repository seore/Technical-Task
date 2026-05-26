import { ProductGrid } from "@/components/ProductGrid";

export default function Loading() {
    return (
        <section>
            <h1 className="page-title">Products</h1>
            <ProductGrid count={8} />
        </section>
    );
}