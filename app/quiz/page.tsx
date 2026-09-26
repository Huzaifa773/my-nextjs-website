import { ScentQuiz } from "@/components/ScentQuiz";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Scent Finder Quiz | Personal Olfactory Consultation",
  description: "Take the 60-second Maison Charcoal fragrance quiz to discover your bespoke signature perfume or oud.",
};

export default function QuizPage() {
  return (
    <div className="bg-obsidian-950 text-ivory min-h-screen py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            <Sparkles size={14} />
            <span>AI Olfactory Sommelier</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-ivory">
            Find Your <span className="gold-gradient-text">Signature Scent</span>
          </h1>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Allow our master nose questionnaire to analyze your preferred atmosphere, projection intensity,
            and aromatic accords to reveal the creation crafted for you.
          </p>
        </div>

        {/* Interactive Quiz Engine */}
        <ScentQuiz />
      </div>
    </div>
  );
}
