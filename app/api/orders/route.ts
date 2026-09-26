import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

const schema = z.object({
  addressId: z.string(),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER", "JAZZCASH", "EASYPAISA", "SAFEPAY"]),
  notes: z.string().max(500).optional(),
});

const FREE_SHIPPING_THRESHOLD = 15000;
const FLAT_SHIPPING_COST = 500;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true, payments: { orderBy: { createdAt: "desc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message || "Invalid input" }, { status: 400 });
  }
  const { addressId, paymentMethod, notes } = parsed.data;

  const [user, address, cart] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.address.findUnique({ where: { id: addressId } }),
    prisma.cart.findUnique({ where: { userId: session.user.id } }),
  ]);

  if (!address || address.userId !== session.user.id) {
    return NextResponse.json({ error: "Invalid shipping address" }, { status: 400 });
  }
  if (!cart) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  // Re-validate stock at the moment of order placement (it may have changed
  // since the item was added to the cart).
  for (const item of cartItems) {
    if (!item.product.isActive) {
      return NextResponse.json({ error: `${item.product.name} is no longer available` }, { status: 400 });
    }
    if (item.quantity > item.product.stock) {
      return NextResponse.json(
        { error: `Only ${item.product.stock} unit(s) of ${item.product.name} are in stock` },
        { status: 400 }
      );
    }
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.discountPrice ? Number(item.product.discountPrice) : Number(item.product.price);
    return sum + price * item.quantity;
  }, 0);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_COST;
  const discount = 0;
  const total = subtotal + shippingCost - discount;

  const orderNumber = generateOrderNumber();

  // Everything below happens atomically: if stock decrement fails for any
  // item, the whole order creation is rolled back.
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        addressId: address.id,
        subtotal,
        shippingCost,
        discount,
        total,
        paymentMethod,
        paymentStatus: "PENDING",
        orderStatus: "PENDING",
        customerName: user!.name,
        customerEmail: user!.email,
        customerPhone: user!.phone || address.phone,
        notes,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            name: item.product.name,
            price: item.product.discountPrice ? item.product.discountPrice : item.product.price,
            quantity: item.quantity,
          })),
        },
        payments: {
          create: {
            method: paymentMethod,
            status: paymentMethod === "COD" ? "SUCCESS" : "INITIATED",
            amount: total,
          },
        },
      },
      include: { items: true, payments: true },
    });

    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return created;
  });

  // COD requires no online verification step — the "payment" simply means
  // "collect cash on delivery"; paymentStatus stays PENDING until the rider
  // actually collects the cash, which the admin marks manually.
  return NextResponse.json({ order }, { status: 201 });
}
