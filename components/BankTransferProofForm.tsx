"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function BankTransferProofForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [proofImageUrl, setProofImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/payments/bank-transfer/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, reference, proofImageUrl: proofImageUrl || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      toast.success("Submitted. Our team will verify your payment shortly.");
      setSubmitted(true);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <p className="text-sm text-green-700">
        Your transaction reference has been submitted. Our team will verify it and update your order status soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-charcoal">Transaction Reference / ID</label>
        <input required value={reference} onChange={(e) => setReference(e.target.value)} className="input-field" placeholder="e.g. TXN123456789" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-charcoal">Receipt Image URL (optional)</label>
        <input value={proofImageUrl} onChange={(e) => setProofImageUrl(e.target.value)} className="input-field" placeholder="https://..." />
        <p className="mt-1 text-xs text-neutral-500">
          Upload your receipt to an image host and paste the link here, or leave blank and just provide the reference.
        </p>
      </div>
      <button type="submit" disabled={loading} className="btn-primary text-sm">
        {loading && <Loader2 size={16} className="animate-spin" />}
        Submit for Verification
      </button>
    </form>
  );
}
