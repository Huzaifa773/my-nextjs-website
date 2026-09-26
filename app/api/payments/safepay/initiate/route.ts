import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSafepayCheckoutSession, isSafepayConfigured } from "@/lib/payments/safepay";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.redirect(new URL("/login", req.url));

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  if (!orderId) return NextResponse.json({ error: "orderId is required" }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.paymentMethod !== "SAFEPAY") {
    return NextResponse.json({ error: "This order is not a Safepay order" }, { status: 400 });
  }

  const redirectBase = process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (!isSafepayConfigured()) {
    const html = `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:600px;margin:80px auto;text-align:center">
      <h2>Safepay is not configured yet</h2>
      <p>Set SAFEPAY_API_KEY, SAFEPAY_SECRET_KEY and SAFEPAY_WEBHOOK_SECRET in your .env file to enable live card payments.</p>
      <a href="/order-confirmation/${orderId}">Back to your order</a>
    </body></html>`;
    return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
  }

  try {
    const checkoutUrl = await createSafepayCheckoutSession({
      orderId: order.orderNumber,
      amountInPkr: Number(order.total),
      customerEmail: order.customerEmail,
    });
    return NextResponse.redirect(checkoutUrl);
  } catch (err) {
    console.error("Safepay session error:", err);
    return NextResponse.redirect(`${redirectBase}/order-confirmation/${order.id}`);
  }
}
