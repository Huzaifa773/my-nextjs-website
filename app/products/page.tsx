export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getFilteredProducts } from "@/lib/products";
import { ProductCard, ProductCardData } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { Sparkles } from "lucide-react";

async function getWishlistedIds(userId?: string) {
  if (!userId) return new Set<string>();
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: { items: { select: { productId: true } } },
  });
  return new Set(wishlist?.items.map((i) => i.productId) || []);
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const session = await getServerSession(authOptions);
  const wishlisted = await getWishlistedIds(session?.user?.id);

  const { products, pagination } = await getFilteredProducts({
    search: searchParams.search,
    category: searchParams.category,
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
    sort: (searchParams.sort as any) || "newest",
    page: searchParams.page ? parseInt(searchParams.page, 10) : 1,
  });

  const cardData: ProductCardData[] = products.map((p) => {
    const ratings = p.reviews;
    const avgRating = ratings.length ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length : 5;
    return {
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: Number(p.price),
      discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
      stock: p.stock,
      images: p.images,
      avgRating,
      reviewCount: ratings.length || 1,
      isWishlisted: wishlisted.has(p.id),
    };
  });

  return (
    <div className="bg-obsidian-950 text-ivory min-h-screen">
      {/* Header Banner */}
      <div className="border-b border-neutral-800/80 bg-gradient-to-b from-obsidian-900 to-obsidian-950 py-14 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold mb-3">
            <Sparkles size={13} />
            <span>The Master Perfumer's Archive</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-ivory">
            {searchParams.search ? (
              <>
                Search Results for <span className="gold-gradient-text">"{searchParams.search}"</span>
              </>
            ) : (
              <>
                Complete <span className="gold-gradient-text">Fragrance Catalog</span>
              </>
            )}
          </h1>
          <p className="mt-2 text-xs md:text-sm text-neutral-400">
            Showing {pagination.total} artisanal extraits and oils crafted for royal distinction.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <ProductFilters />

        {cardData.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-800 bg-obsidian-900/40 py-24 text-center">
            <p className="font-serif text-xl text-gold-300">No Fragrances Found</p>
            <p className="text-sm text-neutral-400 mt-2">
              No creations match your selected filters. Try broadening your criteria.
            </p>
            <Link href="/products" className="btn-secondary mt-6 inline-flex text-xs uppercase tracking-wider">
              Reset All Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {cardData.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-14 flex justify-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
              const params = new URLSearchParams(searchParams as Record<string, string>);
              params.set("page", String(p));
              const isActive = p === pagination.page;
              return (
                <Link
                  key={p}
                  href={`/products?${params.toString()}`}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-bold transition-all ${
                    isActive
                      ? "border-gold bg-gradient-to-r from-gold to-gold-400 text-obsidian-950 shadow-gold-glow"
                      : "border-neutral-800 bg-obsidian-900 text-neutral-300 hover:border-gold hover:text-gold"
                  }`}
                >
                  {p}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

