"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  _count: { orders: number };
}

export function UsersTable({ users }: { users: UserRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(users);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggleActive(id: string, isActive: boolean) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setRows((r) => r.map((u) => (u.id === id ? { ...u, isActive: !isActive } : u)));
      toast.success(!isActive ? "User enabled" : "User disabled");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-neutral-200 bg-white">
      <table className="w-full min-w-[700px] text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Orders</th>
            <th className="px-4 py-3">Joined</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => (
            <tr key={u.id} className="border-b border-neutral-100">
              <td className="px-4 py-3 font-medium text-charcoal">{u.name}</td>
              <td className="px-4 py-3">{u.email}</td>
              <td className="px-4 py-3">{u.phone || "—"}</td>
              <td className="px-4 py-3">{u._count.orders}</td>
              <td className="px-4 py-3">{new Date(u.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-1 text-xs ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {u.isActive ? "Active" : "Disabled"}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  disabled={busyId === u.id}
                  onClick={() => toggleActive(u.id, u.isActive)}
                  className="text-sm text-gold hover:underline disabled:opacity-50"
                >
                  {busyId === u.id ? <Loader2 size={14} className="inline animate-spin" /> : u.isActive ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
