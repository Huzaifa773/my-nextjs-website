import { NextResponse } from "next/server";
import { getFilteredProducts } from "@/lib/products";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const result = await getFilteredProducts({
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") || undefined,
    minPrice: searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined,
    maxPrice: searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined,
    sort: (searchParams.get("sort") as any) || "newest",
    page: searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1,
    pageSize: searchParams.get("pageSize") ? parseInt(searchParams.get("pageSize")!, 10) : 12,
  });

  return NextResponse.json(result);
}
