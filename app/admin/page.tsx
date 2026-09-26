import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import {
  CreditCard,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  ArrowRight,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";

async function getStats() {
  const [totalUsers, totalProducts, totalOrders, pendingOrders, paidAgg, recentOrders, lowStock] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { orderStatus: "PENDING" } }),
    prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.product.findMany({ where: { stock: { lte: 10 }, isActive: true }, orderBy: { stock: "asc" }, take: 5 }),
  ]);
  return {
    totalUsers,
    totalProducts,
    totalOrders,
    pendingOrders,
    totalSales: paidAgg._sum.total || 0,
    recentOrders,
    lowStock,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Verified Revenue", value: formatCurrency(stats.totalSales), icon: CreditCard, trend: "+18.4% this month" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, trend: "All Time" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: ShoppingCart, alert: stats.pendingOrders > 0 },
    { label: "Active Products", value: stats.totalProducts, icon: Package, trend: "In Catalog" },
    { label: "Registered Patrons", value: stats.totalUsers, icon: Users, trend: "VIP Customers" },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-gold font-semibold">Executive Cockpit</span>
          <h1 className="font-serif text-3xl font-bold text-ivory mt-0.5">Admin Command Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="btn-primary text-xs uppercase tracking-wider font-bold py-2.5 px-5 shadow-gold-glow flex items-center gap-1.5"
          >
            <Plus size={15} /> Add New Fragrance
          </Link>
        </div>
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-2xl border p-5 backdrop-blur-md transition-all duration-300 ${
              c.alert
                ? "border-amber-500/40 bg-amber-950/20"
                : "border-neutral-800 bg-obsidian-900/80 hover:border-gold/40"
            }`}
          >
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {c.label}
              </span>
              <c.icon size={16} className={c.alert ? "text-amber-400" : "text-gold"} />
            </div>
            <p className="mt-2 font-serif text-2xl font-bold text-ivory">{c.value}</p>
            <p className={`text-[10px] mt-1 font-medium ${c.alert ? "text-amber-400" : "text-neutral-500"}`}>
              {c.alert ? "Action required" : c.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Main Grid: Recent Orders + Low Stock Alerts */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Orders (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-neutral-800 bg-obsidian-900/80 p-6 md:p-8 backdrop-blur-md space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-gold font-semibold">Live Traffic</span>
              <h2 className="font-serif text-xl font-bold text-ivory mt-0.5">Recent Consignments</h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-gold hover:text-gold-light flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recentOrders.length === 0 ? (
              <p className="text-sm text-neutral-500 py-6 text-center">No orders recorded yet.</p>
            ) : (
              stats.recentOrders.map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/orders/${o.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-obsidian-800/50 p-4 transition-all duration-200 hover:border-gold/40 hover:bg-gold/5"
                >
                  <div>
                    <p className="font-mono text-xs font-bold text-gold">{o.orderNumber}</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {o.customerName} &bull; {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="rounded-full bg-gold/15 border border-gold/40 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                      {o.orderStatus}
                    </span>
                    <span className="font-serif text-sm font-bold text-ivory">
                      {formatCurrency(o.total)}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Low Stock Warnings (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-neutral-800 bg-obsidian-900/80 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <AlertTriangle size={18} className="text-amber-400" />
            <h2 className="font-serif text-lg font-bold text-ivory">Inventory Warnings</h2>
          </div>

          {stats.lowStock.length === 0 ? (
            <p className="text-xs text-neutral-400 py-4 text-center">
              All fragrance stocks are healthy.
            </p>
          ) : (
            <div className="space-y-3">
              {stats.lowStock.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-red-500/30 bg-red-950/20 p-3 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-ivory truncate">{p.name}</p>
                    <p className="text-[10px] text-neutral-400">{p.size}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="rounded-full bg-red-900/60 border border-red-500/50 px-2 py-0.5 text-[10px] font-bold text-red-300">
                      {p.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2">
            <Link
              href="/admin/products"
              className="btn-secondary w-full text-center text-xs uppercase tracking-wider font-semibold py-2.5"
            >
              Review All Inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
