"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];

export function OrderStatusControls({
  orderId,
  initialOrderStatus,
  initialPaymentStatus,
}: {
  orderId: string;
  initialOrderStatus: string;
  initialPaymentStatus: string;
}) {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState(initialOrderStatus);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus, paymentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update order");
      toast.success("Order updated");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500">Order Status</label>
        <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="input-field">
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500">Payment Status</label>
        <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="input-field">
          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <button onClick={save} disabled={loading} className="btn-primary">
        {loading && <Loader2 size={16} className="animate-spin" />} Save
      </button>
    </div>
  );
}
