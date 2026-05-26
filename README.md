# 🧪 Frontend Technical Test – Next.js (App Router)

Thank you for taking the time to complete this exercise.

This task is designed to assess practical Next.js skills, architectural thinking, and frontend fundamentals.  
We care more about structure and reasoning than visual polish.

---

## ⏱ Time Expectation

Please spend a maximum of **8 hours** on this task.

You’re welcome to spend longer if you wish, but we will evaluate with the suggested timebox in mind.

---

# 🎯 The Task

Build a small **Next.js application (latest stable version)** using:

- ✅ App Router
- ✅ TypeScript
- ✅ Any styling solution of your choice

The application should implement a small product catalogue with search, filtering, and detail pages.

---

# 📦 Requirements

## 1️⃣ Data & API Layer

Create a local dataset inside the project (e.g. `/data/products.json`) containing **15–30 products**.

Each product must include:

- `id`
- `name`
- `brand`
- `price`
- `description`
- `tags` (array of strings)
- `rating` (number)
- optional `imageUrl`

Expose this data via **Next.js Route Handlers**:

### `GET /api/products`

Supports query parameters:

- `q` → text search (name / brand / tags)
- `minPrice`
- `maxPrice`
- `tag`
- `sort` → `price_asc`, `price_desc`, `rating_desc`
- `page`
- `pageSize`

Response shape:

```ts
{
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}
```

---

### `GET /api/products/[id]`

- Returns a single product
- Returns 404 if not found

---

## 2️⃣ Product List Page

Route: `/products`

Must include:

- Search input
- At least one filter
- Sorting
- Pagination OR “Load more”
- Loading state
- Empty state

**Important:**  
The URL must reflect state using search params.

Example:

```
/products?q=rose&sort=price_asc&page=2
```

---

## 3️⃣ Product Detail Page

Route: `/products/[id]`

Must include:

- Server-rendered product details
- Proper 404 handling using `notFound()`
- “Add to Basket” button (client-side interaction)

---

## 4️⃣ Basket Functionality

Implement either:

- A `/basket` page  
OR  
- A persistent mini-basket in the layout

Must support:

- Viewing items
- Updating quantity
- Removing items
- Showing total price

State management approach is up to you.

---

# ⚙️ Next.js-Specific Requirements

Please implement **at least two** of the following:

- A considered caching / revalidation strategy
- Validation of route handler query parameters
- Suspense / streaming with loading skeletons
- Dynamic `generateMetadata()` on product detail pages
- `error.tsx` and/or `not-found.tsx`

In your README, briefly explain the reasoning behind your choices.

---

# 📁 Deliverables

Please provide:

- A GitHub repository (private or public)
- A `README.md` including:
  - Setup instructions
  - Architectural decisions
  - What you would improve with more time

---

# 🤖 AI Usage

You are allowed to use AI tools (Copilot, ChatGPT, etc.).

Please include a file called:

```
AI-NOTES.md
```

In this file, briefly describe:

- What AI tools you used (if any)
- Two examples where you improved or corrected AI-generated output
- One architectural tradeoff you made and why

We care about judgement and understanding more than whether AI was used.

---

# 🧠 What We’re Evaluating

- Understanding of Next.js App Router
- Server vs Client component decisions
- Data fetching & caching awareness
- URL state handling
- TypeScript usage
- Code organisation & readability
- Loading / empty / error handling
- General UX & edge cases
- Technical reasoning

---

# 💬 Notes

- Keep it simple — avoid over-engineering.
- Visual design is not the focus.
- Clean structure and clarity matter most.
- Production-level polish is a bonus, not a requirement.

---

If anything is unclear, please ask before starting.

We look forward to reviewing your solution 🚀
