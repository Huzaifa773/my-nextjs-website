export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySafepayWebhookSignature } from "@/lib/payments/safepay";

// Safepay calls this URL directly from their servers (not the customer's
// browser), which is why webhook signature verification is the only thing
// that can be trusted here â€” never mark an order paid based on a browser
// redirect alone.
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-sfpy-signature") || req.headers.get("x-safepay-signature");

  if (!verifySafepayWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  // Field names follow Safepay's typical webhook payload shape; confirm
  // against the current version in your Safepay dashboard.
  const orderNumber: string | undefined = payload?.data?.order_id || payload?.order_id;
  const eventStatus: string | undefined = payload?.event || payload?.data?.state;

  if (!orderNumber) {
    return NextResponse.json({ error: "Missing order reference" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { payments: { where: { method: "SAFEPAY" }, orderBy: { createdAt: "desc" } } },
  });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const payment = order.payments[0];
  const success = eventStatus === "TRACKER_COMPLETED" || eventStatus === "PAID" || eventStatus === "captured";

  if (payment) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: success ? "SUCCESS" : "FAILED",
        gatewayTxnId: payload?.data?.tracker || payload?.tracker,
        gatewayRawResponse: payload,
      },
    });
  }

  await prisma.order.update({
    where: { id: order.id },
    data: success
      ? { paymentStatus: "PAID", orderStatus: "CONFIRMED" }
      : { paymentStatus: "FAILED" },
  });

  return NextResponse.json({ received: true });
}

