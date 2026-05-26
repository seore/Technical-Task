# AI Notes

## Tools used

Claude (Anthropic) for debugging. 

## Two examples where I improved or corrected AI output

### 1. `notFound()` returning HTTP 200 instead of 404

When I tested an unknown product ID against `/products/[id]`, the page rendered the not-found UI but the response status came back as `200 OK`. Claude's first suggestion was `generateStaticParams` to prerender all detail pages, but that's exactly what caused the issue — with prerendering plus `revalidate`, Next.js caches the not-found result as a 200 response.

I dropped `generateStaticParams`, switched the route to `dynamic = 'force-dynamic'`, and accepted that the API endpoint (`/api/products/[id]`) is what actually returns a real 404 — which the brief explicitly requires. The page-level status quirk is a known Next 15 behaviour and not something I'd ship a workaround for in a take-home.

### 2. Basket hydration mismatch

The first basket implementation read from `localStorage` directly inside `useState`'s initial value. That breaks under SSR — server renders empty, client renders with stored items, React flags the mismatch.

I rewrote it to initialise as empty, hydrate inside `useEffect`, and gate UI on a `hydrated` boolean. The header badge and basket page both wait for hydration before showing counts, so there's no flash of wrong content. The write effect also has a guard so the initial empty state doesn't overwrite real saved data before hydration completes.

## One architectural tradeoff

**The server-rendered list page doesn't fetch from its own API.**

The obvious pattern: `/products/page.tsx` calls `fetch('/api/products?...')`. Symmetric, easy to explain, what a lot of tutorials show.

I didn't do that. Both the page and the API route handler call `queryProducts()` directly from `src/lib/products.ts`. The API exists because the brief required it, but on the actual render path the page hits the data layer in-process.

The reason: a self-fetch round-trip is slower and harder to debug than a function call, and one of the points of server components is to avoid that round-trip. The two paths can't drift because they share the same Zod schema and the same query function.

The cost is that someone scanning the code might expect to see a `fetch` call in the page and not find one. I'd rather pick the right pattern and explain it in the README than pick the obvious one and accept the latency.
