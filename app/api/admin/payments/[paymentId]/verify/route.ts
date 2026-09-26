import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ decision: z.enum(["APPROVE", "REJECT"]) });

// Admin-only manual verification for Bank Transfer (or a stuck gateway
// payment) — this is the ONLY place a payment can be marked PAID without a
// verified gateway signature, and it requires an authenticated admin.
export async function POST(req: Request, { params }: { params: { paymentId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const payment = await prisma.payment.findUnique({ where: { id: params.paymentId }, include: { order: true } });
  if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });

  const approved = parsed.data.decision === "APPROVE";

  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: approved ? "SUCCESS" : "FAILED",
      verifiedById: session.user.id,
      verifiedAt: new Date(),
    },
  });

  await prisma.order.update({
    where: { id: payment.orderId },
    data: approved
      ? { paymentStatus: "PAID", orderStatus: "CONFIRMED" }
      : { paymentStatus: "FAILED" },
  });

  return NextResponse.json({ payment: updatedPayment });
}
