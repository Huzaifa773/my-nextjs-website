"use client";

import Link from "next/link";
import { Sparkles, Eye } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { WishlistButton } from "@/components/WishlistButton";
import { AddToCartButton } from "@/components/AddToCartButton";
import { StarRating } from "@/components/StarRating";

export interface ProductCardData {
  id: string;
  name: string;
  brand: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  images: { url: string; altText: string | null }[];
  avgRating?: number;
  reviewCount?: number;
  isWishlisted?: boolean;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const image =
    product.images[0]?.url ||
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=85";

  const hasDiscount =
    product.discountPrice != null &&
    product.discountPrice < product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice!) / product.price) * 100
      )
    : 0;

  const currentPrice = hasDiscount
    ? product.discountPrice!
    : product.price;

  return (
    <div className="card-luxury group relative flex h-full flex-col justify-between">
      {/* Product Image Stage */}
      <div className="card-shine relative aspect-[4/5] w-full overflow-hidden bg-obsidian-950/90">
        <Link
          href={`/products/${product.id}`}
          className="block h-full w-full"
        >
          <img
            src={image}
            alt={product.images[0]?.altText || product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-[0.5deg]"
          />
        </Link>

        {/* Ambient Dark Gradient on Image */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-black/30 opacity-70 transition-opacity duration-300 group-hover:opacity-40" />

        {/* Badges */}
        <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-obsidian-950 shadow-gold-glow">
              <Sparkles size={10} />
              {discountPercent}% OFF
            </span>
          )}

          {product.stock <= 5 && product.stock > 0 && (
            <span className="rounded-full border border-red-500/40 bg-red-950/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-300 backdrop-blur-sm">
              Only {product.stock} Left
            </span>
          )}

          {product.stock === 0 && (
            <span className="rounded-full border border-neutral-700 bg-neutral-900/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 backdrop-blur-sm">
              Sold Out
            </span>
          )}
        </div>

        {/* Top-Right Floating Wishlist */}
        <div className="absolute right-3 top-3 z-10">
          <WishlistButton
            productId={product.id}
            productName={product.name}
            initialWishlisted={product.isWishlisted}
          />
        </div>

        {/* Quick View Button */}
        <div className="absolute inset-x-0 bottom-4 z-10 hidden items-center justify-center px-4 opacity-0 translate-y-3 transition-all duration-300 ease-out md:flex group-hover:translate-y-0 group-hover:opacity-100">
          <Link
            href={`/products/${product.id}`}
            className="flex items-center gap-2 rounded-full border border-gold/40 bg-obsidian-900/90 px-4 py-2 text-xs font-semibold text-gold shadow-lg backdrop-blur-md transition-all duration-200 hover:border-gold hover:bg-gold hover:text-obsidian-950"
          >
            <Eye size={14} />
            Quick View
          </Link>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col justify-between bg-gradient-to-b from-obsidian-900/40 to-obsidian-900/95 p-4 md:p-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-gold-400/80">
            <span>{product.brand}</span>
            <span className="text-neutral-500">Extrait</span>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="block line-clamp-1 font-serif text-base font-medium text-ivory transition-colors duration-200 hover:text-gold md:text-lg"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="min-h-[18px]">
            {typeof product.avgRating === "number" &&
            product.reviewCount &&
            product.reviewCount > 0 ? (
              <div className="flex items-center gap-1.5">
                <StarRating
                  rating={product.avgRating}
                  count={product.reviewCount}
                />
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                <span className="text-gold">★</span>
                5.0 (Artisan Edition)
              </div>
            )}
          </div>
        </div>

        {/* Pricing & Add To Cart Button */}
        <div className="mt-4 flex flex-col gap-3 border-t border-neutral-800/80 pt-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-lg font-bold text-gold-200">
                {formatCurrency(currentPrice)}
              </span>

              {hasDiscount && (
                <span className="text-xs text-neutral-500 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
          </div>

          <AddToCartButton
            productId={product.id}
            productName={product.name}
            productPrice={currentPrice}
            productImage={image}
            outOfStock={product.stock === 0}
            full
          />
        </div>
      </div>
    </div>
  );
}

