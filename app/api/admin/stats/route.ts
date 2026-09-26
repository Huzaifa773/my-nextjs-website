import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    totalUsers,
    totalProducts,
    totalOrders,
    pendingOrders,
    paidOrdersAgg,
    recentOrders,
    recentUsers,
    lowStockProducts,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { orderStatus: "PENDING" } }),
    prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true }, _count: true }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.user.findMany({ where: { role: "CUSTOMER" }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.product.findMany({ where: { stock: { lte: 10 }, isActive: true }, orderBy: { stock: "asc" }, take: 5 }),
  ]);

  return NextResponse.json({
    totalUsers,
    totalProducts,
    totalOrders,
    pendingOrders,
    totalSales: paidOrdersAgg._sum.total || 0,
    paidOrdersCount: paidOrdersAgg._count,
    recentOrders,
    recentUsers,
    lowStockProducts,
  });
}
