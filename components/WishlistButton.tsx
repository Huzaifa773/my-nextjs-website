"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { alertWishlist, alertToast } from "@/lib/alerts";

export function WishlistButton({
  productId,
  productName = "Fragrance",
  initialWishlisted = false,
  className,
}: {
  productId: string;
  productName?: string;
  initialWishlisted?: boolean;
  className?: string;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (status !== "authenticated") {
      alertToast("Please sign in to save items to your wishlist", "info");
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setLoading(true);
    try {
      if (wishlisted) {
        const res = await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        setWishlisted(false);
        alertWishlist(productName, false);
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (!res.ok) throw new Error();
        setWishlisted(true);
        alertWishlist(productName, true);
      }
      router.refresh();
    } catch {
      alertToast("Unable to update wishlist. Please retry.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label="Toggle wishlist"
      className={cn(
        "group/wish flex h-9 w-9 items-center justify-center rounded-full bg-obsidian-950/80 backdrop-blur-md border border-gold/30 text-gold shadow-md transition-all duration-300 hover:scale-110 hover:border-gold hover:bg-gold/20 active:scale-95 disabled:opacity-50",
        wishlisted && "bg-gold/20 border-gold",
        className
      )}
    >
      <Heart
        size={17}
        className={cn(
          "transition-all duration-300",
          wishlisted
            ? "fill-gold text-gold scale-110 animate-pulse"
            : "text-neutral-300 group-hover/wish:text-gold"
        )}
      />
    </button>
  );
}
