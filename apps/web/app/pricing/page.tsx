"use client"

import * as React from "react"
import Link from "next/link"
import { Check, ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Footer } from "@/components/footer"

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#07080b] text-white">
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-block rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-mono tracking-widest text-[#818cf8] uppercase">
            Transparent Pricing
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Pay for the leverage, not the listings
          </h1>
          <p className="text-sm text-zinc-400">
            Choose the plan tailored for your hiring or job-seeking velocity. Cancel anytime with a single click.
          </p>
        </div>

        {/* Pricing Cards Grid (3 Columns: Free | Growth | Pro) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {/* Card 1: Free */}
          <div className="rounded-3xl border border-white/10 bg-[#0c0d12] p-7 shadow-2xl flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Free Plan
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white tracking-tight">$0</span>
                  <span className="text-xs text-zinc-500 font-mono">/ month</span>
                </div>
                <p className="text-xs text-zinc-400 mt-2">
                  Essential tools to explore vetted tech jobs and discover top companies.
                </p>
              </div>

              <ul className="space-y-3 text-xs text-zinc-300 pt-4 border-t border-white/5">
                {[
                  "Browse 1,200+ vetted tech jobs",
                  "Apply to up to 3 jobs per month",
                  "Standard candidate profile",
                  "Public company reviews & salaries",
                  "Basic job alert notifications",
                ].map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-zinc-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/sign-up" className="block w-full">
              <Button
                variant="outline"
                className="w-full h-11 rounded-xl border-white/15 bg-white/[0.03] text-white hover:bg-white/10 font-semibold text-xs"
              >
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Card 2: Growth */}
          <div className="rounded-3xl border border-white/10 bg-[#0c0d12] p-7 shadow-2xl flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Growth Plan
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white tracking-tight">$17</span>
                  <span className="text-xs text-zinc-500 font-mono">/ month</span>
                </div>
                <p className="text-xs text-zinc-400 mt-2">
                  Essential tools for active job searchers and small teams hiring occasionally.
                </p>
              </div>

              <ul className="space-y-3 text-xs text-zinc-300 pt-4 border-t border-white/5">
                {[
                  "Unlimited verified job applications",
                  "Automated candidate profile match rating",
                  "Verified employer messaging",
                  "Real-time status updates on all submissions",
                ].map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-zinc-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/checkout?plan=growth" className="block w-full">
              <Button
                variant="outline"
                className="w-full h-11 rounded-xl border-white/15 bg-white/[0.03] text-white hover:bg-white/10 font-semibold text-xs"
              >
                Get Started with Growth
              </Button>
            </Link>
          </div>

          {/* Card 3: Pro (Highlighted Figma Exact) */}
          <div className="relative rounded-3xl border border-[#665df5]/50 bg-[#0c0d12] p-7 shadow-2xl flex flex-col justify-between space-y-8 ring-1 ring-[#665df5]/30">
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 h-32 w-32 bg-[#665df5]/20 blur-3xl pointer-events-none rounded-full" />

            <div className="space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#818cf8] font-bold">
                  Hireloop Pro Plan
                </span>
                <span className="rounded-full bg-[#665df5]/20 border border-[#665df5]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#a5b4fc] uppercase">
                  Most Popular
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white tracking-tight">$20</span>
                  <span className="text-xs text-zinc-500 font-mono">/ month</span>
                </div>
                <p className="text-xs text-zinc-400 mt-2">
                  Full leverage with instant application boosting, priority candidate pipelines, and automated intelligence.
                </p>
              </div>

              <ul className="space-y-3 text-xs text-zinc-200 pt-4 border-t border-white/5">
                {[
                  "All features in Growth plan",
                  "Priority applicant visibility across all listings",
                  "Verified skills assessment badges",
                  "Direct recruiter messaging channel",
                  "Fast-track interview scheduling assistant",
                ].map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-[#818cf8] shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/checkout?plan=pro" className="block w-full relative">
              <button
                type="button"
                className="w-full h-11 rounded-xl bg-[#665df5] hover:bg-[#5345f0] text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>Upgrade to Pro Now</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* Security / Trust Ribbon */}
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 pt-4">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Protected with Stripe 256-bit SSL encryption. 14-day money back guarantee.</span>
        </div>
      </main>

      <Footer />
    </div>
  )
}
