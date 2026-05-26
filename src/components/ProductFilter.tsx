"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Props = {
  tags: string[];
};

export function ProductFilter({ tags }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchText, setSearchText] = useState(searchParams.get("q") ?? "");

  
  useEffect(() => {
    setSearchText(searchParams.get("q") ?? "");
  }, [searchParams]);

  const updateParams = useCallback(
    (mutations: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(mutations)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      if (!("page" in mutations)) next.delete("page");
      router.push(`${pathname}?${next.toString()}`);
    },
    [router, pathname, searchParams],
  );

  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (searchText === current) return;
    const handle = setTimeout(() => {
      updateParams({ q: searchText || null });
    }, 300);
    return () => clearTimeout(handle);
  }, [searchText, searchParams, updateParams]);

  return (
    <div className="filters">
      <div className="field">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          type="search"
          placeholder="Search by name, brand, or tag"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          value={searchParams.get("tag") ?? ""}
          onChange={(e) => updateParams({ tag: e.target.value || null })}
        >
          <option value="">All tags</option>
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="sort">Sort</label>
        <select
          id="sort"
          value={searchParams.get("sort") ?? ""}
          onChange={(e) => updateParams({ sort: e.target.value || null })}
        >
          <option value="">Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_desc">Top Rated</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="maxPrice">Max price (£)</label>
        <input
          id="maxPrice"
          type="number"
          min={0}
          step={1}
          placeholder="No limit"
          value={searchParams.get("maxPrice") ?? ""}
          onChange={(e) => updateParams({ maxPrice: e.target.value || null })}
        />
      </div>
    </div>
  );
}
