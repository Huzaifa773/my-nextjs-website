"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Loader2, Eye, EyeOff, ShieldCheck, Sparkles, Lock, Mail } from "lucide-react";
import { alertSuccess, alertError, alertToast } from "@/lib/alerts";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (res?.error) {
      alertError("Authentication Failed", res.error || "Please check your email and password.");
      return;
    }

    alertToast("Welcome to Maison Charcoal", "success");
    router.push(callbackUrl);
    router.refresh();
  }

  function fillDemo(type: "admin" | "customer") {
    if (type === "admin") {
      setEmail("admin@demo-perfume.test");
      setPassword("ChangeMe123!");
    } else {
      setEmail("customer@demo-perfume.test");
      setPassword("ChangeMe123!");
    }
    alertToast(`Filled demo ${type} credentials`, "info");
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
          <h1 className="font-serif text-3xl font-bold text-ivory">Welcome Back</h1>
          <p className="text-xs text-neutral-400">Sign in to access your Maison Privé collection</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field rounded-xl pl-10"
                placeholder="patron@domain.com"
              />
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Password
              </label>
              <Link href="/contact" className="text-[11px] text-gold hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-xs uppercase tracking-widest font-bold shadow-gold-glow mt-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Sign In to Account
          </button>
        </form>

        <p className="text-center text-xs text-neutral-400">
          Not yet a member?{" "}
          <Link href="/register" className="text-gold font-semibold hover:underline">
            Register for VIP Membership
          </Link>
        </p>

        {/* Demo Fast Login Pills */}
        <div className="border-t border-neutral-800 pt-4 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 text-center">
            One-Click Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo("customer")}
              className="rounded-lg border border-neutral-800 bg-obsidian-800/80 px-3 py-1.5 text-xs text-neutral-300 hover:border-gold hover:text-gold transition-colors text-center"
            >
              Demo Patron
            </button>
            <button
              type="button"
              onClick={() => fillDemo("admin")}
              className="rounded-lg border border-neutral-800 bg-obsidian-800/80 px-3 py-1.5 text-xs text-neutral-300 hover:border-gold hover:text-gold transition-colors text-center"
            >
              Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
