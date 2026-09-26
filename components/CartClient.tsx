"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, Loader2, Sparkles, ShieldCheck, ArrowRight, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { alertConfirm, alertToast, alertError } from "@/lib/alerts";

export interface CartItemData {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    discountPrice: number | null;
    stock: number;
    images: { url: string; altText: string | null }[];
  };
}

export function CartClient({ initialItems }: { initialItems: CartItemData[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) return;
    setBusyId(itemId);
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update quantity");
      setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)));
      router.refresh();
    } catch (err: any) {
      alertError("Update Failed", err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function removeItem(itemId: string, name: string) {
    const confirmed = await alertConfirm(
      "Remove Fragrance?",
      `Are you sure you wish to remove <strong>${name}</strong> from your shopping bag?`,
      "Yes, Remove",
      "Keep In Bag"
    );
    if (!confirmed) return;

    setBusyId(itemId);
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove item");
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      alertToast("Item removed from your bag", "info");
      router.refresh();
    } catch (err: any) {
      alertError("Failed", err.message);
    } finally {
      setBusyId(null);
    }
  }

  const subtotal = items.reduce((sum, i) => {
    const price = i.product.discountPrice ?? i.product.price;
    return sum + price * i.quantity;
  }, 0);
  const isFreeShipping = subtotal >= 15000;
  const shipping = subtotal > 0 ? (isFreeShipping ? 0 : 500) : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-neutral-800 bg-obsidian-900/40 py-24 text-center space-y-4">
        <ShoppingBag className="h-16 w-16 text-neutral-600 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-ivory">Your Shopping Bag is Empty</h2>
        <p className="text-xs md:text-sm text-neutral-400 max-w-md mx-auto">
          Explore our artisan perfume and pure oud collection to add olfactory masterpieces to your bag.
        </p>
        <div className="pt-2">
          <Link href="/products" className="btn-primary text-xs uppercase tracking-widest font-bold py-3.5 px-8 shadow-gold-glow">
            Discover Fragrances
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12 items-start">
      {/* Items List (8 cols) */}
      <div className="space-y-4 lg:col-span-8">
        {items.map((item) => {
          const price = item.product.discountPrice ?? item.product.price;
          const image =
            item.product.images[0]?.url ||
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&q=80";

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-5 rounded-2xl border border-neutral-800 bg-obsidian-900/80 p-5 backdrop-blur-md transition-all duration-300 hover:border-gold/40"
            >
              {/* Bottle Thumbnail */}
              <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl border border-gold/20 bg-obsidian-950">
                <Image src={image} alt={item.product.name} fill className="object-cover" />
              </div>

              {/* Product Info */}
              <div className="flex flex-1 flex-col justify-between space-y-3 sm:space-y-0">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                      {item.product.brand}
                    </span>
                    <Link
                      href={`/products/${item.product.id}`}
                      className="block font-serif text-lg font-bold text-ivory hover:text-gold transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-neutral-400">
                      Unit: {formatCurrency(price)}
                    </p>
                  </div>

                  <button
                    disabled={busyId === item.id}
                    onClick={() => removeItem(item.id, item.product.name)}
                    className="text-neutral-500 hover:text-red-400 p-1.5 transition-colors"
                    title="Remove Item"
                  >
                    {busyId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                  {/* Quantity Stepper */}
                  <div className="flex items-center rounded-lg border border-neutral-700 bg-obsidian-800">
                    <button
                      disabled={busyId === item.id || item.quantity <= 1}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-neutral-400 hover:text-gold disabled:opacity-30"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-ivory">{item.quantity}</span>
                    <button
                      disabled={busyId === item.id || item.quantity >= item.product.stock}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-neutral-400 hover:text-gold disabled:opacity-30"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Subtotal Item */}
                  <span className="font-serif text-base font-bold text-gold-200">
                    {formatCurrency(price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Summary Card (4 cols) */}
      <div className="rounded-2xl border border-gold/30 bg-obsidian-900/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl lg:col-span-4 space-y-6">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-gold font-semibold">Bag Dossier</span>
          <h2 className="font-serif text-xl font-bold text-ivory mt-0.5">Order Summary</h2>
        </div>

        <div className="space-y-3 text-xs border-b border-neutral-800 pb-5">
          <div className="flex justify-between">
            <span className="text-neutral-400">Flacons Subtotal</span>
            <span className="font-medium text-ivory">{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="text-neutral-400">VIP Courier Dispatch</span>
              {isFreeShipping && (
                <span className="block text-[10px] text-emerald-400">Complimentary (Over PKR 15k)</span>
              )}
            </div>
            <span className="font-medium text-ivory">
              {shipping === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : formatCurrency(shipping)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-400">Complimentary Discovery Samples</span>
            <span className="text-gold font-semibold">2 Free Vials</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="font-serif text-base font-bold text-ivory">Estimated Total</span>
          <span className="font-serif text-2xl font-bold text-gold-200">{formatCurrency(total)}</span>
        </div>

        <Link
          href="/checkout"
          className="btn-primary w-full py-4 text-xs uppercase tracking-widest font-bold shadow-gold-glow flex items-center justify-center gap-2"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight size={15} />
        </Link>

        <div className="pt-2 text-[11px] text-neutral-400 space-y-2 border-t border-neutral-800/80">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck size={14} />
            <span>SSL 256-bit Encrypted Checkout</span>
          </div>
          <p>Cash on Delivery, Bank Transfer & JazzCash accepted.</p>
        </div>
      </div>
    </div>
  );
}
