import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, Heart, MapPin, Award, ArrowRight, Truck, Compass, Sparkles } from "lucide-react";

export default async function DashboardOverviewPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [user, ordersCount, wishlist, addressesCount, recentOrders] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.order.count({ where: { userId } }),
    prisma.wishlist.findUnique({
      where: { userId },
      include: { items: true },
    }),
    prisma.address.count({ where: { userId } }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { items: true },
    }),
  ]);

  const wishlistCount = wishlist?.items.length || 0;

  const STATS = [
    { label: "Orders Placed", value: ordersCount, icon: ShoppingBag, href: "/dashboard/orders" },
    { label: "Saved in Wishlist", value: wishlistCount, icon: Heart, href: "/wishlist" },
    { label: "Registered Addresses", value: addressesCount, icon: MapPin, href: "/dashboard/addresses" },
    { label: "VIP Privilège", value: "Active", icon: Award, href: "#" },
  ];

  return (
    <div className="space-y-8">
      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s, idx) => (
          <Link
            key={idx}
            href={s.href}
            className="group rounded-2xl border border-neutral-800 bg-obsidian-900/70 p-5 backdrop-blur-md transition-all duration-300 hover:border-gold/50 hover:bg-gold/5 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {s.label}
              </span>
              <s.icon size={16} className="text-gold group-hover:scale-110 transition-transform" />
            </div>
            <p className="mt-3 font-serif text-2xl font-bold text-ivory group-hover:text-gold transition-colors">
              {s.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/quiz"
          className="rounded-2xl border border-gold/30 bg-gold/10 p-5 flex items-center justify-between group hover:border-gold transition-all"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold">Concierge Service</span>
            <p className="font-serif text-sm font-bold text-ivory">Take Scent Quiz</p>
          </div>
          <Compass size={22} className="text-gold group-hover:rotate-45 transition-transform" />
        </Link>

        <Link
          href="/track-order"
          className="rounded-2xl border border-neutral-800 bg-obsidian-900/60 p-5 flex items-center justify-between group hover:border-gold/40 transition-all"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Real-Time Dispatch</span>
            <p className="font-serif text-sm font-bold text-ivory">Track Shipment</p>
          </div>
          <Truck size={22} className="text-gold" />
        </Link>

        <Link
          href="/products"
          className="rounded-2xl border border-neutral-800 bg-obsidian-900/60 p-5 flex items-center justify-between group hover:border-gold/40 transition-all"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Haute Catalog</span>
            <p className="font-serif text-sm font-bold text-ivory">New Fragrances</p>
          </div>
          <Sparkles size={22} className="text-gold" />
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-2xl border border-neutral-800 bg-obsidian-900/70 p-6 md:p-8 backdrop-blur-md space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-gold font-semibold">Order Chronology</span>
            <h2 className="font-serif text-xl font-bold text-ivory mt-0.5">Recent Fragrance Orders</h2>
          </div>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-1 text-xs font-semibold text-gold hover:text-gold-light"
          >
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <p className="text-neutral-400 text-sm">You have not acquired any creations yet.</p>
            <Link href="/products" className="btn-primary text-xs uppercase tracking-wider font-bold inline-flex">
              Explore The Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((o) => (
              <Link
                key={o.id}
                href={`/order-confirmation/${o.id}`}
                className="group flex flex-wrap items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-obsidian-800/60 p-4 transition-all duration-300 hover:border-gold/50 hover:bg-gold/5"
              >
                <div>
                  <p className="font-mono text-xs md:text-sm font-bold text-gold group-hover:underline">
                    {o.orderNumber}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} &bull; {o.items.length} item(s)
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-gold/15 border border-gold/40 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                    {o.orderStatus}
                  </span>
                <span className="font-serif text-sm md:text-base font-bold text-ivory">
                  {formatCurrency(Number(o.total))}
                </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Profile Details Dossier */}
      <div className="rounded-2xl border border-neutral-800 bg-obsidian-900/70 p-6 md:p-8 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h2 className="font-serif text-lg font-bold text-gold-300">Patron Dossier</h2>
          <Link href="/dashboard/settings" className="text-xs text-gold hover:underline">
            Modify Dossier →
          </Link>
        </div>

        <dl className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-obsidian-800/50 border border-neutral-800">
            <dt className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">Patron Name</dt>
            <dd className="font-medium text-ivory mt-1">{user?.name}</dd>
          </div>
          <div className="p-3 rounded-xl bg-obsidian-800/50 border border-neutral-800">
            <dt className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">Email Address</dt>
            <dd className="font-mono text-ivory mt-1 truncate">{user?.email}</dd>
          </div>
          <div className="p-3 rounded-xl bg-obsidian-800/50 border border-neutral-800">
            <dt className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">Phone Number</dt>
            <dd className="font-mono text-ivory mt-1">{user?.phone || "Not Specified"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

