"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "How long do Maison Charcoal extraits typically last on skin?",
    a: "Because we formulate at Parfum Extrait (up to 35% pure concentrate) and traditional alcohol-free attar oils, our fragrances typically project for 6 to 8 hours and remain clearly perceptible as a personal scent aura on fabric and pulse points for 18 to 24+ hours.",
  },
  {
    q: "Are discovery samples included with my purchase?",
    a: "Yes! Every single bottle order comes with two complimentary 2ml glass spray vials of our latest limited batch creations, allowing you to test other olfactory profiles risk-free.",
  },
  {
    q: "What payment methods are supported across Pakistan?",
    a: "We accept Cash on Delivery (COD) across 200+ cities in Pakistan, as well as Direct Bank Transfer (Meezan, HBL, Alfalah), JazzCash, Easypaisa, and Safepay online card payments.",
  },
  {
    q: "What is your return & exchange privilege?",
    a: "If your fragrance is unopened with intact cellophane and security wax seal, you may exchange it or request a return within 7 calendar days of receipt. Our customer concierge handles courier pickups.",
  },
  {
    q: "Can I book a private boutique olfactory session?",
    a: "Certainly. Our ateliers in Clifton (Karachi) and Gulberg (Lahore) offer 45-minute private fragrance tasting sessions by appointment. Simply select 'Boutique Appointment Booking' in the contact form.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="rounded-xl border border-neutral-800 bg-obsidian-900/60 overflow-hidden transition-colors"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between p-4 md:p-5 text-left text-sm font-semibold text-ivory hover:text-gold transition-colors"
            >
              <span>{faq.q}</span>
              <ChevronDown
                size={18}
                className={`text-gold flex-shrink-0 ml-4 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-5 md:px-5 text-xs text-neutral-300 leading-relaxed border-t border-neutral-800/80 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
