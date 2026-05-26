import Link from "next/link";

export default function NotFound() {
    return (
        <section className="state" style={{ marginTop: "2rem" }}>
            <h1 style={{ margin: "0 0 0.5rem", fontSize: "1.4rem"}}>Page not found!</h1>
            <p>The page you are looking for does not exist.</p>
            <p style={{ marginTop: "1rem" }}>
                <Link href="/" className="btn btn-secondary">Go to Home</Link>
            </p>
        </section>
    );
}