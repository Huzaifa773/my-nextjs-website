import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function assertOwnership(id: string, userId: string) {
  const address = await prisma.address.findUnique({ where: { id } });
  if (!address || address.userId !== userId) return null;
  return address;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const address = await assertOwnership(params.id, session.user.id);
  if (!address) return NextResponse.json({ error: "Address not found" }, { status: 404 });

  const body = await req.json();

  if (body.isDefault) {
    await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } });
  }

  const updated = await prisma.address.update({ where: { id: params.id }, data: body });
  return NextResponse.json({ address: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const address = await assertOwnership(params.id, session.user.id);
  if (!address) return NextResponse.json({ error: "Address not found" }, { status: 404 });

  await prisma.address.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
