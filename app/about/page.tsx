import Link from "next/link";
import Image from "next/image";
import { Sparkles, Award, ShieldCheck, Heart, ArrowRight } from "lucide-react";
import { LUXURY_IMAGES } from "@/lib/perfume-images";

export const metadata = {
  title: "Our Maison Story & Heritage",
  description: "Learn about the artisanal history, master noses, and noble ingredients behind Maison Charcoal Haute Parfumerie.",
};

export default function AboutPage() {
  return (
    <div className="bg-obsidian-950 text-ivory min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-neutral-800 bg-gradient-to-b from-obsidian-900 to-obsidian-950 py-24 px-4 md:px-8">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="relative mx-auto max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            <Sparkles size={14} />
            <span>Since 2018 &bull; Artisanal Excellence</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-ivory">
            The Philosophy of <span className="gold-gradient-text">Maison Charcoal</span>
          </h1>
          <p className="text-sm md:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Where ancestral Eastern distillation meets the avant-garde refinement of French haute perfumery.
            A commitment to scents that refuse to fade into the background.
          </p>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">Our Genesis</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ivory leading-tight">
              Born from a Reverence for Sacred Resins & Wild Blooms
            </h2>
            <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
              Maison Charcoal was founded with a singular conviction: fine fragrance should never be diluted
              for mass convenience. In an era dominated by synthetic bases and fleeting top-notes, we returned
              to the roots of perfumery — sourcing pure botanical extraits, ancient agarwood resins, and hand-plucked
              florals.
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Our name, <em>Charcoal</em>, pays tribute to the incandescent ember upon which sacred bakhoor
              and agarwood chips have been warmed for millennia throughout the Orient, releasing intoxicating
              trails of velvety smoke, honeyed resins, and leather.
            </p>
            <div className="pt-2">
              <Link href="/products" className="btn-primary text-xs uppercase tracking-wider font-bold">
                Experience the Creations &rarr;
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gold/30 shadow-2xl">
            <Image
              src={LUXURY_IMAGES.craftsmanship}
              alt="Maison Charcoal perfumery craft"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* The 4 Pillars of Haute Parfumerie */}
      <section className="bg-obsidian-900 border-y border-neutral-800 py-20 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">Our Uncompromising Standards</span>
            <h2 className="section-title">The Four Pillars of Our Craft</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-serif text-xl font-bold">
                01
              </div>
              <h3 className="font-serif text-lg font-bold text-ivory">Noble Raw Materials</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                We partner with generational harvesters in Grasse, Madagascar, and Southeast Asia to procure
                unadulterated extracts.
              </p>
            </div>

            <div className="glass-card p-6 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-serif text-xl font-bold">
                02
              </div>
              <h3 className="font-serif text-lg font-bold text-ivory">Slow Cold Maceration</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Every batch is allowed to rest undisturbed for a minimum of 180 days in temperature-controlled
                vessels before bottling.
              </p>
            </div>

            <div className="glass-card p-6 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-serif text-xl font-bold">
                03
              </div>
              <h3 className="font-serif text-lg font-bold text-ivory">Extrait Concentration</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                We formulate with up to 35% pure oil concentrate, ensuring unrivaled persistence and complex,
                evolving sillage.
              </p>
            </div>

            <div className="glass-card p-6 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-serif text-xl font-bold">
                04
              </div>
              <h3 className="font-serif text-lg font-bold text-ivory">Hand-Numbered Flacons</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Each bottle is capped in solid gold-finish zinc alloy, wrapped in custom silk-lined boxes, and
                sealed with bespoke wax.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Ethical Pledge */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-gold/30 p-8 md:p-14 text-center space-y-6">
          <Award className="h-12 w-12 text-gold mx-auto" />
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-ivory max-w-2xl mx-auto">
            Sustainable Agarwood Forestry & Ethical Harvesting
          </h2>
          <p className="text-sm text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Maison Charcoal is proudly committed to protecting vulnerable wild agarwood species. We sponsor
            the replanting of five Aquilaria saplings for every flacon of Oud Extrait crafted, safeguarding
            this ancient olfactory gift for future generations.
          </p>
          <div className="pt-2">
            <Link href="/collections" className="btn-secondary text-xs uppercase tracking-wider font-semibold">
              Explore Our Pure Oud Series
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
