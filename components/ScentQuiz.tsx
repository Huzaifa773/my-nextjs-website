"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, RotateCcw, Check, ShoppingBag } from "lucide-react";
import { alertSuccess, alertAddToCart } from "@/lib/alerts";
import { formatCurrency } from "@/lib/utils";

interface Question {
  id: number;
  title: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    categoryMatch: string;
    perfumeSlug: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "Who are you selecting this fragrance for?",
    subtitle: "We begin by establishing the desired aesthetic profile.",
    options: [
      { label: "For Him &bull; Masculine Presence", description: "Bold woods, leather, dark spices, and smoking resins", categoryMatch: "mens-perfumes", perfumeSlug: "noir-absolu" },
      { label: "For Her &bull; Feminine Radiance", description: "Velvet roses, golden iris, and intoxicating florals", categoryMatch: "womens-perfumes", perfumeSlug: "golden-iris" },
      { label: "Unisex & Modern Minimalist", description: "Crisp tea, clean bergamot, and timeless cedarwood", categoryMatch: "unisex-perfumes", perfumeSlug: "citrus-neutral" },
      { label: "A Rare Oriental Connoisseur", description: "100% alcohol-free pure oud and concentrated attar", categoryMatch: "oud", perfumeSlug: "velvet-oud-royale" },
    ],
  },
  {
    id: 2,
    title: "When will this fragrance command the room?",
    subtitle: "Select the primary atmosphere and setting.",
    options: [
      { label: "Grand Evenings & Black-Tie Galas", description: "Maximum projection that lingers long after you depart", categoryMatch: "oud", perfumeSlug: "velvet-oud-royale" },
      { label: "Everyday Executive Signature", description: "Polished, distinguished, and respected in close quarters", categoryMatch: "mens-perfumes", perfumeSlug: "noir-absolu" },
      { label: "Intimate Dinners & Romantic Evenings", description: "Warm vanilla, amber, and skin-melting musk", categoryMatch: "womens-perfumes", perfumeSlug: "rose-cashmere" },
      { label: "Warm Weather & Daily Refreshment", description: "Effortlessly clean, uplifting, and rejuvenating", categoryMatch: "unisex-perfumes", perfumeSlug: "citrus-neutral" },
    ],
  },
  {
    id: 3,
    title: "Which aromatic chords captivate your senses?",
    subtitle: "Choose the olfactory family closest to your spirit.",
    options: [
      { label: "Aged Oud, Incense & Smoky Resins", description: "Cambodian agarwood, frankincense, and burnt woods", categoryMatch: "oud", perfumeSlug: "velvet-oud-royale" },
      { label: "Champagne, Powdery Iris & Vanilla", description: "Soft gourmand elegance wrapped in golden silk", categoryMatch: "womens-perfumes", perfumeSlug: "golden-iris" },
      { label: "Tobacco Leaf, Dark Amber & Spice", description: "Deep and enigmatic with bourbon undertones", categoryMatch: "mens-perfumes", perfumeSlug: "noir-absolu" },
      { label: "Pure White Musk & Damask Rose", description: "Velvety, ethereal, and sacred botanical oils", categoryMatch: "attar", perfumeSlug: "musk-al-ameer-attar" },
    ],
  },
  {
    id: 4,
    title: "What level of sillage (scent trail) do you demand?",
    subtitle: "Fragrance strength and persistence.",
    options: [
      { label: "Beast Mode & Unapologetic", description: "Parfum Extrait with 18–24+ hours of commanding presence", categoryMatch: "oud", perfumeSlug: "velvet-oud-royale" },
      { label: "Radiant & Sophisticated", description: "Balanced projection that draws people closer gracefully", categoryMatch: "mens-perfumes", perfumeSlug: "noir-absolu" },
      { label: "Intimate & Sensual Aura", description: "Melt-into-skin attar oil that blooms with your body heat", categoryMatch: "attar", perfumeSlug: "musk-al-ameer-attar" },
      { label: "Clean & Effortless Drift", description: "Crisp and fresh with an uplifting wake throughout the day", categoryMatch: "unisex-perfumes", perfumeSlug: "citrus-neutral" },
    ],
  },
];

const RECOMMENDATIONS = {
  "velvet-oud-royale": {
    name: "Velvet Oud Royale",
    subtitle: "Parfum Extrait &bull; 50ml Flacon",
    description:
      "A majestic symphony of 25-year aged Cambodian agarwood, taif rose, and smoked saffron. Formulated at 35% pure oil concentration for the ultimate regal presence.",
    price: 29900,
    originalPrice: 34500,
    matchScore: 98,
    image: "https://images.unsplash.com/photo-1615368144592-0e5f56ec1a68?w=800&q=85",
    family: "Royal Oriental Oud",
    notes: ["Cambodian Oud", "Smoked Saffron", "Taif Rose", "Ambergris"],
    sku: "PF-OUDR-50",
  },
  "noir-absolu": {
    name: "Noir Absolu",
    subtitle: "Eau de Parfum &bull; 100ml Flacon",
    description:
      "A deep, smoky blend of dark spices, cured tobacco leaf, and rich golden amber. An intoxicating signature that commands admiration in every room.",
    price: 15900,
    originalPrice: 18500,
    matchScore: 96,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=85",
    family: "Woody Oriental",
    notes: ["Dark Amber", "Smoky Spices", "Tobacco Leaf", "Oud Wood"],
    sku: "PF-NOIR-100",
  },
  "golden-iris": {
    name: "Golden Iris",
    subtitle: "Eau de Parfum &bull; 50ml Flacon",
    description:
      "Powdery Florentine iris and sparkling champagne accord enveloped in creamy bourbon vanilla. Exudes delicate, breathtaking opulence.",
    price: 21000,
    originalPrice: 21000,
    matchScore: 95,
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&q=85",
    family: "Gourmand Floral",
    notes: ["Florentine Iris", "Champagne Accord", "Bourbon Vanilla", "White Musk"],
    sku: "PF-IRIS-50",
  },
  "citrus-neutral": {
    name: "Citrus Neutral",
    subtitle: "Eau de Toilette &bull; 100ml Flacon",
    description:
      "Calabrian bergamot infused with rare white tea and Haitian vetiver. Crisp, sophisticated, and revitalizing from morning until twilight.",
    price: 10900,
    originalPrice: 12500,
    matchScore: 94,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=85",
    family: "Fresh Citrus Aromatic",
    notes: ["Calabrian Bergamot", "White Tea", "Cedarwood", "Vetiver"],
    sku: "PF-CIT-100",
  },
};

