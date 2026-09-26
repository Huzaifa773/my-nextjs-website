import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";
import { LUXURY_IMAGES } from "@/lib/perfume-images";

export const metadata = {
  title: "Exclusive Fragrance Collections",
  description: "Explore the signature curations of Maison Charcoal: Royal Oud, Midnight Amber, and Grasse Rose Extraits.",
};

const COLLECTIONS = [
  {
    title: "The Royal Oud Quintessence",
    subtitle: "Ancient Agarwood Distillations",
    description:
      "Crafted from 25-year aged wild Cambodian and Assamese agarwood heartwood. Deep, balsamic, and layered with regal smokiness that projects with magnetic authority.",
    image: LUXURY_IMAGES.categories["oud"],
    slug: "oud",
    badge: "Private Reserve",
    notes: ["Cambodian Oud", "Smoked Saffron", "Taif Rose", "Ambergris"],
  },
  {
    title: "Midnight Amber & Dark Spice",
    subtitle: "Evening Haute Parfumerie for Men",
    description:
      "A nocturnal harmony of cured Cuban tobacco leaves, Madagascar vanilla pods, roasted coffee beans, and molten dark amber. Designed for black-tie soirees and cold winter evenings.",
    image: LUXURY_IMAGES.categories["mens-perfumes"],
    slug: "mens-perfumes",
    badge: "Connoisseur Choice",
    notes: ["Rich Amber", "Tobacco Leaf", "Dark Spices", "Tonka Bean"],
  },
  {
    title: "Imperial Florals & Grasse Petals",
    subtitle: "Haute Parfumerie for Women",
    description:
      "Centifolia roses gathered at dawn in Grasse, blended with night-blooming jasmine sambac and delicate powdery Florentine iris. Soft, intoxicating, and effortlessly feminine.",
    image: LUXURY_IMAGES.categories["womens-perfumes"],
    slug: "womens-perfumes",
    badge: "Atelier Signature",
    notes: ["May Rose", "Iris Pallida", "Jasmine Sambac", "Cashmere Musk"],
  },
  {
    title: "Pure Concentrated Attar Oils",
    subtitle: "Traditional 100% Alcohol-Free Ittar",
    description:
      "Formulated according to centuries-old hydro-distillation traditions in Kannauj and Arabia. Zero alcohol, 100% pure macerated botanical and musk oils that melt into warm pulse points.",
    image: LUXURY_IMAGES.categories["attar"],
    slug: "attar",
    badge: "Heritage Edition",
    notes: ["White Musk", "Dehn Al Oud", "Saffron Threads", "Sandalwood"],
  },
  {
    title: "Prestige Coffret & Gift Sets",
    subtitle: "Bespoke Presentation Boxes",
    description:
      "Handcrafted velvet gift boxes lined with ivory satin and stamped with the golden Maison Charcoal seal. Includes full-size extraits accompanied by travel atomizers and discovery vials.",
    image: LUXURY_IMAGES.categories["gift-sets"],
    slug: "gift-sets",
    badge: "Gift de Luxe",
    notes: ["Dual Flacons", "Travel Atomizer", "Velvet Box", "Personal Inscription"],
  },
  {
    title: "Les Éléments Unisex Eau de Toilette",
    subtitle: "Minimalist Fresh Sophistication",
    description:
      "Crisp Calabrian bergamot, fresh ginger rhizome, and Mediterranean cedarwood. Effortless, invigorating fragrances designed to be worn without boundaries by women and men alike.",
    image: LUXURY_IMAGES.categories["unisex-perfumes"],
    slug: "unisex-perfumes",
    badge: "Modern Classic",
    notes: ["Calabrian Bergamot", "White Tea", "Vetiver", "Cedarwood"],
  },
];

export default function CollectionsPage() {
  return (
    <div className="bg-obsidian-950 text-ivory min-h-screen py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            <Sparkles size={14} />
            <span>Thematic Olfactory Chapters</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-ivory">
            Exclusive <span className="gold-gradient-text">Curations</span>
          </h1>
          <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
            Each collection represents a distinct chapter in the art of scent — curated by raw material,
            mood, and concentration for discerning collectors.
          </p>
        </div>

        {/* Collections Stack */}
        <div className="space-y-16">
          {COLLECTIONS.map((col, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={col.slug}
                className="rounded-3xl border border-neutral-800 bg-obsidian-900/60 p-6 md:p-10 backdrop-blur-md transition-all duration-500 hover:border-gold/40"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Photo Column */}
                  <div className={`lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden border border-gold/30 ${isEven ? "" : "lg:order-2"}`}>
                    <Image
                      src={col.image}
                      alt={col.title}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/70 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-4 left-4 rounded-full bg-gold/20 border border-gold/50 backdrop-blur-md px-3 py-1 text-xs font-bold text-gold uppercase tracking-wider">
                      {col.badge}
                    </span>
                  </div>

                  {/* Info Column */}
                  <div className={`lg:col-span-6 space-y-5 ${isEven ? "" : "lg:order-1"}`}>
                    <div>
                      <span className="text-xs uppercase tracking-widest text-gold font-semibold">
                        {col.subtitle}
                      </span>
                      <h2 className="font-serif text-2xl md:text-4xl font-bold text-ivory mt-1">
                        {col.title}
                      </h2>
                    </div>

                    <p className="text-sm leading-relaxed text-neutral-300">
                      {col.description}
                    </p>

                    {/* Dominant Notes Pills */}
                    <div className="space-y-2">
                      <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                        Dominant Olfactory Chords:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {col.notes.map((note) => (
                          <span
                            key={note}
                            className="rounded-full bg-obsidian-800 border border-neutral-700 px-3 py-1 text-xs text-gold-300 font-medium"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3">
                      <Link
                        href={`/products?category=${col.slug}`}
                        className="btn-primary inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold shadow-gold-glow"
                      >
                        <span>Shop {col.title}</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
