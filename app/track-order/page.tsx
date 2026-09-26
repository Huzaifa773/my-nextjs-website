import { OrderTrackerClient } from "@/components/OrderTrackerClient";
import { Truck, Sparkles } from "lucide-react";

export const metadata = {
  title: "Live Order Tracking | Maison Charcoal",
  description: "Track the real-time shipping and delivery status of your luxury Maison Charcoal fragrance order.",
};

export default function TrackOrderPage() {
  return (
    <div className="bg-obsidian-950 text-ivory min-h-screen py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            <Truck size={14} />
            <span>VIP Consignment Tracking</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-ivory">
            Track Your <span className="gold-gradient-text">Fragrance Order</span>
          </h1>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Follow the passage of your handcrafted perfumes from our master atelier in Clifton to your
            doorstep with end-to-end GPS and carrier milestone updates.
          </p>
        </div>

        {/* Tracker Engine */}
        <OrderTrackerClient />
      </div>
    </div>
  );
}
