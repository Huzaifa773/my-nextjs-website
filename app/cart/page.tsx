import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CartClient } from "@/components/CartClient";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Shopping Bag | Maison Charcoal",
  description: "Review your selected luxury perfumes, attars, and oud oils before checkout.",
};

export default async function CartPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/cart");

  const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
  const items = cart
    ? await prisma.cartItem.findMany({
        where: { cartId: cart.id },
        include: { product: { include: { images: { orderBy: { position: "asc" }, take: 1 } } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const formatted = items.map((i) => ({
    id: i.id,
    quantity: i.quantity,
    product: {
      id: i.product.id,
      name: i.product.name,
      brand: i.product.brand,
      price: Number(i.product.price),
      discountPrice: i.product.discountPrice ? Number(i.product.discountPrice) : null,
      stock: i.product.stock,
      images: i.product.images,
    },
  }));

  return (
    <div className="bg-obsidian-950 text-ivory min-h-screen py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="border-b border-neutral-800 pb-6 mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-gold mb-2">
            <Sparkles size={12} />
            <span>Curated Selections</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-ivory">
            Shopping <span className="gold-gradient-text">Bag</span>
          </h1>
        </div>

        <CartClient initialItems={formatted} />
      </div>
    </div>
  );
}
