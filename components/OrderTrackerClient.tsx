"use client";

import { useState } from "react";
import { Search, Truck, CheckCircle2, Clock, PackageCheck, MapPin, Loader2, Sparkles } from "lucide-react";
import { alertToast, alertError } from "@/lib/alerts";
import { formatCurrency } from "@/lib/utils";

interface TrackedOrder {
  orderNumber: string;
  customerName: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  createdAt: string;
  estimatedDelivery: string;
  courier: string;
  trackingNumber: string;
  destinationCity: string;
  steps: { label: string; date: string; done: boolean; current?: boolean }[];
}

export function OrderTrackerClient() {
  const [orderQuery, setOrderQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<TrackedOrder | null>(null);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!orderQuery.trim()) {
      alertToast("Please enter an Order Number", "info");
      return;
    }

    setLoading(true);
    // Simulate real-time carrier lookup & database check
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);

    const clean = orderQuery.trim().toUpperCase();

    // Generate responsive tracking data based on query
    setOrderData({
      orderNumber: clean.startsWith("ORD-") ? clean : `ORD-20260924-${clean.slice(0, 4)}`,
      customerName: "Valued Patron",
      orderStatus: "SHIPPED",
      paymentStatus: "CONFIRMED",
      paymentMethod: "Cash on Delivery",
      total: 18500,
      createdAt: "September 23, 2026",
      estimatedDelivery: "September 26, 2026 (Before 6:00 PM)",
      courier: "TCS Express &bull; VIP Insured Priority",
      trackingNumber: `TCS-${Math.floor(10000000 + Math.random() * 90000000)}`,
      destinationCity: "Karachi, Pakistan",
      steps: [
        { label: "Order Placed & Confirmed", date: "Sep 23 &bull; 02:15 PM", done: true },
        { label: "Hand-Blended & Wax Sealed", date: "Sep 23 &bull; 05:40 PM", done: true },
        { label: "Dispatched from Clifton Atelier", date: "Sep 24 &bull; 10:00 AM", done: true },
        { label: "In Transit with Courier Hub", date: "Sep 24 &bull; 04:30 PM", done: true, current: true },
        { label: "Out for Delivery to Residence", date: "Estimated Sep 26", done: false },
        { label: "Delivered to Patron", date: "Pending", done: false },
      ],
    });

    alertToast("Tracking dossier retrieved successfully", "success");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Search Bar Box */}
      <form
        onSubmit={handleTrack}
        className="rounded-2xl border border-gold/30 bg-obsidian-900/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-4"
      >
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold font-semibold">
          <Truck size={15} /> Enter Order Identifier
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            placeholder="e.g. ORD-20260923-0001 or Phone number"
            className="input-field rounded-xl flex-1 text-sm font-mono uppercase"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary rounded-xl px-8 py-3 text-xs uppercase tracking-widest font-bold shadow-gold-glow flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Track Parcel
          </button>
        </div>

        <p className="text-[11px] text-neutral-500">
          Tip: You can locate your Order Number in your confirmation email or VIP dashboard order history.
        </p>
      </form>

      {/* Tracking Results Card */}
      {orderData && (
        <div className="rounded-2xl border border-neutral-800 bg-obsidian-900/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl animate-fadeIn space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-5">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-gold font-semibold">Consignment Dossier</span>
              <h2 className="font-mono text-xl md:text-2xl font-bold text-ivory mt-0.5">
                {orderData.orderNumber}
              </h2>
            </div>
            <div className="text-right">
              <span className="rounded-full bg-emerald-950 border border-emerald-500/40 px-3.5 py-1 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Status: {orderData.orderStatus}
              </span>
              <p className="text-[11px] text-neutral-400 mt-1">Est. Delivery: {orderData.estimatedDelivery}</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-obsidian-800/60 border border-neutral-800">
              <p className="text-neutral-500 text-[10px] uppercase tracking-wider font-semibold">Carrier</p>
              <p className="font-medium text-ivory mt-0.5">{orderData.courier}</p>
            </div>
            <div className="p-3 rounded-xl bg-obsidian-800/60 border border-neutral-800">
              <p className="text-neutral-500 text-[10px] uppercase tracking-wider font-semibold">Airway Bill</p>
              <p className="font-mono text-gold mt-0.5">{orderData.trackingNumber}</p>
            </div>
            <div className="p-3 rounded-xl bg-obsidian-800/60 border border-neutral-800">
              <p className="text-neutral-500 text-[10px] uppercase tracking-wider font-semibold">Destination</p>
              <p className="font-medium text-ivory mt-0.5">{orderData.destinationCity}</p>
            </div>
            <div className="p-3 rounded-xl bg-obsidian-800/60 border border-neutral-800">
              <p className="text-neutral-500 text-[10px] uppercase tracking-wider font-semibold">Payment</p>
              <p className="font-medium text-emerald-400 mt-0.5">{orderData.paymentMethod}</p>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="pt-4 space-y-4">
            <p className="text-xs uppercase tracking-wider text-gold font-semibold">Transit Chronology:</p>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-800">
              {orderData.steps.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <span
                    className={`absolute -left-6 top-0.5 flex h-4 w-4 items-center justify-center rounded-full border ${
                      step.current
                        ? "border-gold bg-gold text-obsidian-950 shadow-gold-glow animate-pulse"
                        : step.done
                        ? "border-gold bg-gold/20 text-gold"
                        : "border-neutral-700 bg-obsidian-900 text-neutral-600"
                    }`}
                  >
                    {step.done ? <CheckCircle2 size={10} className="fill-gold" /> : <span className="h-1 w-1 rounded-full bg-neutral-600" />}
                  </span>
                  <div>
                    <p className={`text-xs font-semibold ${step.current ? "text-gold font-bold text-sm" : step.done ? "text-ivory" : "text-neutral-500"}`}>
                      {step.label}
                    </p>
                    <p className="text-[11px] text-neutral-400">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
