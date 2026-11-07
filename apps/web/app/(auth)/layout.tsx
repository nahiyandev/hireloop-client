import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ShieldCheck } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#665df5]/15 blur-[140px] pointer-events-none rounded-full" />

      {/* Auth Card Container */}
      <div className="relative w-full max-w-md">
        {/* Top Branding / Logo */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="HireLoop"
              width={140}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Page Content (Sign In / Sign Up Form) */}
        {children}

        {/* Bottom Trust Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <ShieldCheck className="h-4 w-4 text-emerald-400/80" />
          <span>Encrypted & secure connection</span>
        </div>
      </div>
    </div>
  )
}
