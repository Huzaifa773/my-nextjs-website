"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Compass,
  Sparkles,
  Truck,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

const CATEGORIES = [
  { name: "Men's Perfumes", slug: "mens-perfumes" },
  { name: "Women's Perfumes", slug: "womens-perfumes" },
  { name: "Unisex Perfumes", slug: "unisex-perfumes" },
  { name: "Royal Oud", slug: "oud" },
  { name: "Pure Attar Oils", slug: "attar" },
  { name: "Prestige Gift Sets", slug: "gift-sets" },
  { name: "Private Reserve", slug: "premium-collection" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (status !== "authenticated") {
      setCartCount(0);
      setWishlistCount(0);
      return;
    }
    fetch("/api/cart")
      .then((r) => r.json())
      .then((d) => setCartCount(d.items?.reduce((n: number, i: any) => n + i.quantity, 0) || 0))
      .catch(() => {});
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((d) => setWishlistCount(d.items?.length || 0))
      .catch(() => {});
  }, [status]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  }

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      <div className="bg-obsidian-950 border-b border-gold/15 py-1.5 px-4 text-center text-xs tracking-wider text-neutral-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 text-gold text-[11px]">
            <Sparkles size={12} />
            <span>Maison Charcoal Haute Parfumerie</span>
          </div>
          <p className="flex-1 text-center font-medium">
            Complimentary VIP Delivery on orders above PKR 15,000 &bull; 2 Free Samples with every order
          </p>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-neutral-400">
            <Link href="/track-order" className="hover:text-gold transition-colors flex items-center gap-1">
              <Truck size={12} /> Track Order
            </Link>
            <Link href="/contact" className="hover:text-gold transition-colors">
              Concierge
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-obsidian-950/95 backdrop-blur-md shadow-2xl border-b border-gold/20 py-3"
            : "bg-obsidian-900 border-b border-neutral-800/80 py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 md:px-8">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="h-9 w-9 rounded-full border border-gold/50 bg-gradient-to-br from-gold/30 to-obsidian-950 flex items-center justify-center text-gold font-serif text-lg font-bold shadow-gold-glow group-hover:scale-105 transition-transform duration-300">
              MC
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl md:text-2xl tracking-[0.2em] font-semibold text-ivory group-hover:text-gold transition-colors">
                MAISON <span className="text-gold">CHARCOAL</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.35em] text-neutral-400 -mt-1">
                Haute Parfumerie
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-widest text-neutral-300 lg:flex">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <Link href="/products" className="hover:text-gold transition-colors">
              Catalog
            </Link>

            {/* Categories Dropdown */}
            <div className="group relative py-2">
              <button className="flex items-center gap-1 hover:text-gold transition-colors">
                <span>Collections</span>
                <ChevronDown size={13} className="transition-transform group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-0 top-full z-50 w-60 rounded-xl bg-obsidian-900/95 border border-gold/30 p-2 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <Link
                  href="/collections"
                  className="block px-3 py-2 rounded-lg text-xs font-bold text-gold hover:bg-gold/15"
                >
                  View All Curations →
                </Link>
                <div className="my-1 border-t border-neutral-800" />
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/products?category=${c.slug}`}
                    className="block px-3 py-2 rounded-lg text-xs text-neutral-300 hover:bg-gold/15 hover:text-gold transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/quiz" className="flex items-center gap-1.5 text-gold hover:text-gold-light transition-colors">
              <Sparkles size={14} /> Scent Quiz
            </Link>
            <Link href="/about" className="hover:text-gold transition-colors">
              Our Maison
            </Link>
            <Link href="/contact" className="hover:text-gold transition-colors">
              Concierge
            </Link>
          </nav>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="relative hidden flex-1 max-w-xs md:flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search perfumes, notes, oud..."
              className="w-full rounded-full border border-neutral-800 bg-obsidian-800/80 px-4 py-2 text-xs text-ivory placeholder:text-neutral-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-gold transition-colors"
            >
              <Search size={15} />
            </button>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-full text-neutral-300 hover:text-gold hover:bg-white/5 transition-all"
              title="My Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-gold-500 to-amber-400 text-[10px] font-bold text-obsidian-950 shadow-gold-glow animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full text-neutral-300 hover:text-gold hover:bg-white/5 transition-all"
              title="Shopping Bag"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-gold-500 to-amber-400 text-[10px] font-bold text-obsidian-950 shadow-gold-glow">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account / Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center gap-1.5 p-2 rounded-full text-neutral-300 hover:text-gold hover:bg-white/5 transition-all"
                title="Account"
              >
                <User size={20} />
              </button>
              {accountOpen && (
                <div
                  onMouseLeave={() => setAccountOpen(false)}
                  className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-obsidian-900 border border-gold/30 p-2 shadow-2xl backdrop-blur-xl z-50 animate-fadeIn"
                >
                  {session ? (
                    <>
                      <div className="px-3 py-2 border-b border-neutral-800">
                        <p className="text-xs font-semibold text-ivory truncate">{session.user.name}</p>
                        <p className="text-[10px] text-gold uppercase tracking-wider">
                          {session.user.role === "ADMIN" ? "VIP Master Admin" : "VIP Patron Member"}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:bg-gold/15 hover:text-gold transition-colors mt-1"
                      >
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      <Link
                        href="/dashboard/orders"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:bg-gold/15 hover:text-gold transition-colors"
                      >
                        <ShoppingBag size={15} /> My Orders
                      </Link>
                      <Link
                        href="/track-order"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:bg-gold/15 hover:text-gold transition-colors"
                      >
                        <Truck size={15} /> Track Shipment
                      </Link>
                      {session.user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors my-1"
                        >
                          <ShieldCheck size={15} /> Admin Console
                        </Link>
                      )}
                      <div className="my-1 border-t border-neutral-800" />
                      <button
                        onClick={() => {
                          setAccountOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setAccountOpen(false)}
                        className="block px-3 py-2 rounded-lg text-xs font-semibold text-gold hover:bg-gold/15 transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setAccountOpen(false)}
                        className="block px-3 py-2 rounded-lg text-xs text-neutral-300 hover:bg-neutral-800 transition-colors"
                      >
                        Create VIP Account
                      </Link>
                      <div className="my-1 border-t border-neutral-800" />
                      <Link
                        href="/track-order"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-neutral-400 hover:text-gold"
                      >
                        <Truck size={14} /> Track Order
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              className="lg:hidden p-2 text-neutral-300 hover:text-gold"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="border-t border-neutral-800 bg-obsidian-950 px-4 py-6 lg:hidden animate-fadeIn space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search perfumes..."
                className="w-full rounded-lg border border-neutral-800 bg-obsidian-900 px-4 py-2.5 text-sm text-ivory placeholder:text-neutral-500 focus:outline-none focus:border-gold"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <Search size={16} />
              </button>
            </form>

            <div className="flex flex-col space-y-2 text-sm font-medium tracking-wide">
              <Link href="/" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg hover:bg-gold/10 hover:text-gold">
                Home
              </Link>
              <Link href="/products" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg hover:bg-gold/10 hover:text-gold">
                Shop Fragrances
              </Link>
              <Link href="/collections" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg hover:bg-gold/10 hover:text-gold">
                Curated Collections
              </Link>
              <Link href="/quiz" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-gold hover:bg-gold/10 flex items-center gap-2">
                <Sparkles size={16} /> Scent Finder Quiz
              </Link>
              <Link href="/about" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg hover:bg-gold/10 hover:text-gold">
                Our Maison Story
              </Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg hover:bg-gold/10 hover:text-gold">
                Boutiques & Concierge
              </Link>
              <Link href="/track-order" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg hover:bg-gold/10 hover:text-gold flex items-center gap-2">
                <Truck size={16} /> Live Order Tracking
              </Link>
              <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg hover:bg-gold/10 hover:text-gold flex items-center justify-between">
                <span>Wishlist</span>
                {wishlistCount > 0 && <span className="bg-gold text-obsidian-950 px-2 py-0.5 rounded-full text-xs font-bold">{wishlistCount}</span>}
              </Link>

              <div className="pt-2 border-t border-neutral-800">
                {session ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-gold/10 hover:text-gold font-semibold text-gold">
                      Dashboard ({session.user.name})
                    </Link>
                    {session.user.role === "ADMIN" && (
                      <Link href="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-amber-400 font-semibold">
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="block w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="btn-outline text-center text-xs py-2"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="btn-primary text-center text-xs py-2"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
