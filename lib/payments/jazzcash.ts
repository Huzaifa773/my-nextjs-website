import crypto from "crypto";

// ============================================================
// JazzCash Page Redirection API
// Docs: https://sandbox.jazzcash.com.pk/Sandbox/ (merchant portal has the
// exact field list for your account type — confirm field names there
// before going live, since JazzCash occasionally revises them).
//
// How it works:
// 1. We build a set of pp_* fields describing the transaction.
// 2. We compute pp_SecureHash = HMAC-SHA256(sorted "&"-joined pp_* values,
//    key = JAZZCASH_INTEGRITY_SALT) — this is JazzCash's required signing method.
// 3. The browser is auto-submitted (via a real HTML <form>, not fetch) to
//    JazzCash's hosted payment page with these fields.
// 4. JazzCash redirects the customer back to JAZZCASH_RETURN_URL with the
//    result fields + its own pp_SecureHash, which we must re-verify before
//    trusting the response (see verifyJazzCashHash).
// ============================================================

const SANDBOX_URL = "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/";
const PRODUCTION_URL = "https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/";

export function getJazzCashUrl() {
  return process.env.JAZZCASH_ENV === "production" ? PRODUCTION_URL : SANDBOX_URL;
}

function computeSecureHash(fields: Record<string, string>, integritySalt: string) {
  // JazzCash spec: sort keys alphabetically, concatenate non-empty values
  // with "&", prefix the integrity salt, then HMAC-SHA256 the whole string.
  const sortedKeys = Object.keys(fields).sort();
  const valueString = sortedKeys
    .filter((k) => fields[k] !== undefined && fields[k] !== "")
    .map((k) => fields[k])
    .join("&");
  const hmac = crypto.createHmac("sha256", integritySalt);
  hmac.update(`${integritySalt}&${valueString}`);
  return hmac.digest("hex").toUpperCase();
}

export function buildJazzCashFields({
  orderId,
  amountInPkr,
  description,
}: {
  orderId: string;
  amountInPkr: number;
  description: string;
}) {
  const merchantId = process.env.JAZZCASH_MERCHANT_ID || "";
  const password = process.env.JAZZCASH_PASSWORD || "";
  const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT || "";
  const returnUrl = process.env.JAZZCASH_RETURN_URL || "";

  const now = new Date();
  const txnDateTime = now.toISOString().replace(/[-:T.Z]/g, "").slice(0, 14); // yyyyMMddHHmmss
  const expiry = new Date(now.getTime() + 1000 * 60 * 60);
  const txnExpiryDateTime = expiry.toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);

  // Amount must be in paisa (smallest unit), no decimal point, per JazzCash spec.
  const amountInPaisa = String(Math.round(amountInPkr * 100));

  const fields: Record<string, string> = {
    pp_Version: "1.1",
    pp_TxnType: "MWALLET",
    pp_Language: "EN",
    pp_MerchantID: merchantId,
    pp_Password: password,
    pp_TxnRefNo: orderId,
    pp_Amount: amountInPaisa,
    pp_TxnCurrency: "PKR",
    pp_TxnDateTime: txnDateTime,
    pp_TxnExpiryDateTime: txnExpiryDateTime,
    pp_BillReference: orderId,
    pp_Description: description.slice(0, 100),
    pp_ReturnURL: returnUrl,
  };

  fields.pp_SecureHash = computeSecureHash(fields, integritySalt);
  return fields;
}

/** Re-verifies the pp_SecureHash JazzCash sends back on the callback, so we
 * never trust a callback that wasn't actually signed by JazzCash. */
export function verifyJazzCashCallback(fields: Record<string, string>) {
  const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT || "";
  const { pp_SecureHash, ...rest } = fields;
  const expected = computeSecureHash(rest, integritySalt);
  return expected === pp_SecureHash;
}

export function isJazzCashConfigured() {
  return Boolean(
    process.env.JAZZCASH_MERCHANT_ID &&
      process.env.JAZZCASH_PASSWORD &&
      process.env.JAZZCASH_INTEGRITY_SALT
  );
}
