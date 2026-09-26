import Link from "next/link";
import Image from "next/image";
import { Sparkles, Compass, ShieldCheck, Award } from "lucide-react";
import { LUXURY_IMAGES } from "@/lib/perfume-images";

export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-obsidian-950 text-ivory">
      {/* Background Photography with Luxury Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={LUXURY_IMAGES.hero}
          alt="Luxury Maison Charcoal Fragrance Collection"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30 mix-blend-luminosity scale-105 animate-pulse"
          style={{ animationDuration: "10s" }}
        />
        {/* Cinematic Vignette & Gold Radial Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 via-obsidian-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-obsidian-950/70" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="max-w-3xl space-y-6">
          {/* VIP Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold backdrop-blur-md shadow-gold-glow">
            <Sparkles size={14} className="text-gold animate-spin" style={{ animationDuration: "8s" }} />
            <span>Haute Parfumerie &bull; Royal Heritage</span>
          </div>

          {/* Majestic Headline */}
          <h1 className="font-serif text-4xl leading-[1.15] md:text-6xl lg:text-7xl font-bold tracking-tight text-ivory">
            The Scent of Pure <br />
            <span className="gold-gradient-text">Opulence & Distinction</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl text-base md:text-lg leading-relaxed text-neutral-300">
            Hand-distilled Cambodian oud, rare Grasse florals, and pure attars — crafted for
            connoisseurs who command attention without saying a word.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/products"
              className="btn-primary px-8 py-3.5 text-sm uppercase tracking-wider font-bold shadow-gold-glow-lg"
            >
              Explore Collection
            </Link>
            <Link
              href="/quiz"
              className="btn-secondary px-6 py-3.5 text-sm uppercase tracking-wider font-semibold"
            >
              <Compass size={17} /> Scent Finder Quiz
            </Link>
          </div>

          {/* Luxury Value Pillars */}
          <div className="pt-8 border-t border-neutral-800/80 grid grid-cols-2 md:grid-cols-3 gap-6 text-neutral-300 text-xs">
            <div className="flex items-center gap-2.5">
              <Award size={18} className="text-gold flex-shrink-0" />
              <div>
                <p className="font-semibold text-ivory">Extrait Concentration</p>
                <p className="text-[11px] text-neutral-400">Up to 24-hour sillage</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-gold flex-shrink-0" />
              <div>
                <p className="font-semibold text-ivory">100% Authentic Oils</p>
                <p className="text-[11px] text-neutral-400">Direct from Grasse & Orient</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2.5">
              <Sparkles size={18} className="text-gold flex-shrink-0" />
              <div>
                <p className="font-semibold text-ivory">VIP Gift Packaging</p>
                <p className="text-[11px] text-neutral-400">Velvet box & wax seal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
