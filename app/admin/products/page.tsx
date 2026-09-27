export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductsTable } from "@/components/admin/ProductsTable";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true, images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    price: Number(p.price),
    stock: p.stock,
    isActive: p.isActive,
    createdAt: p.createdAt.toISOString(),
    category: { name: p.category.name },
    images: p.images,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-charcoal">Products</h1>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus size={16} /> Add Product
        </Link>
      </div>
      <ProductsTable products={rows} />
    </div>
  );
}


