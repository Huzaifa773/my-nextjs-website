"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Loader2, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { alertConfirm, alertToast, alertError } from "@/lib/alerts";

export interface AdminProductRow {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  category: { name: string };
  images: { url: string }[];
}

export function ProductsTable({ products }: { products: AdminProductRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rows, setRows] = useState(products);

  async function handleDelete(id: string, name: string) {
    const confirmed = await alertConfirm(
      "Deactivate / Delete Product?",
      `Are you sure you wish to remove <strong>${name}</strong> from active sales?`,
      "Yes, Delete",
      "Cancel"
    );
    if (!confirmed) return;

    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      if (data.softDeleted) {
        alertToast("Product has historical orders — deactivated instead", "info");
        setRows((r) => r.map((p) => (p.id === id ? { ...p, isActive: false } : p)));
      } else {
        setRows((r) => r.filter((p) => p.id !== id));
        alertToast("Product removed from catalog", "success");
      }
      router.refresh();
    } catch (err: any) {
      alertError("Failed", err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-obsidian-900/80 backdrop-blur-md shadow-2xl">
      <table className="w-full min-w-[700px] text-xs">
        <thead className="border-b border-neutral-800 bg-obsidian-950/80 text-left uppercase tracking-wider text-gold font-semibold">
          <tr>
            <th className="px-4 py-3.5">Flacon</th>
            <th className="px-4 py-3.5">Fragrance Title</th>
            <th className="px-4 py-3.5">Category</th>
            <th className="px-4 py-3.5">Retail Price</th>
            <th className="px-4 py-3.5">Stock</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/80">
          {rows.map((p) => (
            <tr key={p.id} className="transition-colors hover:bg-gold/5">
              <td className="px-4 py-3">
                <img
                  src={p.images[0]?.url || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=100&q=80"}
                  alt={p.name}
                  className="h-11 w-11 rounded-lg border border-gold/20 object-cover"
                />
              </td>
              <td className="px-4 py-3">
                <p className="font-serif font-bold text-sm text-ivory">{p.name}</p>
                <p className="text-[10px] font-mono text-neutral-400">{p.sku}</p>
              </td>
              <td className="px-4 py-3 text-neutral-300">{p.category.name}</td>
              <td className="px-4 py-3 font-serif font-semibold text-gold-200">{formatCurrency(p.price)}</td>
              <td className="px-4 py-3">
                <span
                  className={`font-mono font-bold ${
                    p.stock <= 5 ? "text-red-400" : "text-neutral-300"
                  }`}
                >
                  {p.stock}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    p.isActive
                      ? "bg-emerald-950 border border-emerald-500/40 text-emerald-400"
                      : "bg-neutral-800 border border-neutral-700 text-neutral-400"
                  }`}
                >
                  {p.isActive ? "Active" : "Archived"}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-3">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-gold hover:bg-white/5 transition-colors"
                    title="Edit Product"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    disabled={busyId === p.id}
                    onClick={() => handleDelete(p.id, p.name)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                    title="Delete"
                  >
                    {busyId === p.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
