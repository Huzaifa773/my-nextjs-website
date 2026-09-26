"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, ShieldCheck, Truck, Sparkles, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-obsidian-950 border-t border-gold/20 text-neutral-300">
      {/* Trust Badges Strip */}
      <div className="border-b border-neutral-800/80 bg-obsidian-900/50 py-8 px-4 md:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <Truck className="h-8 w-8 text-gold flex-shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ivory">Complimentary Delivery</p>
              <p className="text-[11px] text-neutral-400">On all orders exceeding PKR 15,000</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-gold flex-shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ivory">100% Authentic Guarantee</p>
              <p className="text-[11px] text-neutral-400">Directly sourced French & Oriental oils</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-gold flex-shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ivory">Complimentary Vials</p>
              <p className="text-[11px] text-neutral-400">2 discovery samples with each order</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-gold flex-shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ivory">VIP Concierge Care</p>
              <p className="text-[11px] text-neutral-400">Personalized scent advice 7 days/week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-5 md:px-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full border border-gold/50 bg-gold/20 flex items-center justify-center text-gold font-serif text-sm font-bold shadow-gold-glow">
              MC
            </div>
            <span className="font-serif text-xl tracking-[0.2em] font-semibold text-ivory">
              MAISON <span className="text-gold">CHARCOAL</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-neutral-400 max-w-sm">
            Maison Charcoal is an artisanal fragrance house creating extraits de parfum, rare Cambodian ouds,
            and pure concentrated attars. Designed for those who appreciate timeless distinction.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="h-9 w-9 rounded-full bg-obsidian-800 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-gold hover:border-gold transition-colors">
              <Instagram size={16} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="h-9 w-9 rounded-full bg-obsidian-800 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-gold hover:border-gold transition-colors">
              <Facebook size={16} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="h-9 w-9 rounded-full bg-obsidian-800 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-gold hover:border-gold transition-colors">
              <Twitter size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gold">The House</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/" className="hover:text-gold transition-colors">Home Experience</Link></li>
            <li><Link href="/about" className="hover:text-gold transition-colors">Artisanal Heritage</Link></li>
            <li><Link href="/collections" className="hover:text-gold transition-colors">Exclusive Collections</Link></li>
            <li><Link href="/quiz" className="hover:text-gold transition-colors">Scent Consultation Quiz</Link></li>
            <li><Link href="/contact" className="hover:text-gold transition-colors">Boutiques & Concierge</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gold">Catalog</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/products" className="hover:text-gold transition-colors">All Perfumes</Link></li>
            <li><Link href="/products?category=mens-perfumes" className="hover:text-gold transition-colors">Men's Extrait</Link></li>
            <li><Link href="/products?category=womens-perfumes" className="hover:text-gold transition-colors">Women's Collection</Link></li>
            <li><Link href="/products?category=oud" className="hover:text-gold transition-colors">Royal Oud Oils</Link></li>
            <li><Link href="/products?category=attar" className="hover:text-gold transition-colors">Traditional Attar</Link></li>
            <li><Link href="/products?category=gift-sets" className="hover:text-gold transition-colors">Prestige Gift Boxes</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gold">Client Services</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/dashboard" className="hover:text-gold transition-colors">VIP Dashboard</Link></li>
            <li><Link href="/dashboard/orders" className="hover:text-gold transition-colors">Order History</Link></li>
            <li><Link href="/track-order" className="hover:text-gold transition-colors">Track Your Shipment</Link></li>
            <li><Link href="/wishlist" className="hover:text-gold transition-colors">Saved Fragrances</Link></li>
            <li><Link href="/cart" className="hover:text-gold transition-colors">Shopping Bag</Link></li>
            <li><Link href="/contact#faq" className="hover:text-gold transition-colors">Delivery & Returns FAQ</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800/80 bg-obsidian-950 py-6 px-4 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} Maison Charcoal Haute Parfumerie. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Karachi &bull; Lahore &bull; Islamabad</span>
            <span>Secure Cash on Delivery &bull; Bank Transfer &bull; JazzCash</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
