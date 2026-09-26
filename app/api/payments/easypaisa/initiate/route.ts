import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildEasypaisaFields, getEasypaisaUrl, isEasypaisaConfigured } from "@/lib/payments/easypaisa";

function notConfiguredPage(orderId: string) {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:600px;margin:80px auto;text-align:center">
    <h2>Easypaisa is not configured yet</h2>
    <p>Set EASYPAISA_STORE_ID and EASYPAISA_HASH_KEY in your .env file to enable live payments.</p>
    <a href="/order-confirmation/${orderId}">Back to your order</a>
  </body></html>`;
}

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
  if (order.paymentMethod !== "EASYPAISA") {
    return NextResponse.json({ error: "This order is not an Easypaisa order" }, { status: 400 });
  }

  if (!isEasypaisaConfigured()) {
    return new NextResponse(notConfiguredPage(orderId), { headers: { "Content-Type": "text/html" } });
  }

  const fields = buildEasypaisaFields({
    orderId: order.orderNumber,
    amountInPkr: Number(order.total),
    description: `Order ${order.orderNumber} - Maison Charcoal`,
  });

  const inputs = Object.entries(fields)
    .map(([key, value]) => `<input type="hidden" name="${key}" value="${String(value).replace(/"/g, "&quot;")}" />`)
    .join("\n");

  const html = `<!DOCTYPE html>
  <html><body onload="document.forms[0].submit()">
    <p style="font-family:sans-serif;text-align:center;margin-top:80px">Redirecting to Easypaisa...</p>
    <form method="POST" action="${getEasypaisaUrl()}">
      ${inputs}
    </form>
  </body></html>`;

  return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
}
