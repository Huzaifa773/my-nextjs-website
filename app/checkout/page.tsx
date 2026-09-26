import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "@/components/CheckoutForm";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Secure VIP Checkout | Maison Charcoal",
  description: "Complete your luxury fragrance acquisition with secure payment and complimentary delivery across Pakistan.",
};

const FREE_SHIPPING_THRESHOLD = 15000;
const FLAT_SHIPPING_COST = 500;

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/checkout");

  const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
  const cartItems = cart
    ? await prisma.cartItem.findMany({
        where: { cartId: cart.id },
        include: { product: true },
      })
    : [];

  if (cartItems.length === 0) {
    redirect("/cart");
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.discountPrice ? Number(item.product.discountPrice) : Number(item.product.price);
    return sum + price * item.quantity;
  }, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_COST;
  const total = subtotal + shipping;

  return (
    <div className="bg-obsidian-950 text-ivory min-h-screen py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="border-b border-neutral-800 pb-6 mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-gold mb-2">
            <Sparkles size={12} />
            <span>Secure Patron Finalization</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-ivory">
            Order <span className="gold-gradient-text">Checkout</span>
          </h1>
        </div>

        <CheckoutForm
          addresses={addresses.map((a) => ({
            id: a.id,
            fullName: a.fullName,
            phone: a.phone,
            line1: a.line1,
            line2: a.line2,
            city: a.city,
            province: a.province,
            postalCode: a.postalCode,
            country: a.country,
            isDefault: a.isDefault,
          }))}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
        />
      </div>
    </div>
  );
}
