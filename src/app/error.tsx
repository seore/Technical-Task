"use client";

import { useEffect } from "react";

export default function Error ({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void; 
}) {
    useEffect(() => {
        console.error(error);
    }, []);

    return (
        <section className="state" style={{ marginTop: "2px" }}>
            <h1 style={{ margin: "0 0 0.2rem", marginTop: "1.4rem" }}>
                Something went wrong
            </h1>
            <p>Something unexpected happened when loading this page.</p>
            <button 
              type="button"
              className="btn btn-primary"
              onClick={reset}
              style={{ marginTop: "1.4rem"}}
            >
                TRY AGAIN
            </button>
        </section>
    );
}