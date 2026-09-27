export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id }, include: { images: { orderBy: { position: "asc" } } } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-charcoal">Edit Product</h1>
      <ProductForm
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        initial={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: String(product.price),
          discountPrice: product.discountPrice ? String(product.discountPrice) : "",
          brand: product.brand,
          size: product.size,
          fragranceType: product.fragranceType,
          sku: product.sku,
          stock: String(product.stock),
          categoryId: product.categoryId,
          isFeatured: product.isFeatured,
          isBestSeller: product.isBestSeller,
          isNewArrival: product.isNewArrival,
          isActive: product.isActive,
          imagesText: product.images.map((i) => i.url).join(", "),
        }}
      />
    </div>
  );
}


