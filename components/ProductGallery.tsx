"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({
  images,
  name,
}: {
  images: { url: string; altText: string | null }[];
  name: string;
}) {
  const list = images.length
    ? images
    : [{ url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=85", altText: name }];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Large Image Display */}
      <div className="card-shine relative aspect-square w-full overflow-hidden rounded-2xl border border-gold/30 bg-obsidian-950 shadow-2xl">
        <Image
          src={list[active].url}
          alt={list[active].altText || name}
          fill
          className="object-cover transition-transform duration-700 ease-out hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Thumbnails Row */}
      {list.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                i === active
                  ? "border-gold scale-105 shadow-gold-glow"
                  : "border-neutral-800 opacity-60 hover:opacity-100 hover:border-gold/50"
              }`}
            >
              <Image src={img.url} alt={img.altText || name} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
