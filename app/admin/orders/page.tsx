export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-charcoal">Orders</h1>
      <div className="overflow-x-auto rounded-sm border border-neutral-200 bg-white">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Payment Status</th>
              <th className="px-4 py-3">Order Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="cursor-pointer border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium text-gold hover:underline">{o.orderNumber}</Link>
                </td>
                <td className="px-4 py-3">{o.customerName}</td>
                <td className="px-4 py-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">{formatCurrency(Number(o.total))}</td>
                <td className="px-4 py-3">{o.paymentMethod.replace("_", " ")}</td>
                <td className="px-4 py-3">{o.paymentStatus}</td>
                <td className="px-4 py-3">{o.orderStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


