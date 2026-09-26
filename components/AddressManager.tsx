"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Star, Loader2, Sparkles, MapPin } from "lucide-react";
import { alertConfirm, alertSuccess, alertToast, alertError } from "@/lib/alerts";

export interface AddressItem {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const empty = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "Karachi",
  province: "Sindh",
  postalCode: "",
  country: "Pakistan",
};

export function AddressManager({ initialAddresses }: { initialAddresses: AddressItem[] }) {
  const router = useRouter();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add address");
      setAddresses((a) => [data.address, ...a]);
      setForm(empty);
      setShowForm(false);
      await alertSuccess("Address Registered", "Your delivery destination has been added to your profile.");
      router.refresh();
    } catch (err: any) {
      alertError("Failed to Save Address", err.message);
    } finally {
      setLoading(false);
    }
  }

  async function setDefault(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
      alertToast("Default address updated", "success");
      router.refresh();
    } catch {
      alertError("Failed", "Could not update default address.");
    } finally {
      setBusyId(null);
    }
  }

  async function removeAddress(id: string) {
    const confirmed = await alertConfirm(
      "Remove Address?",
      "Are you sure you wish to delete this delivery destination from your account?",
      "Yes, Delete",
      "Cancel"
    );
    if (!confirmed) return;

    setBusyId(id);
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      alertToast("Address removed", "info");
      router.refresh();
    } catch {
      alertError("Failed", "Unable to remove address.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-5">
      {addresses.map((a) => (
        <div
          key={a.id}
          className={`flex items-start justify-between rounded-xl border p-5 text-xs transition-all duration-300 ${
            a.isDefault
              ? "border-gold/60 bg-gold/5 shadow-gold-card"
              : "border-neutral-800 bg-obsidian-800/60 hover:border-neutral-700"
          }`}
        >
          <div className="space-y-1">
            <p className="flex items-center gap-2 font-serif text-sm font-bold text-ivory">
              <span>{a.fullName}</span>
              {a.isDefault && (
                <span className="rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold text-obsidian-950 uppercase shadow-gold-glow">
                  Default Destination
                </span>
              )}
            </p>
            <p className="text-neutral-400 font-mono">{a.phone}</p>
            <p className="text-neutral-300">
              {a.line1}
              {a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.province} {a.postalCode}, {a.country}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            {!a.isDefault && (
              <button
                onClick={() => setDefault(a.id)}
                disabled={busyId === a.id}
                className="flex items-center gap-1 text-xs text-gold hover:text-gold-light font-semibold"
              >
                <Star size={13} /> Make Default
              </button>
            )}
            <button
              onClick={() => removeAddress(a.id)}
              disabled={busyId === a.id}
              className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
              title="Delete Address"
            >
              {busyId === a.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            </button>
          </div>
        </div>
      ))}

      {showForm ? (
        <form
          onSubmit={handleAdd}
          className="grid gap-4 rounded-2xl border border-gold/40 bg-obsidian-900/90 p-6 md:p-8 backdrop-blur-md sm:grid-cols-2"
        >
          <div className="sm:col-span-2 flex items-center gap-2 text-xs uppercase tracking-wider text-gold font-semibold mb-1">
            <MapPin size={14} /> Register New Delivery Address
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">Full Name</label>
            <input
              required
              placeholder="e.g. Tariq Mansoor"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="input-field rounded-xl"
            />
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">Contact Phone</label>
            <input
              required
              placeholder="+92 300 1234567"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input-field rounded-xl"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] text-neutral-400 block mb-1">Street / House Address</label>
            <input
              required
              placeholder="House #, Street name, Area"
              value={form.line1}
              onChange={(e) => setForm({ ...form, line1: e.target.value })}
              className="input-field rounded-xl"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] text-neutral-400 block mb-1">Apartment, Suite, Landmark (Optional)</label>
            <input
              placeholder="Apartment or Landmark"
              value={form.line2}
              onChange={(e) => setForm({ ...form, line2: e.target.value })}
              className="input-field rounded-xl"
            />
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">City</label>
            <input
              required
              placeholder="City (e.g. Karachi, Lahore)"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="input-field rounded-xl"
            />
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">Province</label>
            <input
              required
              placeholder="Province (e.g. Sindh, Punjab)"
              value={form.province}
              onChange={(e) => setForm({ ...form, province: e.target.value })}
              className="input-field rounded-xl"
            />
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">Postal Code</label>
            <input
              required
              placeholder="e.g. 75600"
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              className="input-field rounded-xl"
            />
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">Country</label>
            <input
              required
              placeholder="Country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="input-field rounded-xl"
            />
          </div>

          <div className="flex gap-3 sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-xs uppercase tracking-wider font-bold py-3 px-6"
            >
              {loading && <Loader2 size={16} className="animate-spin" />} Save Address
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-secondary text-xs uppercase tracking-wider font-semibold py-3 px-6"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold py-3 px-6 shadow-gold-glow"
        >
          <Plus size={16} /> Add New Delivery Address
        </button>
      )}
    </div>
  );
}
