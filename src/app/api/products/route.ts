import { NextResponse } from "next/server";
import { queryProducts } from "@/lib/products";
import { productQuerySchema } from "@/lib/validation";

export const revalidate = 3600; // 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const raw: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    raw[key] = value;
  }

  const parsed = productQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid query parameters",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  if (
    typeof parsed.data.minPrice === "number" &&
    typeof parsed.data.maxPrice === "number" &&
    parsed.data.minPrice > parsed.data.maxPrice
  ) {
    return NextResponse.json(
      { error: "minPrice must be less than or equal to maxPrice" },
      { status: 400 },
    );
  }

  const result = queryProducts(parsed.data);
  return NextResponse.json(result);
}
