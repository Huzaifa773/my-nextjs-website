import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { ReviewForm } from "@/components/ReviewForm";
import { StarRating } from "@/components/StarRating";
import { ProductCard, ProductCardData } from "@/components/ProductCard";
import { Sparkles, ShieldCheck, Truck, RefreshCw, ChevronRight } from "lucide-react";

const FRAGRANCE_LABELS: Record<string, string> = {
  EAU_DE_PARFUM: "Eau de Parfum (20% Concentration)",
  EAU_DE_TOILETTE: "Eau de Toilette (12% Concentration)",
  EAU_DE_COLOGNE: "Eau de Cologne (5% Concentration)",
  PARFUM_EXTRAIT: "Parfum Extrait (35% Pure Oil)",
  ATTAR: "Alcohol-Free Concentrated Perfume Oil",
  BODY_MIST: "Artisan Body Mist",
};

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
      reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!product || !product.isActive) notFound();

  let isWishlisted = false;
  if (session?.user) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.user.id },
      include: { items: { where: { productId: product.id } } },
    });
    isWishlisted = (wishlist?.items.length || 0) > 0;
  }

  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 5;

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, isActive: true, id: { not: product.id } },
    take: 4,
    include: { images: { orderBy: { position: "asc" }, take: 1 }, reviews: { select: { rating: true } } },
  });

  const relatedCards: ProductCardData[] = related.map((p) => {
    const ratings = p.reviews;
    return {
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: Number(p.price),
      discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
      stock: p.stock,
      images: p.images,
      avgRating: ratings.length ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length : 5,
      reviewCount: ratings.length || 1,
    };
  });

  const hasDiscount = product.discountPrice != null && Number(product.discountPrice) < Number(product.price);
  const currentPrice = hasDiscount ? Number(product.discountPrice) : Number(product.price);
  const mainImage = product.images[0]?.url || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=85";

  return (
    <div className="bg-obsidian-950 text-ivory min-h-screen py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-gold transition-colors">Catalog</Link>
          <ChevronRight size={12} />
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-gold transition-colors">
            {product.category.name}
          </Link>
          <ChevronRight size={12} />
          <span className="text-gold font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Hero Grid */}
        <div className="grid gap-12 lg:grid-cols-2 items-start">
          {/* Gallery */}
          <ProductGallery images={product.images} name={product.name} />

          {/* Product Dossier */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
                  {product.brand} &bull; {product.category.name}
                </span>
                <span className="text-[11px] text-neutral-500 font-mono">SKU: {product.sku}</span>
              </div>

              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-ivory">
                {product.name}
              </h1>

              {/* Star Rating */}
              <div className="flex items-center gap-3 pt-1">
                <StarRating rating={avgRating} count={product.reviews.length || 1} />
                <span className="text-xs text-neutral-400">
                  ({product.reviews.length} verified reviews)
                </span>
              </div>
            </div>

            {/* Price Badge */}
            <div className="flex items-baseline gap-4 p-4 rounded-xl bg-obsidian-900/90 border border-neutral-800">
              <span className="font-serif text-3xl font-bold text-gold-200">
                {formatCurrency(currentPrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-neutral-500 line-through">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="rounded-full bg-gold/15 border border-gold/40 px-3 py-0.5 text-xs font-bold text-gold">
                    Save {formatCurrency(Number(product.price) - currentPrice)}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-neutral-300">
              {product.description}
            </p>

            {/* Olfactory Pyramid & Specifications */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-obsidian-900 border border-neutral-800">
                <p className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">Concentration</p>
                <p className="font-medium text-ivory mt-0.5">{FRAGRANCE_LABELS[product.fragranceType] || product.fragranceType}</p>
              </div>
              <div className="p-3 rounded-xl bg-obsidian-900 border border-neutral-800">
                <p className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">Bottle Volume</p>
                <p className="font-medium text-ivory mt-0.5">{product.size} (Flacon de Luxe)</p>
              </div>
              <div className="p-3 rounded-xl bg-obsidian-900 border border-neutral-800">
                <p className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">Projection & Sillage</p>
                <p className="font-medium text-gold mt-0.5">Radiant & Intimate (12–18 Hours)</p>
              </div>
              <div className="p-3 rounded-xl bg-obsidian-900 border border-neutral-800">
                <p className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">Best Suited For</p>
                <p className="font-medium text-ivory mt-0.5">Evening Galas & Signature Everyday</p>
              </div>
            </div>

            {/* Purchase Panel with SweetAlert2 */}
            <ProductPurchasePanel
              productId={product.id}
              productName={product.name}
              productPrice={currentPrice}
              productImage={mainImage}
              stock={product.stock}
              isWishlisted={isWishlisted}
            />

            {/* Assurance Strip */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-[11px] text-neutral-400">
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-obsidian-900/50 border border-neutral-800/80">
                <Truck size={16} className="text-gold" />
                <span>Express Courier</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-obsidian-900/50 border border-neutral-800/80">
                <ShieldCheck size={16} className="text-gold" />
                <span>100% Original</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-obsidian-900/50 border border-neutral-800/80">
                <Sparkles size={16} className="text-gold" />
                <span>2 Free Decants</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="mt-24 border-t border-neutral-800/80 pt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
                Patron Impressions
              </span>
              <h2 className="section-title mt-1">Reviews & Ratings</h2>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7 space-y-4">
              {product.reviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-800 bg-obsidian-900/40 p-8 text-center">
                  <p className="text-gold-300 font-serif">Be the First to Experience</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    No reviews have been posted for this creation yet. Leave your feedback below.
                  </p>
                </div>
              ) : (
                product.reviews.map((r) => (
                  <div key={r.id} className="rounded-xl border border-neutral-800 bg-obsidian-900/60 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-ivory">{r.user.name}</p>
                        <p className="text-[10px] text-gold uppercase tracking-wider">Verified Buyer</p>
                      </div>
                      <StarRating rating={r.rating} />
                    </div>
                    {r.comment && <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">"{r.comment}"</p>}
                    <p className="text-[10px] text-neutral-500">
                      {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="lg:col-span-5">
              <ReviewForm productId={product.id} />
            </div>
          </div>
        </section>

        {/* Related Fragrances */}
        {relatedCards.length > 0 && (
          <section className="mt-24 border-t border-neutral-800/80 pt-16">
            <div className="mb-10">
              <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">Complementary Aromas</span>
              <h2 className="section-title mt-1">You May Also Admire</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {relatedCards.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
