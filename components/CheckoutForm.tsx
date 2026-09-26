"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Truck, Landmark, Smartphone, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { alertSuccess, alertError, alertToast } from "@/lib/alerts";

export interface AddressData {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const PAYMENT_METHODS = [
  { value: "COD", label: "Cash on Delivery (COD)", icon: Truck, hint: "Inspect parcel upon arrival & pay cash to courier" },
  { value: "BANK_TRANSFER", label: "Online Direct Bank Transfer", icon: Landmark, hint: "Meezan, HBL, Bank Alfalah verified transfer" },
  { value: "JAZZCASH", label: "JazzCash Mobile Wallet", icon: Smartphone, hint: "Instant wallet payment verification" },
  { value: "EASYPAISA", label: "Easypaisa Mobile Wallet", icon: Smartphone, hint: "Instant mobile account payment" },
  { value: "SAFEPAY", label: "Visa / Mastercard (Safepay)", icon: CreditCard, hint: "Secure credit/debit card checkout" },
] as const;

export function CheckoutForm({
  addresses,
  subtotal,
  shipping,
  total,
}: {
  addresses: AddressData[];
  subtotal: number;
  shipping: number;
  total: number;
}) {
  const router = useRouter();
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ""
  );
  const [showNewAddress, setShowNewAddress] = useState(addresses.length === 0);
  const [paymentMethod, setPaymentMethod] = useState<(typeof PAYMENT_METHODS)[number]["value"]>("COD");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "Karachi",
    province: "Sindh",
    postalCode: "",
    country: "Pakistan",
  });

  function updateNewAddress(field: string, value: string) {
    setNewAddress((a) => ({ ...a, [field]: value }));
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      let addressId = selectedAddressId;

      if (showNewAddress) {
        const res = await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newAddress, isDefault: addresses.length === 0 }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to save address");
        addressId = data.address.id;
      }

      if (!addressId) throw new Error("Please select or specify a shipping destination");

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId, paymentMethod, notes: notes || undefined }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to place order");

      const orderId = orderData.order.id;

      // Online Gateways redirect
      if (paymentMethod === "JAZZCASH") {
        window.location.href = `/api/payments/jazzcash/initiate?orderId=${orderId}`;
        return;
      }
      if (paymentMethod === "EASYPAISA") {
        window.location.href = `/api/payments/easypaisa/initiate?orderId=${orderId}`;
        return;
      }
      if (paymentMethod === "SAFEPAY") {
        window.location.href = `/api/payments/safepay/initiate?orderId=${orderId}`;
        return;
      }

      // SweetAlert2 notification for COD / Bank Transfer
      await alertSuccess(
        "Order Confirmed & Wax Sealed",
        `Your order <strong>${orderData.order.orderNumber}</strong> has been received by our master atelier. We are preparing your flacons with wax seal and complimentary discovery samples.`
      );

      router.push(`/order-confirmation/${orderId}`);
    } catch (err: any) {
      alertError("Order Placement Unsuccessful", err.message || "Please verify your details and retry");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handlePlaceOrder} className="grid gap-10 lg:grid-cols-12 items-start">
      {/* Left Column: Delivery & Payment (8 cols) */}
      <div className="space-y-8 lg:col-span-8">
        {/* Shipping Address Section */}
        <div className="rounded-2xl border border-neutral-800 bg-obsidian-900/80 p-6 md:p-8 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h2 className="font-serif text-xl font-bold text-ivory">1. Shipping Destination</h2>
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => setShowNewAddress((v) => !v)}
                className="text-xs font-semibold text-gold hover:underline"
              >
                {showNewAddress ? "← Select Saved Destination" : "+ Ship to New Address"}
              </button>
            )}
          </div>

          {addresses.length > 0 && !showNewAddress && (
            <div className="space-y-3">
              {addresses.map((a) => {
                const isSelected = selectedAddressId === a.id;
                return (
                  <label
                    key={a.id}
                    className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 text-xs transition-all duration-300 ${
                      isSelected
                        ? "border-gold bg-gold/10 shadow-gold-card"
                        : "border-neutral-800 bg-obsidian-800/60 hover:border-neutral-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={isSelected}
                      onChange={() => setSelectedAddressId(a.id)}
                      className="mt-1 accent-gold"
                    />
                    <div className="space-y-0.5">
                      <p className="font-serif text-sm font-bold text-ivory">
                        {a.fullName} <span className="text-gold font-mono text-xs">({a.phone})</span>
                      </p>
                      <p className="text-neutral-300">
                        {a.line1}
                        {a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.province} {a.postalCode}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {showNewAddress && (
            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Full Name</label>
                <input
                  required
                  placeholder="Recipient Name"
                  value={newAddress.fullName}
                  onChange={(e) => updateNewAddress("fullName", e.target.value)}
                  className="input-field rounded-xl"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Phone Number</label>
                <input
                  required
                  placeholder="+92 300 1234567"
                  value={newAddress.phone}
                  onChange={(e) => updateNewAddress("phone", e.target.value)}
                  className="input-field rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] text-neutral-400 block mb-1">Street Address</label>
                <input
                  required
                  placeholder="House / Apartment, Street"
                  value={newAddress.line1}
                  onChange={(e) => updateNewAddress("line1", e.target.value)}
                  className="input-field rounded-xl"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">City</label>
                <input
                  required
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => updateNewAddress("city", e.target.value)}
                  className="input-field rounded-xl"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Postal Code</label>
                <input
                  required
                  placeholder="Postal Code"
                  value={newAddress.postalCode}
                  onChange={(e) => updateNewAddress("postalCode", e.target.value)}
                  className="input-field rounded-xl"
                />
              </div>
            </div>
          )}
        </div>

        {/* Payment Method Section */}
        <div className="rounded-2xl border border-neutral-800 bg-obsidian-900/80 p-6 md:p-8 backdrop-blur-md space-y-4">
          <div className="border-b border-neutral-800 pb-3">
            <h2 className="font-serif text-xl font-bold text-ivory">2. Preferred Payment Channel</h2>
          </div>

          <div className="space-y-3">
            {PAYMENT_METHODS.map((m) => {
              const Icon = m.icon;
              const isSelected = paymentMethod === m.value;
              return (
                <label
                  key={m.value}
                  className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 text-xs transition-all duration-300 ${
                    isSelected
                      ? "border-gold bg-gold/10 shadow-gold-card"
                      : "border-neutral-800 bg-obsidian-800/60 hover:border-neutral-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={isSelected}
                    onChange={() => setPaymentMethod(m.value)}
                    className="mt-1 accent-gold"
                  />
                  <Icon size={18} className="mt-0.5 text-gold flex-shrink-0" />
                  <div className="space-y-0.5">
                    <p className="font-serif text-sm font-bold text-ivory">{m.label}</p>
                    <p className="text-neutral-400">{m.hint}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Special Instructions */}
        <div className="rounded-2xl border border-neutral-800 bg-obsidian-900/80 p-6 md:p-8 backdrop-blur-md space-y-2">
          <label className="font-serif text-sm font-bold text-ivory block">
            Special Concierge Instructions (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="input-field rounded-xl"
            placeholder="e.g. Please leave package at reception or include a handwritten gift note..."
          />
        </div>
      </div>

      {/* Right Column: Order Summary (4 cols) */}
      <div className="rounded-2xl border border-gold/30 bg-obsidian-900/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl lg:col-span-4 space-y-6">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-gold font-semibold">Payment Summary</span>
          <h2 className="font-serif text-xl font-bold text-ivory mt-0.5">Order Finalization</h2>
        </div>

        <div className="space-y-3 text-xs border-b border-neutral-800 pb-5">
          <div className="flex justify-between">
            <span className="text-neutral-400">Items Total</span>
            <span className="font-medium text-ivory">{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-400">Insured VIP Delivery</span>
            <span className="font-medium text-ivory">
              {shipping === 0 ? <span className="text-emerald-400 font-bold">Complimentary</span> : formatCurrency(shipping)}
            </span>
          </div>

          <div className="flex justify-between items-center text-gold">
            <span className="flex items-center gap-1">
              <Sparkles size={12} /> Discovery Samples
            </span>
            <span className="font-semibold">2 Free Vials Included</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="font-serif text-base font-bold text-ivory">Net Payable</span>
          <span className="font-serif text-2xl font-bold text-gold-200">{formatCurrency(total)}</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-4 text-xs uppercase tracking-widest font-bold shadow-gold-glow flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Place Order & Wax Seal
        </button>

        <div className="text-[11px] text-neutral-400 space-y-2 border-t border-neutral-800/80 pt-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck size={14} />
            <span>Authenticated Artisan Assurance</span>
          </div>
          <p>Orders are dispatched within 24 hours. Full courier tracking provided via SMS.</p>
        </div>
      </div>
    </form>
  );
}
