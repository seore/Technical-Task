# Product Catalogue — Next.js Technical Test

A small Next.js (App Router) product catalogue with search, filtering, sorting, pagination, server-rendered detail pages, and a persistent basket.

## Setup

Requires Node.js 18.18+.

```bash
npm install
npm run dev
# → http://localhost:3000
```

Other scripts:

```bash
npm run build       
npm start            
npm run typecheck   
npm run lint        
```

## Tech stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** (strict)
- **Zod** for query-param validation
- Plain CSS in `globals.css` — no UI library, no Tailwind. Sticking to the brief it says visual polish is not the focus, so the styling is neutral.

## Routes

| Route                  | What it does                                                       |
| ---------------------- | ------------------------------------------------------------------ |
| `/`                    | Landing page                                                       |
| `/products`            | List with search, tag filter, max-price filter, sort, pagination   |
| `/products/[id]`       | Server-rendered detail page with dynamic metadata, Add-to-Basket   |
| `/basket`              | Basket page — view items, change quantity, remove, total           |
| `/api/products`        | List endpoint, supports `q`, `minPrice`, `maxPrice`, `tag`, `sort`, `page`, `pageSize` |
| `/api/products/[id]`   | Single product endpoint, returns 404 if not found                  |

## Project layout

```
data/
  products.json              
src/
  app/
    api/products/            
      [id]/route.ts
      route.ts
    products/                
      [id]/
        not-found.tsx
        page.tsx
      loading.tsx
      page.tsx
    basket/page.tsx
    error.tsx                
    not-found.tsx            
    layout.tsx
    page.tsx
    globals.css
  components/                
  context/basket.tsx         
  lib/
    products.ts              
    validation.ts            
    format.ts                
    types.ts
```

## Architectural decisions

### Data layer is one module, used by everything

`src/lib/products.ts` exposes `queryProducts(query)`, `getProductById(id)`, and `getAllTags()`. Both the route handlers AND the server-rendered list page call the same function. This means:

- The list page doesn't have to round-trip to its own API just to render — it calls the data layer directly on the server, which is what App Router server components are for.
- The `/api/products` route exists for completeness (the brief required it) and for any future client that needs JSON, but isn't on the critical path for first paint.
- Both entry points share the same Zod validation, so a query string that's valid on one is valid on the other.

If the dataset were swapped for a database or CMS, only `src/lib/products.ts` would change.

### URL is the source of truth for list state

The products list is a server component that reads `searchParams` directly. The filters component is the only client component on the page, and its only job is to push URL changes. This gives:

- **Shareable URLs.** `/products?q=rose&sort=price_asc&page=2` is a complete state.
- **Back/forward works for free.** The browser does the heavy lifting.
- **No client-side state library.** I never reach for Zustand/Redux when the URL already holds the state.
- **Debounced search.** A 300ms timer on the text input avoids a router push on every keystroke.

The Pagination component also reads/writes URL params; any filter change resets `page` so users don't land on an empty page after narrowing the result set.

### Server vs client components

- **Server by default.** Pages, ProductCard, the data layer, the skeleton.
- **Client only where there's interactivity.** `ProductFilters` (writes URL), `Pagination` (writes URL), `AddToBasket` (mutates basket context), `BasketProvider` and `BasketNavLink` (Context + storage), basket page.

The basket lives entirely client-side because it's session-local; there's no auth model in scope. I used React Context with a localStorage mirror — small enough that a state library would be over-engineering.

### Caching / revalidation

`/api/products` and `/api/products/[id]` both export `revalidate = 3600`. The dataset is shipped with the app, so a long revalidate window is safe and cheap. If the source were a CMS, the right next step would be `revalidateTag('products')` triggered by a webhook.

The product detail page is marked `dynamic = 'force-dynamic'`. With an in-memory dataset there's no measurable win from prerendering, and dynamic rendering keeps `notFound()` behaviour clean. (Note: in Next 15 production builds, `notFound()` calls `not-found.tsx` correctly but the HTML response status can be 200 in some configurations — this is a platform behaviour, not a logic bug. The route handler version of the same lookup at `/api/products/[id]` returns a proper 404.)

### Suspense + streaming

`/products/page.tsx` wraps the results in `<Suspense>` with a skeleton fallback. The Suspense `key` includes the serialised search params, which forces the fallback to re-show every time a filter changes — that's the user-visible "I heard you, working on it" signal. There's also a top-level `loading.tsx` for full-route transitions.

The data layer is currently synchronous, so streaming isn't strictly necessary today — but the boundary is in the right place if the data source ever becomes async.

### Validation

`src/lib/validation.ts` defines a single Zod schema used by both the route handler and the page's server component. The schema:

- Coerces strings to numbers where needed (search params are always strings).
- Constrains `sort` to the documented enum values.
- Sets sensible defaults for `page` (1) and `pageSize` (12, capped at 50).

The route handler adds a cross-field check (`minPrice <= maxPrice`) that's easier to express in code than in Zod. Invalid input returns a 400 with structured `issues` describing what was wrong. The page's server component is more forgiving — invalid params fall back to defaults rather than throwing, because losing your filters mid-browse is a worse UX than ignoring a malformed one.

### Error & not-found handling

- `src/app/error.tsx` — global error boundary, "Try again" reset button.
- `src/app/not-found.tsx` — global 404 for unknown routes.
- `src/app/products/[id]/not-found.tsx` — scoped not-found, triggered by `notFound()` from the detail page when the id doesn't exist.

### Dynamic metadata

`generateMetadata` on the product detail page returns per-product `title`, `description`, and `openGraph` data. Combined with the root layout's `title.template`, every detail page gets a title like "Rose Velvet Lipstick · Product Catalogue".

## Which "Next.js-specific requirements" are covered

The brief asked for at least two of these. I did all five:

| # | Requirement                                  | Where                                                                |
| - | -------------------------------------------- | -------------------------------------------------------------------- |
| 1 | Caching / revalidation strategy              | `revalidate = 3600` on both route handlers; documented reasoning     |
| 2 | Route handler query-param validation         | `src/lib/validation.ts` (Zod); 400 with structured errors            |
| 3 | Suspense / streaming with loading skeletons  | `Suspense` boundary on list page + `loading.tsx` + skeleton component |
| 4 | Dynamic `generateMetadata()` on detail pages | `src/app/products/[id]/page.tsx`                                     |
| 5 | `error.tsx` and `not-found.tsx`              | Global plus scoped not-found for product detail                      |

## What I'd improve with more time

- **Test suite.** Vitest for the data layer (deterministic, pure functions), Playwright for one happy-path browse → add to basket → checkout flow.
- **Real images and `next/image`.** Right now product images come from placehold.co via a plain `<img>` to avoid needing to configure `remotePatterns`. With real product images I'd switch to `next/image` for automatic optimisation and proper `sizes`/`priority` handling.
- **Optimistic UI on add-to-basket.** Currently it's instant because the basket is local; once it's server-backed I'd use `useOptimistic`.
- **Tag chips as multi-select filters.** A single-select dropdown is good enough for a take-home; a real catalogue would want multi-tag filtering with chip UI.
- **Sorted/grouped facet counts.** "Skincare (8), Makeup (6)..." next to each filter option, with counts that update as other filters narrow the result set.
- **Accessibility audit.** The basics are there (aria-labels, aria-busy on the skeleton, labelled controls), but I'd run axe and tab through the whole flow before shipping.
- **Server actions for the basket** instead of localStorage, the moment there's an authenticated user.
- **Rate limiting and CORS** on the API route handlers for any public exposure.
