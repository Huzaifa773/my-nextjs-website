export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJazzCashCallback } from "@/lib/payments/jazzcash";

// JazzCash POSTs back to this URL (JAZZCASH_RETURN_URL) with pp_* fields
// after the customer completes or cancels payment on their hosted page.
export async function POST(req: Request) {
  const formData = await req.formData();
  const fields: Record<string, string> = {};
  formData.forEach((value, key) => {
    fields[key] = String(value);
  });

  const isValid = verifyJazzCashCallback(fields);
  const orderNumber = fields.pp_TxnRefNo;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { payments: { where: { method: "JAZZCASH" }, orderBy: { createdAt: "desc" } } },
  });

  const redirectBase = process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (!order) {
    return NextResponse.redirect(`${redirectBase}/`);
  }

  const payment = order.payments[0];

  if (!isValid) {
    // The signature didn't match â€” never trust this response.
    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED", gatewayRawResponse: fields as any },
      });
    }
    return NextResponse.redirect(`${redirectBase}/order-confirmation/${order.id}`);
  }

  const success = fields.pp_ResponseCode === "000";

  if (payment) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: success ? "SUCCESS" : "FAILED",
        gatewayTxnId: fields.pp_RetreivalReferenceNo || fields.pp_TxnRefNo,
        gatewayRawResponse: fields as any,
      },
    });
  }

  if (success) {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "PAID", orderStatus: "CONFIRMED" },
    });
  } else {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "FAILED" },
    });
  }

  return NextResponse.redirect(`${redirectBase}/order-confirmation/${order.id}`);
}

