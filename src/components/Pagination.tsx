"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Props = {
    page: number;
    pageSize: number;
    total: number;
};

export function Pagination({page, pageSize, total}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (totalPages <= 1) return null;

    const go = (next: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (next <= 1) params.delete("page");
        else params.set("page", String(next));
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <nav className="pagination" aria-label="Pagination">
            <button onClick={() => go(page - 1)} disabled={page <= 1}>
              Previous
            </button>
            <span className="pagination__info">
                Page {page} of {totalPages}
            </span>
            <button onClick={() => go(page + 1)} disabled={page >= totalPages}>
                Next
            </button>
        </nav>
    )
}