export function ScentQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [result, setResult] = useState<any>(null);

  function handleSelectOption(option: any) {
    const updated = { ...answers, [currentStep]: option };
    setAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // Compute best match
      const lastSlug = option.perfumeSlug || "noir-absolu";
      const rec = (RECOMMENDATIONS as any)[lastSlug] || RECOMMENDATIONS["noir-absolu"];
      setResult(rec);
      alertSuccess(
        "Olfactory Profile Decoded",
        `We have identified your supreme match: <strong>${rec.name}</strong> (${rec.matchScore}% Match). Formulated for your exact preferences.`
      );
    }
  }

  function handleReset() {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  }

  return (
    <div className="max-w-4xl mx-auto">
      {!result ? (
        <div className="rounded-3xl border border-neutral-800 bg-obsidian-900/80 p-6 md:p-12 backdrop-blur-xl shadow-2xl">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span className="font-semibold uppercase tracking-wider text-gold">
                Step {currentStep + 1} of {QUESTIONS.length}
              </span>
              <span>{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}% Completed</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-obsidian-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold to-gold-300 transition-all duration-500 shadow-gold-glow"
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Question */}
          <div className="space-y-3 mb-8 text-center md:text-left">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-ivory">
              {QUESTIONS[currentStep].title}
            </h2>
            <p className="text-xs md:text-sm text-neutral-400">
              {QUESTIONS[currentStep].subtitle}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {QUESTIONS[currentStep].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectOption(opt)}
                className="group flex flex-col justify-between p-5 rounded-2xl border border-neutral-800 bg-obsidian-800/60 text-left transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:shadow-gold-card hover:-translate-y-1"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base font-bold text-ivory group-hover:text-gold transition-colors">
                      {opt.label}
                    </span>
                    <span className="h-6 w-6 rounded-full border border-neutral-700 flex items-center justify-center text-xs text-neutral-500 group-hover:border-gold group-hover:text-gold transition-colors">
                      →
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {currentStep > 0 && (
            <div className="mt-8 pt-4 border-t border-neutral-800 flex justify-between items-center text-xs">
              <button
                onClick={() => setCurrentStep((s) => s - 1)}
                className="text-neutral-400 hover:text-gold transition-colors"
              >
                ← Previous Question
              </button>
              <button
                onClick={handleReset}
                className="text-neutral-500 hover:text-red-400 transition-colors"
              >
                Restart Quiz
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Result Revealed */
        <div className="rounded-3xl border border-gold/40 bg-obsidian-900/90 p-6 md:p-12 backdrop-blur-xl shadow-2xl animate-fadeIn space-y-8">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/15 px-4 py-1 text-xs font-bold text-gold uppercase tracking-widest shadow-gold-glow">
              <Sparkles size={13} /> {result.matchScore}% Perfect Olfactory Match
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-ivory">
              Your Signature: <span className="gold-gradient-text">{result.name}</span>
            </h2>
            <p className="text-xs md:text-sm text-neutral-400">{result.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4">
            <div className="md:col-span-5 relative aspect-square rounded-2xl overflow-hidden border border-gold/30 shadow-2xl bg-obsidian-950">
              <Image
                src={result.image}
                alt={result.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/70 via-transparent to-transparent" />
            </div>

            <div className="md:col-span-7 space-y-5">
              <p className="text-sm text-neutral-300 leading-relaxed">
                {result.description}
              </p>

              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gold">
                  Dominant Accord Breakdown:
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.notes.map((n: string) => (
                    <span
                      key={n}
                      className="rounded-full bg-obsidian-800 border border-gold/30 px-3 py-1 text-xs text-gold-300"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="font-serif text-3xl font-bold text-gold-200">
                  {formatCurrency(result.price)}
                </span>
                {result.originalPrice > result.price && (
                  <span className="text-sm text-neutral-500 line-through">
                    {formatCurrency(result.originalPrice)}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-3">
                <Link
                  href="/products"
                  className="btn-primary flex-1 text-xs uppercase tracking-widest font-bold py-3.5 shadow-gold-glow flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} /> Explore In Catalog
                </Link>
                <button
                  onClick={handleReset}
                  className="btn-secondary px-5 py-3.5 text-xs uppercase tracking-wider font-semibold flex items-center gap-2"
                >
                  <RotateCcw size={14} /> Retake Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
