"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setSent(true);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="section-title mb-2 text-center">Reset Password</h1>
      <p className="mb-8 text-center text-sm text-neutral-500">
        Enter your email and we'll create a reset link for you.
      </p>

      {sent ? (
        <div className="rounded-sm border border-gold bg-champagne/40 p-4 text-sm text-charcoal">
          If an account exists for <strong>{email}</strong>, a reset link has been created.
          (In this demo environment, check the server console/terminal for the link, since no
          email service is configured yet.)
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading && <Loader2 size={16} className="animate-spin" />}
            Send Reset Link
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-neutral-500">
        Remembered your password?{" "}
        <Link href="/login" className="text-gold hover:underline">Login</Link>
      </p>
    </div>
  );
}
