import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: Request, { params }: { params: { productId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wishlist = await prisma.wishlist.findUnique({ where: { userId: session.user.id } });
  if (!wishlist) return NextResponse.json({ error: "Wishlist not found" }, { status: 404 });

  await prisma.wishlistItem.deleteMany({
    where: { wishlistId: wishlist.id, productId: params.productId },
  });

  return NextResponse.json({ success: true });
}
