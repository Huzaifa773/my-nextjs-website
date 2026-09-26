"use client";

import { useState } from "react";
import { Mail, Sparkles, CheckCircle2 } from "lucide-react";
import { alertSuccess, alertToast } from "@/lib/alerts";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      alertToast("Please enter a valid email address", "error");
      return;
    }

    setSubscribed(true);
    await alertSuccess(
      "Welcome to the VIP Circle",
      `Thank you for joining Maison Charcoal Privé. Use code <strong>VIP15</strong> at checkout for 15% off your first order. A confirmation has been sent to ${email}.`
    );
    setEmail("");
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-obsidian-900 to-obsidian-950 py-20 px-4 md:px-8 border-y border-gold/20">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      
      <div className="relative mx-auto max-w-3xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          <Sparkles size={13} />
          <span>Exclusive Privileges</span>
        </div>

        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-ivory font-bold">
          Join the <span className="gold-gradient-text">Maison Privé Club</span>
        </h2>

        <p className="text-sm md:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
          Receive private invitations to limited batch releases, private perfumer notes, and a
          complimentary 15% privilege code on your debut order.
        </p>

        <form onSubmit={handleSubscribe} className="mx-auto flex max-w-md flex-col sm:flex-row gap-2 pt-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
            required
            className="input-field rounded-full bg-obsidian-800/90 border-gold/40 text-ivory placeholder:text-neutral-500 flex-1 px-5 text-sm"
          />
          <button
            type="submit"
            className="btn-primary rounded-full px-7 py-3 text-xs uppercase tracking-wider font-bold whitespace-nowrap"
          >
            Claim 15% Off
          </button>
        </form>

        <p className="text-[11px] text-neutral-500">
          We respect your privacy. Unsubscribe at any time with a single click.
        </p>
      </div>
    </section>
  );
}
