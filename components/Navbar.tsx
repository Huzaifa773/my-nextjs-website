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

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (status !== "authenticated") {
      setCartCount(0);
      setWishlistCount(0);
      return;
    }

    fetch("/api/cart")
      .then((r) => r.json())
      .then((d) =>
        setCartCount(
          d.items?.reduce(
            (n: number, i: { quantity: number }) => n + i.quantity,
            0
          ) || 0
        )
      )
      .catch(() => {});

    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((d) => setWishlistCount(d.items?.length || 0))
      .catch(() => {});
  }, [status]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setMobileOpen(false);

    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <>
      {/* =========================================================
          TOP ANNOUNCEMENT BAR
      ========================================================= */}
      <div className="bg-obsidian-950 border-b border-gold/15 py-1.5 px-4 text-center text-xs tracking-wider text-neutral-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 text-gold text-[11px]">
            <Sparkles size={12} />
            <span>Maison Charcoal Haute Parfumerie</span>
          </div>

          <p className="flex-1 text-center font-medium">
            Complimentary VIP Delivery on orders above PKR 15,000 &bull; 2
            Free Samples with every order
          </p>

          <div className="hidden md:flex items-center gap-4 text-[11px] text-neutral-400">
            <Link
              href="/track-order"
              className="hover:text-gold transition-colors flex items-center gap-1"
            >
              <Truck size={12} />
              Track Order
            </Link>

            <Link
              href="/contact"
              className="hover:text-gold transition-colors"
            >
              Concierge
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================
          MAIN NAVBAR
      ========================================================= */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-obsidian-950/95 backdrop-blur-md shadow-2xl border-b border-gold/20 py-3"
            : "bg-obsidian-900 border-b border-neutral-800/80 py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
          {/* =====================================================
              BRAND LOGO
          ===================================================== */}
          <Link
            href="/"
            className="group flex items-center gap-2 min-w-0"
            onClick={closeMobileMenu}
          >
            <div className="h-9 w-9 shrink-0 rounded-full border border-gold/50 bg-gradient-to-br from-gold/30 to-obsidian-950 flex items-center justify-center text-gold font-serif text-lg font-bold shadow-gold-glow group-hover:scale-105 transition-transform duration-300">
              MC
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-serif text-base sm:text-xl md:text-2xl tracking-[0.12em] md:tracking-[0.2em] font-semibold text-ivory group-hover:text-gold transition-colors whitespace-nowrap">
                MAISON <span className="text-gold">CHARCOAL</span>
              </span>

              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-neutral-400 -mt-1">
                Haute Parfumerie
              </span>
            </div>
          </Link>

          {/* =====================================================
              DESKTOP NAV LINKS
          ===================================================== */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-xs font-semibold uppercase tracking-widest text-neutral-300">
            <Link
              href="/"
              className="hover:text-gold transition-colors whitespace-nowrap"
            >
              Home
            </Link>

            <Link
              href="/products"
              className="hover:text-gold transition-colors whitespace-nowrap"
            >
              Catalog
            </Link>

            {/* Categories */}
            <div className="group relative py-2">
              <button
                type="button"
                className="flex items-center gap-1 hover:text-gold transition-colors whitespace-nowrap"
              >
                <span>Collections</span>
                <ChevronDown
                  size={13}
                  className="transition-transform group-hover:rotate-180"
                />
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

            <Link
              href="/quiz"
              className="flex items-center gap-1.5 text-gold hover:text-gold-light transition-colors whitespace-nowrap"
            >
              <Sparkles size={14} />
              Scent Quiz
            </Link>

            <Link
              href="/about"
              className="hover:text-gold transition-colors whitespace-nowrap"
            >
              Our Maison
            </Link>

            <Link
              href="/contact"
              className="hover:text-gold transition-colors whitespace-nowrap"
            >
              Concierge
            </Link>
          </nav>

          {/* =====================================================
              DESKTOP SEARCH
          ===================================================== */}
          <form
            onSubmit={handleSearch}
            className="relative hidden flex-1 max-w-xs md:flex"
          >
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
              aria-label="Search"
            >
              <Search size={15} />
            </button>
          </form>

          {/* =====================================================
              RIGHT ACTIONS
          ===================================================== */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-full text-neutral-300 hover:text-gold hover:bg-white/5 transition-all"
              title="My Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={20} />

              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-gold-500 to-amber-400 text-[10px] font-bold text-obsidian-950 shadow-gold-glow animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full text-neutral-300 hover:text-gold hover:bg-white/5 transition-all"
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={20} />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-gold-500 to-amber-400 text-[10px] font-bold text-obsidian-950 shadow-gold-glow">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center gap-1.5 p-2 rounded-full text-neutral-300 hover:text-gold hover:bg-white/5 transition-all"
                title="Account"
                aria-label="Account"
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
                        <p className="text-xs font-semibold text-ivory truncate">
                          {session.user.name}
                        </p>

                        <p className="text-[10px] text-gold uppercase tracking-wider">
                          {session.user.role === "ADMIN"
                            ? "VIP Master Admin"
                            : "VIP Patron Member"}
                        </p>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:bg-gold/15 hover:text-gold transition-colors mt-1"
                      >
                        <LayoutDashboard size={15} />
                        Dashboard
                      </Link>

                      <Link
                        href="/dashboard/orders"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:bg-gold/15 hover:text-gold transition-colors"
                      >
                        <ShoppingBag size={15} />
                        My Orders
                      </Link>

                      <Link
                        href="/track-order"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:bg-gold/15 hover:text-gold transition-colors"
                      >
                        <Truck size={15} />
                        Track Shipment
                      </Link>

                      {session.user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors my-1"
                        >
                          <ShieldCheck size={15} />
                          Admin Console
                        </Link>
                      )}

                      <div className="my-1 border-t border-neutral-800" />

                      <button
                        type="button"
                        onClick={() => {
                          setAccountOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={15} />
                        Sign Out
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
                        <Truck size={14} />
                        Track Order
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ===================================================
                MOBILE MENU BUTTON
            =================================================== */}
            <button
              type="button"
              className="lg:hidden flex items-center justify-center p-2 rounded-lg text-white bg-white/5 hover:bg-gold/10 hover:text-gold transition-all"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={25} /> : <Menu size={25} />}
            </button>
          </div>
        </div>

        {/* =======================================================
            MOBILE NAVIGATION
        ======================================================= */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-neutral-800 bg-obsidian-950 px-4 py-5 shadow-2xl animate-fadeIn">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search perfumes..."
                className="w-full rounded-lg border border-neutral-700 bg-obsidian-900 px-4 py-3 pr-11 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
              />

              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-gold"
                aria-label="Search"
              >
                <Search size={17} />
              </button>
            </form>

            {/* Mobile Links */}
            <nav className="flex flex-col gap-1 text-sm font-medium tracking-wide">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-lg text-white hover:text-gold hover:bg-gold/10 transition-colors"
              >
                Home
              </Link>

              <Link
                href="/products"
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-lg text-white hover:text-gold hover:bg-gold/10 transition-colors"
              >
                Shop Fragrances
              </Link>

              <Link
                href="/collections"
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-lg text-white hover:text-gold hover:bg-gold/10 transition-colors"
              >
                Curated Collections
              </Link>

              <Link
                href="/quiz"
                onClick={closeMobileMenu}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-gold hover:bg-gold/10 transition-colors"
              >
                <Sparkles size={16} />
                Scent Finder Quiz
              </Link>

              <Link
                href="/about"
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-lg text-white hover:text-gold hover:bg-gold/10 transition-colors"
              >
                Our Maison Story
              </Link>

              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-lg text-white hover:text-gold hover:bg-gold/10 transition-colors"
              >
                Boutiques & Concierge
              </Link>

              <Link
                href="/track-order"
                onClick={closeMobileMenu}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-white hover:text-gold hover:bg-gold/10 transition-colors"
              >
                <Truck size={16} />
                Live Order Tracking
              </Link>

              <Link
                href="/wishlist"
                onClick={closeMobileMenu}
                className="flex items-center justify-between px-4 py-3 rounded-lg text-white hover:text-gold hover:bg-gold/10 transition-colors"
              >
                <span>Wishlist</span>

                {wishlistCount > 0 && (
                  <span className="bg-gold text-obsidian-950 px-2 py-0.5 rounded-full text-xs font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account Section */}
              <div className="mt-3 pt-3 border-t border-neutral-800">
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={closeMobileMenu}
                      className="block px-4 py-3 rounded-lg text-gold hover:bg-gold/10 font-semibold transition-colors"
                    >
                      Dashboard ({session.user.name})
                    </Link>

                    {session.user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={closeMobileMenu}
                        className="block px-4 py-3 rounded-lg text-amber-400 hover:bg-amber-500/10 font-semibold transition-colors"
                      >
                        Admin Panel
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="block w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="btn-outline text-center text-xs py-2"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/register"
                      onClick={closeMobileMenu}
                      className="btn-primary text-center text-xs py-2"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

