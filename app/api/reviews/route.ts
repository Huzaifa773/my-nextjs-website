export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message || "Invalid input" }, { status: 400 });
  }
  const { productId, rating, comment } = parsed.data;

  // Only customers who have actually ordered this product may review it.
  const purchased = await prisma.orderItem.findFirst({
    where: { productId, order: { userId: session.user.id } },
  });
  if (!purchased) {
    return NextResponse.json(
      { error: "You can only review products you have purchased" },
      { status: 403 }
    );
  }

  const review = await prisma.review.upsert({
    where: { userId_productId: { userId: session.user.id, productId } },
    update: { rating, comment },
    create: { userId: session.user.id, productId, rating, comment },
  });

  return NextResponse.json({ review }, { status: 201 });
}

