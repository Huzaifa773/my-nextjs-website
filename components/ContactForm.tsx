"use client";

import { useState } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";
import { alertSuccess, alertToast } from "@/lib/alerts";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Personal Olfactory Consultation",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  function update(field: string, val: string) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alertToast("Please fill in your name, email, and message", "info");
      return;
    }

    setLoading(true);
    // Simulate concierge dispatch
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);

    await alertSuccess(
      "Concierge Request Received",
      `Thank you, <strong>${form.name}</strong>. Our senior fragrance specialist will contact you via email or phone within 4 business hours to assist you.`
    );

    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "Personal Olfactory Consultation",
      message: "",
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-gold/30 bg-obsidian-900/80 p-6 md:p-8 backdrop-blur-md">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold font-semibold mb-2">
        <Sparkles size={14} /> Send a Message to the Atelier
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Your Full Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Tariq Mansoor"
            className="input-field rounded-xl"
          />
        </div>

        <div>
          <label className="text-xs text-neutral-400 block mb-1">Email Address *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="e.g. tariq@domain.com"
            className="input-field rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Phone / WhatsApp (Optional)</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+92 300 1234567"
            className="input-field rounded-xl"
          />
        </div>

        <div>
          <label className="text-xs text-neutral-400 block mb-1">Reason for Inquiry</label>
          <select
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            className="select-field rounded-xl"
          >
            <option value="Personal Olfactory Consultation">Bespoke Scent Consultation</option>
            <option value="Wedding & Corporate Gifting">Wedding & Corporate Gifting</option>
            <option value="Order Status & Delivery Inquiry">Order Status & Delivery Inquiry</option>
            <option value="Boutique Appointment Booking">Boutique Appointment Booking</option>
            <option value="Wholesale & Bulk Orders">Wholesale & Private Label</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-neutral-400 block mb-1">How may our Concierge assist you? *</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Share your inquiry, preferences, or request for samples..."
          className="input-field rounded-xl"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3.5 text-xs uppercase tracking-widest font-bold shadow-gold-glow"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        Dispatch Inquiry to Concierge
      </button>
    </form>
  );
}
