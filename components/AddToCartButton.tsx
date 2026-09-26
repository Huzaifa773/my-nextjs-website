"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShoppingBag, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { alertAddToCart, alertError, alertToast } from "@/lib/alerts";

export function AddToCartButton({
  productId,
  productName = "Luxury Fragrance",
  productPrice = 0,
  productImage,
  quantity = 1,
  outOfStock = false,
  className,
  full = false,
  variant = "primary",
}: {
  productId: string;
  productName?: string;
  productPrice?: number;
  productImage?: string;
  quantity?: number;
  outOfStock?: boolean;
  className?: string;
  full?: boolean;
  variant?: "primary" | "outline" | "compact";
}) {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function addToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (status !== "authenticated") {
      alertToast("Please sign in to add to your collection", "info");
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add to cart");

      router.refresh();

      // Trigger Luxury SweetAlert2 Modal
      const goToCart = await alertAddToCart({
        name: productName,
        price: productPrice,
        image: productImage,
      });

      if (goToCart) {
        router.push("/cart");
      }
    } catch (err: any) {
      alertError("Could Not Add Item", err.message || "Please try again shortly");
    } finally {
      setLoading(false);
    }
  }

  const baseClasses =
    variant === "outline"
      ? "btn-outline text-xs tracking-wider uppercase font-semibold"
      : variant === "compact"
      ? "bg-gold hover:bg-gold-light text-obsidian-950 p-2.5 rounded-full shadow-gold-glow transition-all duration-300 hover:scale-110 active:scale-95"
      : "btn-primary text-xs tracking-wider uppercase font-semibold";

  return (
    <button
      onClick={addToCart}
      disabled={loading || outOfStock}
      aria-label="Add to cart"
      className={cn(
        baseClasses,
        full && "w-full py-2.5",
        outOfStock && "opacity-40 cursor-not-allowed bg-neutral-800 text-neutral-400 hover:shadow-none hover:brightness-100",
        className
      )}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <ShoppingBag size={16} />
      )}
      {variant !== "compact" && (outOfStock ? "Out of Stock" : "Add to Bag")}
    </button>
  );
}
