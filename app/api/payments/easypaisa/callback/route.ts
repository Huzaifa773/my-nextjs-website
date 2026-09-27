export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyEasypaisaCallback } from "@/lib/payments/easypaisa";

export async function POST(req: Request) {
  const formData = await req.formData();
  const fields: Record<string, string> = {};
  formData.forEach((value, key) => {
    fields[key] = String(value);
  });

  const isValid = verifyEasypaisaCallback(fields);
  const orderNumber = fields.orderId;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { payments: { where: { method: "EASYPAISA" }, orderBy: { createdAt: "desc" } } },
  });

  const redirectBase = process.env.NEXTAUTH_URL || "http://localhost:3000";
  if (!order) return NextResponse.redirect(`${redirectBase}/`);

  const payment = order.payments[0];

  if (!isValid) {
    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED", gatewayRawResponse: fields as any },
      });
    }
    return NextResponse.redirect(`${redirectBase}/order-confirmation/${order.id}`);
  }

  // Easypaisa typically returns a "status"/"responseCode" style field â€”
  // confirm the exact success indicator name against your onboarding docs.
  const success = fields.status === "0000" || fields.responseCode === "0000";

  if (payment) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: success ? "SUCCESS" : "FAILED",
        gatewayTxnId: fields.transactionId || fields.orderId,
        gatewayRawResponse: fields as any,
      },
    });
  }

  await prisma.order.update({
    where: { id: order.id },
    data: success
      ? { paymentStatus: "PAID", orderStatus: "CONFIRMED" }
      : { paymentStatus: "FAILED" },
  });

  return NextResponse.redirect(`${redirectBase}/order-confirmation/${order.id}`);
}

