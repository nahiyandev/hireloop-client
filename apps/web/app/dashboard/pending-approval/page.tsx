"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Clock,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  LogOut,
  Mail,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { authClient, signOut } from "@/lib/auth-client"
import { toast } from "@workspace/ui/components/sonner"

export default function PendingApprovalPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [isChecking, setIsChecking] = React.useState(false)

  const user = session?.user
  const userRole = (user as any)?.role || (user as any)?.selectedRole || "admin"

  const handleCheckStatus = async () => {
    setIsChecking(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
      const res = await fetch(`${apiUrl}/users`)
      if (res.ok) {
        const users = await res.json()
        if (Array.isArray(users)) {
          const matched = users.find(
            (u: any) =>
              (user?.id && (u._id === user.id || u.id === user.id)) ||
              (user?.email && u.email?.toLowerCase() === user.email.toLowerCase())
          )

          if (matched) {
            if (matched.status === "Active" && matched.role === "admin") {
              toast.success("Administrator Privileges Approved!", {
                description: "Super Admin has approved your account. Welcome to the Admin Console!",
              })
              router.push("/dashboard/admin")
              return
            } else if (matched.role === "superadmin") {
              router.push("/dashboard/admin")
              return
            }
          }
        }
      }
      toast.info("Status: Pending Review", {
        description: "Your administrator account is still waiting for Super Admin approval.",
      })
    } catch {
      toast.error("Network error checking approval status.")
    } finally {
      setIsChecking(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/sign-in")
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl border border-amber-500/20 bg-gradient-to-b from-[#0e0f17] to-[#07080b] p-8 sm:p-10 text-center shadow-2xl space-y-6">
        {/* Animated Badge / Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/10">
          <Clock className="h-8 w-8 animate-pulse" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
            Pending Super Admin Approval
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            Administrator Access Requested
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
            Your account is registered as a <strong className="text-white">Platform Administrator</strong>. 
            For platform security, administrative privileges must be authorized and approved by a 
            <strong className="text-amber-400 font-semibold"> Super Admin</strong> before you can access the Admin Console.
          </p>
        </div>

        {/* Account Info Box */}
        {user && (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-left space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-mono text-[11px]">ACCOUNT NAME</span>
              <span className="font-semibold text-zinc-200">{user.name || "Administrator"}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-mono text-[11px]">EMAIL</span>
              <span className="font-mono text-zinc-300">{user.email}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-mono text-[11px]">CURRENT STATUS</span>
              <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-400 border border-amber-500/20">
                Pending Approval
              </span>
            </div>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            type="button"
            onClick={handleCheckStatus}
            disabled={isChecking}
            className="w-full h-11 rounded-xl bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-100 shadow-md gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`} />
            <span>{isChecking ? "Verifying Approval..." : "Check Approval Status"}</span>
          </Button>

          <div className="flex items-center justify-center gap-4 text-xs pt-1">
            <Link
              href="/jobs"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Browse Jobs Portal
            </Link>
            <span className="text-zinc-600">•</span>
            <button
              onClick={handleSignOut}
              className="text-zinc-400 hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              <LogOut className="h-3 w-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
