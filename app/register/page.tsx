"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Loader2, Eye, EyeOff, Sparkles, User, Mail, Phone, Lock } from "lucide-react";
import { alertSuccess, alertError, alertToast } from "@/lib/alerts";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.password !== form.confirm) {
      alertToast("Passwords do not match", "error");
      return;
    }

    if (form.password.length < 8) {
      alertToast("Password must contain at least 8 characters", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      const signInRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      await alertSuccess(
        "Welcome to Maison Privé",
        `Your account has been created for <strong>${form.name}</strong>. Enjoy 15% off your debut order with code <strong>VIP15</strong>.`
      );

      if (signInRes?.error) {
        router.push("/login");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      alertError("Registration Unsuccessful", err.message || "Something went wrong during account creation");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-16 bg-obsidian-950 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-gold/30 bg-obsidian-900/90 p-8 md:p-10 backdrop-blur-xl shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-2xl border border-gold/50 bg-gold/15 flex items-center justify-center text-gold font-serif text-xl font-bold shadow-gold-glow">
            MC
          </div>
          <h1 className="font-serif text-3xl font-bold text-ivory">Create Account</h1>
          <p className="text-xs text-neutral-400">Join Maison Charcoal's private patron registry</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Full Name *
            </label>
            <div className="relative">
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="input-field rounded-xl pl-10"
                placeholder="e.g. Tariq Mansoor"
              />
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="input-field rounded-xl pl-10"
                placeholder="patron@domain.com"
              />
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Contact Phone (Optional)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="input-field rounded-xl pl-10"
                placeholder="+92 300 1234567"
              />
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Password * (Min 8 Characters)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="input-field rounded-xl pl-10 pr-10"
                placeholder="••••••••••••"
              />
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-gold"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.confirm}
                onChange={(e) => update("confirm", e.target.value)}
                className="input-field rounded-xl pl-10"
                placeholder="Re-enter password"
              />
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-xs uppercase tracking-widest font-bold shadow-gold-glow mt-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Register VIP Account
          </button>
        </form>

        <p className="text-center text-xs text-neutral-400">
          Already a patron?{" "}
          <Link href="/login" className="text-gold font-semibold hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
