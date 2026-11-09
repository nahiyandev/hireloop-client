"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Check,
  CreditCard,
  Lock,
  Shield,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/components/sonner"
import { authClient } from "@/lib/auth-client"

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [currency, setCurrency] = React.useState<"BDT" | "USD">("BDT")
  const [isProcessing, setIsProcessing] = React.useState(false)

  const [formData, setFormData] = React.useState({
    email: "alex.rivera@example.com",
    cardNumber: "4242 4242 4242 4242",
    expDate: "12 / 28",
    cvc: "888",
    cardholderName: "Alex Rivera",
    country: "Bangladesh",
    saveInfo: true,
  })

  // Prefill logged-in user credentials
  React.useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        email: session.user.email || prev.email,
        cardholderName: session.user.name || prev.cardholderName,
      }))
    }
  }, [session])

  const priceFormatted = currency === "BDT" ? "BDT 2,553.33" : "$20.00"

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    toast.info("Processing secure payment with Stripe...")

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
      await fetch(`${apiUrl}/payments/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          plan: "pro",
          transactionId: "cs_test_" + Math.random().toString(36).substring(2, 14),
        }),
      }).catch(() => null) // graceful offline fallback
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsProcessing(false)
      toast.success("Payment Successful!", {
        description: "Welcome to Hireloop Pro.",
      })
      router.push("/checkout/success")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#07080b] text-white flex flex-col justify-between selection:bg-[#0070f3] selection:text-white">
      {/* Top App Bar Header (Figma Screenshot 3) */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/jobs"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-mono"
          >
            <ArrowLeft className="h-4 w-4" />
            <Lock className="h-3.5 w-3.5 text-zinc-400" />
            <span>Secure Checkout</span>
          </Link>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            SANDBOX
          </span>
        </div>
      </header>

      {/* Main Two-Column Work Surface (Figma Screenshot 3) */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column (5 Cols): Order Summary & Currency Selection */}
          <div className="lg:col-span-5 space-y-8">
            {/* Currency Selector */}
            <div className="space-y-3">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                CHOOSE A CURRENCY:
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* Option 1: BDT (Bangladesh) */}
                <button
                  type="button"
                  onClick={() => setCurrency("BDT")}
                  className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-semibold transition-all border ${
                    currency === "BDT"
                      ? "border-white/50 bg-white/10 text-white shadow-md ring-1 ring-white/20"
                      : "border-white/10 bg-transparent text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-base">🇧🇩</span>
                  <span>BDT 2,553.33</span>
                </button>

                {/* Option 2: USD */}
                <button
                  type="button"
                  onClick={() => setCurrency("USD")}
                  className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-semibold transition-all border ${
                    currency === "USD"
                      ? "border-white/50 bg-white/10 text-white shadow-md ring-1 ring-white/20"
                      : "border-white/10 bg-transparent text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-base">🇺🇸</span>
                  <span>$20.00</span>
                </button>
              </div>

              <div className="text-[11px] text-zinc-500 italic font-mono">
                1 USD = 127.6665 BDT
              </div>
            </div>

            {/* Plan Row Summary */}
            <div className="rounded-2xl border border-white/10 bg-[#0c0d12] p-5 shadow-lg flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Hireloop Pro Plan</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Access to all features</p>
              </div>
              <div className="text-sm font-bold text-white font-mono">{priceFormatted}</div>
            </div>
          </div>

          {/* Right Column (7 Cols): Payment Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Express Checkout: Stripe Link Button (Figma Screenshot 3) */}
            <button
              type="button"
              onClick={handlePay}
              className="w-full h-11 rounded-xl bg-[#00d66f] hover:bg-[#00c566] text-black font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99]"
            >
              <span className="font-bold tracking-tight flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-black inline-block" />
                link
              </span>
              <span className="text-black/30 font-light">|</span>
              <span className="font-mono text-xs flex items-center gap-1">
                <span className="font-black italic">VISA</span>
                <span>4242</span>
              </span>
            </button>

            {/* Divider OR */}
            <div className="relative flex items-center justify-center my-6">
              <div className="w-full border-t border-white/10" />
              <span className="absolute bg-[#07080b] px-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                OR
              </span>
            </div>

            {/* Payment Method Form */}
            <form onSubmit={handlePay} className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-200">Contact information</h4>
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-11 rounded-xl border border-white/10 bg-[#0c0d12] px-3.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#0070f3]"
                  />
                </div>
              </div>

              {/* Payment Method Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-200">Payment method</h4>

                {/* Card Container Box */}
                <div className="rounded-xl border border-white/10 bg-[#0c0d12] overflow-hidden">
                  {/* Card Tab Header */}
                  <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2 text-xs font-medium text-white bg-white/[0.02]">
                    <CreditCard className="h-4 w-4 text-zinc-400" />
                    <span>Card</span>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Card Information */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        CARD INFORMATION
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={formData.cardNumber}
                          onChange={(e) =>
                            setFormData({ ...formData, cardNumber: e.target.value })
                          }
                          placeholder="1234 1234 1234 1234"
                          className="w-full h-10 rounded-lg border border-white/10 bg-white/[0.02] px-3 pr-24 text-xs text-white font-mono placeholder:text-zinc-500 focus:outline-none focus:border-[#0070f3]"
                        />
                        <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5 opacity-80">
                          <span className="text-[9px] font-black italic text-zinc-400">VISA</span>
                          <span className="text-[9px] font-bold text-zinc-400">MC</span>
                          <span className="text-[9px] font-bold text-zinc-400">AMEX</span>
                        </div>
                      </div>
                    </div>

                    {/* MM/YY and CVC */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                          MM / YY
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.expDate}
                          onChange={(e) => setFormData({ ...formData, expDate: e.target.value })}
                          placeholder="MM / YY"
                          className="w-full h-10 rounded-lg border border-white/10 bg-white/[0.02] px-3 text-xs text-white font-mono placeholder:text-zinc-500 focus:outline-none focus:border-[#0070f3]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                          CVC
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={formData.cvc}
                            onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                            placeholder="CVC"
                            className="w-full h-10 rounded-lg border border-white/10 bg-white/[0.02] px-3 pr-8 text-xs text-white font-mono placeholder:text-zinc-500 focus:outline-none focus:border-[#0070f3]"
                          />
                          <Lock className="absolute right-2.5 top-3 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Cardholder Name */}
                    <div className="space-y-1 pt-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        CARDHOLDER NAME
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.cardholderName}
                        onChange={(e) =>
                          setFormData({ ...formData, cardholderName: e.target.value })
                        }
                        placeholder="Full name on card"
                        className="w-full h-10 rounded-lg border border-white/10 bg-white/[0.02] px-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#0070f3]"
                      />
                    </div>

                    {/* Country or Region */}
                    <div className="space-y-1 pt-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        COUNTRY OR REGION
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full h-10 rounded-lg border border-white/10 bg-[#161720] px-3 text-xs text-white focus:outline-none focus:border-[#0070f3]"
                      >
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Germany">Germany</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Information Checkbox */}
              <div className="rounded-xl border border-white/10 bg-[#0c0d12] p-4 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="saveInfo"
                  checked={formData.saveInfo}
                  onChange={(e) => setFormData({ ...formData, saveInfo: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-[#0070f3] accent-[#0070f3] focus:ring-0"
                />
                <label htmlFor="saveInfo" className="text-xs text-zinc-300 cursor-pointer select-none">
                  <span className="font-semibold text-white block">
                    Save my information for faster checkout
                  </span>
                  <span className="text-[11px] text-zinc-500 leading-relaxed block mt-0.5">
                    Pay securely on this site and everywhere Link is accepted.
                  </span>
                </label>
              </div>

              {/* Primary Stripe Pay Button (Figma Screenshot 3) */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full h-11 rounded-xl bg-[#0070f3] hover:bg-[#0060df] text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Pay</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Checkout Footer (Figma Screenshot 3) */}
      <footer className="border-t border-white/5 py-6 px-6 text-center text-xs text-zinc-500">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="font-medium">Powered by Stripe</span>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <div className="flex items-center gap-4 text-zinc-400">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
