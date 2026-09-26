import { prisma } from "@/lib/prisma";
import { PaymentsTable } from "@/components/admin/PaymentsTable";

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: { order: { select: { orderNumber: true, customerName: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const rows = payments.map((p) => ({
    id: p.id,
    method: p.method,
    status: p.status,
    amount: Number(p.amount),
    gatewayReference: p.gatewayReference,
    proofImageUrl: p.proofImageUrl,
    createdAt: p.createdAt.toISOString(),
    order: p.order,
  }));

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-charcoal">Payments</h1>
      <p className="text-sm text-neutral-500">
        Bank transfer payments require manual review — approve only after confirming the funds actually arrived.
      </p>
      <PaymentsTable payments={rows} />
    </div>
  );
}
