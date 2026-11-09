"use client"

import Link from "next/link"
import { ArrowLeft, Compass, Home, Search, ShieldCheck } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Footer } from "@/components/footer"

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-between bg-[#030305] text-white">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        {/* Glow Accent Circle */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-full bg-indigo-500/20 blur-2xl filter" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-[#0d0e15] shadow-2xl">
            <span className="text-4xl">🔍</span>
          </div>
        </div>

        {/* 404 Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-mono font-semibold text-[#818cf8] mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-[#818cf8] animate-pulse" />
          ERROR 404 • ROUTE UNRESOLVED
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-lg">
          Lost in the talent cloud?
        </h1>

        <p className="mt-4 max-w-md text-sm text-zinc-400 leading-relaxed">
          The page or opportunity listing you are looking for does not exist, has expired, or has moved to a new destination.
        </p>

        {/* Actions Grid */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Link href="/">
            <Button
              className="h-10 rounded-xl bg-white text-xs font-bold text-zinc-950 hover:bg-zinc-100 px-6 gap-2 shadow-xl shadow-white/5 active:scale-95 transition-all"
            >
              <Home className="h-4 w-4" />
              <span>Return Home</span>
            </Button>
          </Link>

          <Link href="/jobs">
            <Button
              variant="outline"
              className="h-10 rounded-xl border-white/15 bg-white/[0.04] text-xs font-semibold text-white hover:bg-white/10 px-6 gap-2 active:scale-95 transition-all"
            >
              <Compass className="h-4 w-4 text-[#818cf8]" />
              <span>Browse Active Jobs</span>
            </Button>
          </Link>
        </div>

        {/* Helpful links pill row */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500 border-t border-white/5 pt-6">
          <Link href="/jobs" className="hover:text-zinc-300 transition-colors">
            Find Opportunities
          </Link>
          <span>•</span>
          <Link href="/pricing" className="hover:text-zinc-300 transition-colors">
            Employer Plans
          </Link>
          <span>•</span>
          <Link href="/sign-in" className="hover:text-zinc-300 transition-colors">
            Sign In to Portal
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
