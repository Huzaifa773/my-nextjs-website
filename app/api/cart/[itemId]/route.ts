import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function assertOwnership(itemId: string, userId: string) {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true, product: true },
  });
  if (!item || item.cart.userId !== userId) return null;
  return item;
}

const updateSchema = z.object({ quantity: z.number().int().min(1).max(20) });

export async function PATCH(req: Request, { params }: { params: { itemId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const item = await assertOwnership(params.itemId, session.user.id);
  if (!item) return NextResponse.json({ error: "Cart item not found" }, { status: 404 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });

  if (parsed.data.quantity > item.product.stock) {
    return NextResponse.json(
      { error: `Only ${item.product.stock} unit(s) of ${item.product.name} are in stock` },
      { status: 400 }
    );
  }

  const updated = await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity: parsed.data.quantity },
  });

  return NextResponse.json({ item: updated });
}

export async function DELETE(_req: Request, { params }: { params: { itemId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const item = await assertOwnership(params.itemId, session.user.id);
  if (!item) return NextResponse.json({ error: "Cart item not found" }, { status: 404 });

  await prisma.cartItem.delete({ where: { id: item.id } });
  return NextResponse.json({ success: true });
}
