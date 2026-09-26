import crypto from "crypto";

// ============================================================
// Safepay (Checkout API + Webhooks)
// Docs: https://docs.getsafepay.com/
//
// Unlike JazzCash/Easypaisa, Safepay uses a modern REST API: we create a
// "checkout session" server-side with our API key, get back a redirect
// URL, and send the customer there. Safepay later notifies us via a
// webhook (server-to-server), which we must verify using an HMAC
// signature before trusting it — never mark an order paid purely because
// the customer's browser came back to our "return" URL.
// ============================================================

const SANDBOX_BASE = "https://sandbox.api.getsafepay.com";
const PRODUCTION_BASE = "https://api.getsafepay.com";

function getBaseUrl() {
  return process.env.SAFEPAY_ENV === "production" ? PRODUCTION_BASE : SANDBOX_BASE;
}

export function isSafepayConfigured() {
  return Boolean(process.env.SAFEPAY_API_KEY && process.env.SAFEPAY_SECRET_KEY);
}

/** Creates a hosted checkout session and returns the URL to redirect the customer to. */
export async function createSafepayCheckoutSession({
  orderId,
  amountInPkr,
  customerEmail,
}: {
  orderId: string;
  amountInPkr: number;
  customerEmail: string;
}) {
  const apiKey = process.env.SAFEPAY_API_KEY || "";
  const returnUrl = process.env.SAFEPAY_RETURN_URL || "";
  const webhookUrl = process.env.SAFEPAY_WEBHOOK_URL || "";

  const res = await fetch(`${getBaseUrl()}/order/v1/init`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      merchant_api_key: apiKey,
      intent: "CYBERSOURCE",
      mode: "payment",
      currency: "PKR",
      amount: Math.round(amountInPkr * 100), // smallest currency unit
      order_id: orderId,
      customer_email: customerEmail,
      success_url: `${returnUrl}?orderId=${orderId}&status=success`,
      cancel_url: `${returnUrl}?orderId=${orderId}&status=cancelled`,
      webhook_url: webhookUrl,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Safepay session creation failed: ${text}`);
  }

  const data = await res.json();
  // Field name per Safepay's docs at time of writing; confirm against the
  // current API version in your dashboard.
  return data?.data?.checkout_url as string;
}

/** Verifies the HMAC signature Safepay sends in the webhook request header. */
export function verifySafepayWebhookSignature(rawBody: string, signatureHeader: string | null) {
  if (!signatureHeader) return false;
  const secret = process.env.SAFEPAY_WEBHOOK_SECRET || "";
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
  } catch {
    return false;
  }
}
