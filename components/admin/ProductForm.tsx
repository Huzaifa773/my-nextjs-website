"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export interface CategoryOption { id: string; name: string; }

export interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  brand: string;
  size: string;
  fragranceType: string;
  sku: string;
  stock: string;
  categoryId: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  imagesText: string;
}

const FRAGRANCE_TYPES = [
  "EAU_DE_PARFUM", "EAU_DE_TOILETTE", "EAU_DE_COLOGNE", "PARFUM_EXTRAIT", "ATTAR", "BODY_MIST",
];

const emptyForm: ProductFormData = {
  name: "", description: "", price: "", discountPrice: "", brand: "", size: "",
  fragranceType: "EAU_DE_PARFUM", sku: "", stock: "0", categoryId: "",
  isFeatured: false, isBestSeller: false, isNewArrival: false, isActive: true, imagesText: "",
};

export function ProductForm({ categories, initial }: { categories: CategoryOption[]; initial?: ProductFormData }) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>(initial || { ...emptyForm, categoryId: categories[0]?.id || "" });
  const [loading, setLoading] = useState(false);

  function update<K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
        brand: form.brand,
        size: form.size,
        fragranceType: form.fragranceType,
        sku: form.sku,
        stock: parseInt(form.stock, 10),
        categoryId: form.categoryId,
        isFeatured: form.isFeatured,
        isBestSeller: form.isBestSeller,
        isNewArrival: form.isNewArrival,
        isActive: form.isActive,
        images: form.imagesText.split(",").map((s) => s.trim()).filter(Boolean),
      };

      const url = form.id ? `/api/admin/products/${form.id}` : "/api/admin/products";
      const method = form.id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");

      toast.success(form.id ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 rounded-sm border border-neutral-200 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Product Name</label>
          <input required value={form.name} onChange={(e) => update("name", e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">SKU</label>
          <input required value={form.sku} onChange={(e) => update("sku", e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Brand</label>
          <input required value={form.brand} onChange={(e) => update("brand", e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Category</label>
          <select required value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)} className="input-field">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Price (PKR)</label>
          <input required type="number" step="0.01" value={form.price} onChange={(e) => update("price", e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Discount Price (optional)</label>
          <input type="number" step="0.01" value={form.discountPrice} onChange={(e) => update("discountPrice", e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Size</label>
          <input required placeholder="e.g. 100ml" value={form.size} onChange={(e) => update("size", e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Fragrance Type</label>
          <select value={form.fragranceType} onChange={(e) => update("fragranceType", e.target.value)} className="input-field">
            {FRAGRANCE_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Stock Quantity</label>
          <input required type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)} className="input-field" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-charcoal">Description</label>
        <textarea required rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} className="input-field" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-charcoal">Image URLs (comma-separated)</label>
        <textarea rows={2} value={form.imagesText} onChange={(e) => update("imagesText", e.target.value)} className="input-field" placeholder="https://.../1.jpg, https://.../2.jpg" />
      </div>

      <div className="flex flex-wrap gap-6">
        {([
          ["isFeatured", "Featured Product"],
          ["isBestSeller", "Best Seller"],
          ["isNewArrival", "New Arrival"],
          ["isActive", "Active (visible on store)"],
        ] as const).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form[key]} onChange={(e) => update(key, e.target.checked)} />
            {label}
          </label>
        ))}
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading && <Loader2 size={16} className="animate-spin" />}
        {form.id ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}
