export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/Hero";
import { ProductCard, ProductCardData } from "@/components/ProductCard";
import { StarRating } from "@/components/StarRating";
import { NewsletterSection } from "@/components/NewsletterSection";
import { LUXURY_IMAGES } from "@/lib/perfume-images";
import { Sparkles, ArrowRight, ShieldCheck, Clock, Award, Compass } from "lucide-react";

async function getWishlistedIds(userId?: string) {
  if (!userId) return new Set<string>();
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: { items: { select: { productId: true } } },
  });
  return new Set(wishlist?.items.map((i) => i.productId) || []);
}

function toCardData(p: any, wishlisted: Set<string>): ProductCardData {
  const ratings = p.reviews as { rating: number }[];
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
}

const CATEGORY_IMAGES: Record<string, string> = LUXURY_IMAGES.categories;

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const wishlisted = await getWishlistedIds(session?.user?.id);

  const productSelect = {
    id: true,
    name: true,
    brand: true,
    price: true,
    discountPrice: true,
    stock: true,
    images: { orderBy: { position: "asc" as const }, take: 1 },
    reviews: { select: { rating: true } },
  };

  const [featured, bestSellers, newArrivals, categories] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true, isFeatured: true }, select: productSelect, take: 8 }),
    prisma.product.findMany({ where: { isActive: true, isBestSeller: true }, select: productSelect, take: 4 }),
    prisma.product.findMany({ where: { isActive: true, isNewArrival: true }, select: productSelect, take: 4 }),
    prisma.category.findMany({ where: { isActive: true }, take: 6 }),
  ]);

  const topReviews = await prisma.review.findMany({
    take: 3,
    orderBy: { rating: "desc" },
    include: { user: { select: { name: true } }, product: { select: { name: true } } },
  });

  return (
    <div className="bg-obsidian-950 text-ivory">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Fragrance Pyramid Architecture Banner */}
      <section className="border-y border-neutral-800/80 bg-obsidian-900/60 py-12 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Haute Composition</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold mt-1 text-ivory">
              The Three Stages of Olfactory Evolution
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center space-y-3 relative group">
              <div className="h-10 w-10 mx-auto rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold font-serif font-bold">
                I
              </div>
              <h3 className="font-serif text-lg font-semibold text-gold-300">Top Notes &bull; The Prelude</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Calabrian Bergamot, Pink Peppercorn, and Bitter Orange that awaken the senses for the first 15â€“30 minutes.
              </p>
              <div className="text-[11px] text-gold/80 font-medium tracking-wider uppercase pt-1">
                Immediate Impression
              </div>
            </div>

            <div className="glass-card p-6 text-center space-y-3 relative group border-gold/40 bg-gold/5">
              <div className="h-10 w-10 mx-auto rounded-full bg-gold text-obsidian-950 font-serif font-bold flex items-center justify-center shadow-gold-glow">
                II
              </div>
              <h3 className="font-serif text-lg font-semibold text-gold-200">Heart Notes &bull; The Soul</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Damascus Rose petals, French Lavender, and Royal Jasmine revealing the true character for 4â€“6 hours.
              </p>
              <div className="text-[11px] text-gold font-medium tracking-wider uppercase pt-1">
                The Core Signature
              </div>
            </div>

            <div className="glass-card p-6 text-center space-y-3 relative group">
              <div className="h-10 w-10 mx-auto rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold font-serif font-bold">
                III
              </div>
              <h3 className="font-serif text-lg font-semibold text-gold-300">Base Notes &bull; The Memory</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Aged Cambodian Oud, Ambergris, and Mysore Sandalwood lingering on skin and fabric for up to 24 hours.
              </p>
              <div className="text-[11px] text-gold/80 font-medium tracking-wider uppercase pt-1">
                Enduring Legacy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop by Category */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold font-semibold">
              <Sparkles size={14} /> Curated Olfactory Worlds
            </div>
            <h2 className="section-title mt-1">Shop by Category</h2>
          </div>
          <Link
            href="/collections"
            className="group mt-4 md:mt-0 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold-light"
          >
            <span>Explore All Curations</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="card-luxury group relative aspect-[4/5] overflow-hidden rounded-xl"
            >
              <Image
                src={
                  CATEGORY_IMAGES[c.slug] ||
                  "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80"
                }
                alt={c.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent p-5 flex flex-col justify-end">
                <span className="text-[11px] uppercase tracking-widest text-gold font-semibold">Collection</span>
                <h3 className="font-serif text-lg md:text-xl font-bold text-ivory group-hover:text-gold transition-colors">
                  {c.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {c.description || "Discover handcrafted luxury"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Fragrances */}
      {featured.length > 0 && (
        <section className="bg-obsidian-900/60 py-20 border-t border-neutral-800/80">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
                  Handcrafted Masterpieces
                </span>
                <h2 className="section-title mt-1">Featured Fragrances</h2>
              </div>
              <Link
                href="/products"
                className="group mt-4 md:mt-0 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold-light"
              >
                <span>View All Fragrances</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featured.map((p) => (
                <ProductCard key={p.id} product={toCardData(p, wishlisted)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Interactive Scent Quiz Promo Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-950 py-16 px-4 md:px-8 border-y border-gold/30">
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-80 h-80 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold">
              <Compass size={13} />
              <span>Personalized Concierge</span>
            </div>
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-ivory">
              Not Sure What Suits You? <br />
              <span className="gold-gradient-text">Discover Your Signature Scent</span>
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Answer 5 quick questions about your personality, favorite moments, and preferred
              intensity. Our master algorithm matches you with your ultimate fragrance.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href="/quiz"
              className="btn-primary px-8 py-4 text-xs uppercase tracking-widest font-bold shadow-gold-glow-lg flex items-center gap-2"
            >
              <Sparkles size={16} /> Take The Scent Quiz
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
                Most Desired
              </span>
              <h2 className="section-title mt-1">Connoisseur Best Sellers</h2>
            </div>
            <Link
              href="/products"
              className="group mt-4 md:mt-0 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold-light"
            >
              <span>Explore All</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={toCardData(p, wishlisted)} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Artisanal Heritage / Editorial Section */}
      <section className="bg-obsidian-900 border-y border-neutral-800 py-20 px-4 md:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gold/30 shadow-2xl">
            <Image
              src={LUXURY_IMAGES.atelier}
              alt="Maison Charcoal Perfumery Atelier"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-obsidian-900/80 backdrop-blur-md border border-gold/30">
              <p className="font-serif text-base text-gold-300">"A fragrance is the most intense form of memory."</p>
              <p className="text-xs text-neutral-400 mt-1">â€” Master Perfumer, Maison Charcoal</p>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
              Art of Haute Parfumerie
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ivory leading-tight">
              Distilled with Reverence. Bottled for Eternity.
            </h2>
            <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
              Every creation at Maison Charcoal begins in Grasse and the ancient agarwood forests of
              Assam and Cambodia. We employ cold-maceration techniques that preserve the delicate
              terpenes and aromatic resins for over 6 months before bottling.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="border-l-2 border-gold pl-4 space-y-1">
                <p className="text-2xl font-serif font-bold text-gold">100%</p>
                <p className="text-xs text-neutral-400">Pure, uncut fragrance oils & alcohol-free attars</p>
              </div>
              <div className="border-l-2 border-gold pl-4 space-y-1">
                <p className="text-2xl font-serif font-bold text-gold">24 Hours</p>
                <p className="text-xs text-neutral-400">Tested projection & enduring dry-down</p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/about" className="btn-secondary text-xs uppercase tracking-wider font-semibold">
                Read Our Full Heritage Story &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Verified Patron Reviews */}
      {topReviews.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">Testimonials</span>
            <h2 className="section-title">Words from Our Patrons</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topReviews.map((r) => (
              <div key={r.id} className="glass-card p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <StarRating rating={r.rating} />
                  <p className="text-sm text-neutral-300 italic leading-relaxed">"{r.comment}"</p>
                </div>
                <div className="pt-4 border-t border-neutral-800">
                  <p className="text-xs font-semibold text-gold-300">{r.user.name}</p>
                  <p className="text-[11px] text-neutral-500">Verified Buyer &bull; {r.product.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. VIP Newsletter Section with SweetAlert */}
      <NewsletterSection />
    </div>
  );
}

