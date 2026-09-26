"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X, Sparkles } from "lucide-react";

const CATEGORIES = [
  { name: "All Fragrances", slug: "" },
  { name: "Men's Perfumes", slug: "mens-perfumes" },
  { name: "Women's Perfumes", slug: "womens-perfumes" },
  { name: "Unisex Perfumes", slug: "unisex-perfumes" },
  { name: "Royal Oud", slug: "oud" },
  { name: "Traditional Attar", slug: "attar" },
  { name: "Prestige Gift Sets", slug: "gift-sets" },
  { name: "Private Reserve", slug: "premium-collection" },
];

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    router.push(pathname);
  }

  const activeCategory = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const hasActiveFilters = Boolean(activeCategory || minPrice || maxPrice || searchParams.get("search"));

  return (
    <div className="mb-10 space-y-5 rounded-2xl bg-obsidian-900/60 border border-neutral-800 p-5 md:p-6 backdrop-blur-md">
      {/* Top Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gold md:hidden"
        >
          <SlidersHorizontal size={15} /> {open ? "Hide Filters" : "Filter Catalog"}
        </button>

        <div className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest text-gold font-semibold">
          <Sparkles size={14} /> Refine By Category
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-gold transition-colors"
            >
              <X size={14} /> Clear Filters
            </button>
          )}

          <select
            value={searchParams.get("sort") || "newest"}
            onChange={(e) => setParam("sort", e.target.value)}
            className="rounded-lg border border-neutral-700 bg-obsidian-800 px-3.5 py-2 text-xs font-medium text-ivory focus:outline-none focus:border-gold"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className={`${open ? "flex" : "hidden"} flex-wrap gap-2 md:flex`}>
        {CATEGORIES.map((c) => {
          const active = activeCategory === c.slug;
          return (
            <button
              key={c.slug || "all"}
              onClick={() => setParam("category", c.slug)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide transition-all duration-300 ${
                active
                  ? "border-gold bg-gradient-to-r from-gold to-gold-400 text-obsidian-950 font-bold shadow-gold-glow"
                  : "border-neutral-800 bg-obsidian-800/80 text-neutral-300 hover:border-gold/50 hover:text-gold"
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {/* Price Range Filter */}
      <div className={`${open ? "flex" : "hidden"} items-center gap-3 border-t border-neutral-800/80 pt-4 md:flex text-xs`}>
        <span className="text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">Price Range (PKR):</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min PKR"
            defaultValue={minPrice}
            onBlur={(e) => setParam("minPrice", e.target.value)}
            className="w-28 rounded-lg border border-neutral-700 bg-obsidian-800 px-3 py-1.5 text-xs text-ivory placeholder:text-neutral-500 focus:outline-none focus:border-gold"
          />
          <span className="text-neutral-500">–</span>
          <input
            type="number"
            placeholder="Max PKR"
            defaultValue={maxPrice}
            onBlur={(e) => setParam("maxPrice", e.target.value)}
            className="w-28 rounded-lg border border-neutral-700 bg-obsidian-800 px-3 py-1.5 text-xs text-ivory placeholder:text-neutral-500 focus:outline-none focus:border-gold"
          />
        </div>
      </div>
    </div>
  );
}
