import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ categories });
}

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  image: z.string().url().optional(),
  isActive: z.boolean().default(true),
});

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message || "Invalid input" }, { status: 400 });

  const slug = parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const existing = await prisma.category.findFirst({ where: { OR: [{ name: parsed.data.name }, { slug }] } });
  if (existing) return NextResponse.json({ error: "A category with this name already exists" }, { status: 409 });

  const category = await prisma.category.create({ data: { ...parsed.data, slug } });
  return NextResponse.json({ category }, { status: 201 });
}
