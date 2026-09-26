import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  orderId: z.string(),
  reference: z.string().min(2, "Enter your transaction reference"),
  proofImageUrl: z.string().url().optional(),
});

// The customer submits their bank transfer reference (and optionally a
// receipt image URL) here. This ONLY moves the payment into
// AWAITING_VERIFICATION — it never marks the order as paid. An admin must
// manually review and approve it via /api/admin/payments/[paymentId]/verify.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message || "Invalid input" }, { status: 400 });
  }
  const { orderId, reference, proofImageUrl } = parsed.data;

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { payments: true } });
  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.paymentMethod !== "BANK_TRANSFER") {
    return NextResponse.json({ error: "This order is not a bank transfer order" }, { status: 400 });
  }

  const payment = order.payments[0];
  if (!payment) {
    return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
  }

  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: "AWAITING_VERIFICATION",
      gatewayReference: reference,
      proofImageUrl,
    },
  });

  return NextResponse.json({ payment: updated });
}
