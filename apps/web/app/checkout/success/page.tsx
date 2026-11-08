"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Navbar } from "@/components/navbar"

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#07080b] text-white flex flex-col justify-between relative overflow-hidden">
      {/* Top Navbar (Figma Screenshot 4) */}
      <Navbar />

      {/* Center Main Stage with Ambient Glow */}
      <main className="relative flex-1 flex items-center justify-center px-4 py-16">
        {/* Subtle Ambient Radial Glow (Figma Exact) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 blur-[120px] pointer-events-none rounded-full" />

        {/* Success Card Modal (Figma Screenshot 4) */}
        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0c0d12]/90 backdrop-blur-2xl p-8 sm:p-10 text-center shadow-2xl space-y-6">
          {/* Checkmark Circular Badge */}
          <div className="h-14 w-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-950/40">
            <Check className="h-7 w-7 stroke-[2.5]" />
          </div>

          {/* Upgrade Status Pill */}
          <div>
            <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-semibold shadow-xs">
              UPGRADE SUCCESSFUL
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Welcome to Hireloop Pro
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-normal">
              Your payment of <span className="font-semibold text-white">$20.00</span> was received perfectly.
            </p>
          </div>

          {/* Instruction Box */}
          <p className="text-xs text-zinc-400 leading-relaxed">
            All advanced premium recruiting modules are unlocked on your account.{" "}
            <span className="text-emerald-400 font-medium">
              You may need to re-authenticate to see the effect.
            </span>
          </p>

          {/* Session Verification Box (Figma Screenshot 4) */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-300 font-medium">
              <ShieldCheck className="h-4 w-4 text-[#818cf8]" />
              <span>Session ID Verified</span>
            </div>
            <div className="rounded-lg bg-black/50 border border-white/5 px-2.5 py-1 text-[10px] font-mono text-zinc-400 tracking-tight">
              cs_test_a1846j1T8JCIGk93...
            </div>
          </div>

          {/* Go to Dashboard CTA */}
          <div className="pt-2">
            <Link href="/dashboard" className="block w-full">
              <button
                type="button"
                className="w-full h-11 rounded-xl bg-white text-zinc-950 font-bold text-xs sm:text-sm hover:bg-zinc-100 shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Go to Workspace Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Subtle Bottom Credit */}
      <footer className="py-4 text-center text-xs text-zinc-600 font-mono">
        HireLoop Enterprise Billing • Protected with 256-bit SSL encryption
      </footer>
    </div>
  )
}
