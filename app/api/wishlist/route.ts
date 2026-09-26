import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getOrCreateWishlist(userId: string) {
  const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
  if (wishlist) return wishlist;
  return prisma.wishlist.create({ data: { userId } });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wishlist = await getOrCreateWishlist(session.user.id);
  const items = await prisma.wishlistItem.findMany({
    where: { wishlistId: wishlist.id },
    include: {
      product: { include: { images: { orderBy: { position: "asc" }, take: 1 } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items });
}

const addSchema = z.object({ productId: z.string() });

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const wishlist = await getOrCreateWishlist(session.user.id);

  const item = await prisma.wishlistItem.upsert({
    where: { wishlistId_productId: { wishlistId: wishlist.id, productId: product.id } },
    update: {},
    create: { wishlistId: wishlist.id, productId: product.id },
  });

  return NextResponse.json({ item }, { status: 201 });
}
