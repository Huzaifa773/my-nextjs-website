import { MapPin, Phone, Mail, Clock, MessageSquare, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { FaqAccordion } from "@/components/FaqAccordion";

export const metadata = {
  title: "VIP Concierge & Boutiques",
  description: "Connect with Maison Charcoal's private fragrance concierge and visit our flagship boutiques in Karachi, Lahore, and Islamabad.",
};

export default function ContactPage() {
  return (
    <div className="bg-obsidian-950 text-ivory min-h-screen">
      {/* Header Banner */}
      <section className="border-b border-neutral-800 bg-gradient-to-b from-obsidian-900 to-obsidian-950 py-20 px-4 md:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            <Sparkles size={14} />
            <span>Dedicated Patron Care</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-ivory">
            VIP Concierge & <span className="gold-gradient-text">Flagship Ateliers</span>
          </h1>
          <p className="text-sm md:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Whether seeking a personalized olfactory signature, corporate gifting curation, or private
            boutique tasting, our master advisors are at your disposal.
          </p>
        </div>
      </section>

      {/* Main Grid: Form + Boutiques */}
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Form: 7 cols */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Right Info & Boutiques: 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Direct WhatsApp Support Card */}
            <div className="glass-card p-6 border-gold/40 bg-gold/5 space-y-3">
              <div className="flex items-center gap-2 text-gold font-serif font-bold text-lg">
                <MessageSquare size={20} />
                <span>Immediate WhatsApp Concierge</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Connect directly with our master fragrance advisors for instant bottle recommendations,
                fragrance notes breakdown, and priority delivery updates.
              </p>
              <a
                href="https://wa.me/923000000000?text=Hello%20Maison%20Charcoal%20Concierge,%20I%20would%20like%20assistance%20with%20a%20fragrance."
                target="_blank"
                rel="noreferrer"
                className="btn-primary w-full py-3 text-xs uppercase tracking-wider font-bold inline-flex items-center justify-center gap-2"
              >
                Start WhatsApp Consultation &rarr;
              </a>
            </div>

            {/* Flagship Locations */}
            <div className="rounded-2xl border border-neutral-800 bg-obsidian-900/60 p-6 space-y-5">
              <h3 className="font-serif text-lg font-bold text-gold-300">Flagship Boutiques</h3>

              {/* Karachi */}
              <div className="border-b border-neutral-800/80 pb-4 space-y-1 text-xs">
                <p className="font-semibold text-ivory flex items-center gap-2">
                  <MapPin size={14} className="text-gold" /> Karachi &bull; Clifton Atelier
                </p>
                <p className="text-neutral-400 pl-5">Block 4, Marine Promenade, Clifton, Karachi</p>
                <p className="text-neutral-500 pl-5">Hours: Mon – Sun, 12:00 PM – 10:00 PM</p>
                <p className="text-gold pl-5 font-mono">+92 21 3587 0000</p>
              </div>

              {/* Lahore */}
              <div className="border-b border-neutral-800/80 pb-4 space-y-1 text-xs">
                <p className="font-semibold text-ivory flex items-center gap-2">
                  <MapPin size={14} className="text-gold" /> Lahore &bull; Gulberg Private Lounge
                </p>
                <p className="text-neutral-400 pl-5">MM Alam Road, Gulberg III, Lahore</p>
                <p className="text-neutral-500 pl-5">Hours: Mon – Sun, 1:00 PM – 11:00 PM</p>
                <p className="text-gold pl-5 font-mono">+92 42 3578 0000</p>
              </div>

              {/* Islamabad */}
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-ivory flex items-center gap-2">
                  <MapPin size={14} className="text-gold" /> Islamabad &bull; Beverly Centre Boutique
                </p>
                <p className="text-neutral-400 pl-5">Blue Area, Beverly Centre, Islamabad</p>
                <p className="text-neutral-500 pl-5">Hours: Tue – Sun, 12:00 PM – 9:30 PM</p>
                <p className="text-gold pl-5 font-mono">+92 51 2800 000</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section id="faq" className="mt-24 border-t border-neutral-800/80 pt-16">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">Answers to Inquiries</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <FaqAccordion />
          </div>
        </section>
      </div>
    </div>
  );
}
