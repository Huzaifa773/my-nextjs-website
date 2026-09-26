"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Minus, Plus, ShoppingBag, Zap, Loader2, Sparkles } from "lucide-react";
import { WishlistButton } from "@/components/WishlistButton";
import { alertAddToCart, alertError, alertToast } from "@/lib/alerts";

export function ProductPurchasePanel({
  productId,
  productName = "Luxury Perfume",
  productPrice = 0,
  productImage,
  stock,
  isWishlisted,
}: {
  productId: string;
  productName?: string;
  productPrice?: number;
  productImage?: string;
  stock: number;
  isWishlisted: boolean;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState<"cart" | "buy" | null>(null);

  function requireLogin() {
    alertToast("Please sign in to continue with your purchase", "info");
    router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
  }

  async function addToCart(): Promise<boolean> {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    const data = await res.json();
    if (!res.ok) {
      alertError("Could Not Add Item", data.error || "Failed to add to cart");
      return false;
    }
    return true;
  }

  async function handleAddToCart() {
    if (status !== "authenticated") return requireLogin();
    setLoading("cart");
    const ok = await addToCart();
    setLoading(null);
    if (ok) {
      router.refresh();
      const goToCart = await alertAddToCart({
        name: productName,
        price: productPrice * quantity,
        image: productImage,
      });
      if (goToCart) {
        router.push("/cart");
      }
    }
  }

  async function handleBuyNow() {
    if (status !== "authenticated") return requireLogin();
    setLoading("buy");
    const ok = await addToCart();
    setLoading(null);
    if (ok) router.push("/checkout");
  }

  return (
    <div className="space-y-5 rounded-2xl bg-obsidian-900/80 border border-gold/30 p-6 backdrop-blur-md">
      {/* Quantity & Stock row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Bottles:</span>
          <div className="flex items-center rounded-lg border border-neutral-700 bg-obsidian-800">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={stock === 0}
              aria-label="Decrease quantity"
              className="p-2.5 text-neutral-400 hover:text-gold disabled:opacity-30"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 text-center text-sm font-bold text-ivory">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
              disabled={stock === 0 || quantity >= stock}
              aria-label="Increase quantity"
              className="p-2.5 text-neutral-400 hover:text-gold disabled:opacity-30"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div>
          {stock > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              {stock} bottles available
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-950 text-red-400 border border-red-500/30">
              Temporarily Sold Out
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <button
          onClick={handleAddToCart}
          disabled={loading !== null || stock === 0}
          className="btn-outline flex-1 py-3.5 text-xs uppercase tracking-widest font-bold"
        >
          {loading === "cart" ? <Loader2 size={16} className="animate-spin" /> : <ShoppingBag size={16} />}
          Add to Bag
        </button>

        <button
          onClick={handleBuyNow}
          disabled={loading !== null || stock === 0}
          className="btn-primary flex-1 py-3.5 text-xs uppercase tracking-widest font-bold shadow-gold-glow"
        >
          {loading === "buy" ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
          Instant Checkout
        </button>

        <div className="flex sm:block justify-center">
          <WishlistButton
            productId={productId}
            productName={productName}
            initialWishlisted={isWishlisted}
            className="!h-12 !w-12 !border-gold/40 hover:!border-gold"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
        <span className="flex items-center gap-1 text-gold">
          <Sparkles size={12} /> Complimentary gift wrapping & 2 samples included
        </span>
      </div>
    </div>
  );
}
