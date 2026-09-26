import crypto from "crypto";

// ============================================================
// Easypaisa Open API (Page Redirection / MA account model)
// Docs: merchant docs are issued directly by Telenor Microfinance Bank
// once you're onboarded — field names below follow their commonly
// published integration guide. Confirm exact field names/casing with
// your onboarding documentation before going live.
//
// Flow mirrors JazzCash: build signed fields → auto-submit HTML form to
// Easypaisa's hosted page → customer redirected back to our callback with
// a hash we re-verify before trusting the result.
// ============================================================

const SANDBOX_URL = "https://easypay.easypaisa.com.pk/easypay/Index.jsf";
const PRODUCTION_URL = "https://easypay.easypaisa.com.pk/easypay/Index.jsf"; // Telenor issues a distinct production host at onboarding

export function getEasypaisaUrl() {
  return process.env.EASYPAISA_ENV === "production" ? PRODUCTION_URL : SANDBOX_URL;
}

function computeHash(fields: Record<string, string>, hashKey: string) {
  const sortedKeys = Object.keys(fields).sort();
  const valueString = sortedKeys
    .filter((k) => fields[k] !== undefined && fields[k] !== "")
    .map((k) => `${k}=${fields[k]}`)
    .join("&");
  return crypto.createHmac("sha256", hashKey).update(valueString).digest("hex");
}

export function buildEasypaisaFields({
  orderId,
  amountInPkr,
  description,
}: {
  orderId: string;
  amountInPkr: number;
  description: string;
}) {
  const storeId = process.env.EASYPAISA_STORE_ID || "";
  const hashKey = process.env.EASYPAISA_HASH_KEY || "";
  const returnUrl = process.env.EASYPAISA_RETURN_URL || "";

  const expiryDate = new Date(Date.now() + 1000 * 60 * 60);
  const expiryDateStr = expiryDate.toISOString().slice(0, 10).replace(/-/g, ""); // yyyyMMdd

  const fields: Record<string, string> = {
    storeId,
    orderId,
    transactionAmount: amountInPkr.toFixed(2),
    transactionType: "MA",
    tokenExpiry: expiryDateStr,
    bankIdentificationNumber: "",
    postBackURL: returnUrl,
    orderRefNum: orderId,
    autoRedirect: "1",
    merchantHashedReq: "", // filled below
  };

  fields.merchantHashedReq = computeHash(
    { orderId, storeId, transactionAmount: fields.transactionAmount },
    hashKey
  );

  return fields;
}

export function verifyEasypaisaCallback(fields: Record<string, string>) {
  const hashKey = process.env.EASYPAISA_HASH_KEY || "";
  const { merchantHashedReq, ...rest } = fields;
  const expected = computeHash(
    { orderId: rest.orderId, storeId: rest.storeId, transactionAmount: rest.transactionAmount },
    hashKey
  );
  return expected === merchantHashedReq;
}

export function isEasypaisaConfigured() {
  return Boolean(process.env.EASYPAISA_STORE_ID && process.env.EASYPAISA_HASH_KEY);
}
