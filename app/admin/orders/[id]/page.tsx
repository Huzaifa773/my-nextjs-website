import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusControls } from "@/components/admin/OrderStatusControls";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, address: true, payments: { orderBy: { createdAt: "desc" } }, user: { select: { name: true, email: true } } },
  });

  if (!order) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-serif text-3xl text-[#f5d061]">{order.orderNumber}</h1>

      <div className="rounded-sm border border-neutral-200 bg-black p-6">
        <OrderStatusControls orderId={order.id} initialOrderStatus={order.orderStatus} initialPaymentStatus={order.paymentStatus} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-sm border border-neutral-200 bg-black p-6 text-sm">
          <h2 className="mb-2 font-serif text-lg text-[#f5d061]">Customer</h2>
          <p>{order.customerName}</p>
          <p>{order.customerEmail}</p>
          <p>{order.customerPhone}</p>
        </div>
        <div className="rounded-sm border border-neutral-200 bg-black p-6 text-sm">
          <h2 className="mb-2 font-serif text-lg text-[#f5d061]">Shipping Address</h2>
          <p>{order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}</p>
          <p>{order.address.city}, {order.address.province} {order.address.postalCode}</p>
          <p>{order.address.country}</p>
        </div>
      </div>

      <div className="rounded-sm border border-neutral-200 bg-black p-6">
        <h2 className="mb-4 font-serif text-lg text-[#f5d061]">Items</h2>
        <div className="space-y-2 text-sm">
          {order.items.map((i) => (
            <div key={i.id} className="flex justify-between">
              <span>{i.name} × {i.quantity}</span>
              <span>{formatCurrency(Number(i.price) * i.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-neutral-200 pt-2 font-semibold">
            <span>Total</span><span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-neutral-200 bg-black p-6">
        <h2 className="mb-4 font-serif text-lg text-[#f5d061]">Payment Attempts</h2>
        {order.payments.map((p) => (
          <div key={p.id} className="border-b border-neutral-100 py-2 text-sm">
            <div className="flex justify-between">
              <span>{p.method.replace("_", " ")}</span>
              <span className="font-medium">{p.status}</span>
            </div>
            {p.gatewayReference && <p className="text-xs text-neutral-500">Ref: {p.gatewayReference}</p>}
            {p.proofImageUrl && (
              <a href={p.proofImageUrl} target="_blank" rel="noreferrer" className="text-xs text-gold hover:underline">
                View proof →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
