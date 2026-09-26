"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, User } from "lucide-react";
import { alertSuccess, alertError, alertToast } from "@/lib/alerts";

export function SettingsForm({
  initialName,
  initialPhone,
  email,
}: {
  initialName: string;
  initialPhone: string;
  email: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword && newPassword.length < 8) {
      alertToast("New password must be at least 8 characters", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      await alertSuccess(
        "Dossier Updated",
        "Your Maison Charcoal patron profile and security credentials have been updated successfully."
      );
      setCurrentPassword("");
      setNewPassword("");
      router.refresh();
    } catch (err: any) {
      alertError("Update Failed", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Full Patron Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field rounded-xl"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Registered Email
          </label>
          <input
            value={email}
            disabled
            className="input-field rounded-xl bg-obsidian-800/40 text-neutral-500 cursor-not-allowed border-neutral-800"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Contact Number
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+92 300 1234567"
            className="input-field rounded-xl"
          />
        </div>
      </div>

      <div className="border-t border-neutral-800 pt-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold">
          <ShieldCheck size={16} /> Security & Password Modification
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] text-neutral-400">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input-field rounded-xl"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-neutral-400">New Password (Min 8 Characters)</label>
            <input
              type="password"
              placeholder="Enter new secure password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-field rounded-xl"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary py-3 px-8 text-xs uppercase tracking-widest font-bold shadow-gold-glow"
      >
        {loading && <Loader2 size={16} className="animate-spin" />} Save Profile Changes
      </button>
    </form>
  );
}
