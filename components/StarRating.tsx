import { Star } from "lucide-react";

export function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= Math.round(rating) ? "fill-gold text-gold" : "fill-none text-neutral-300"}
        />
      ))}
      {typeof count === "number" && (
        <span className="ml-1 text-xs text-neutral-500">({count})</span>
      )}
    </div>
  );
}
