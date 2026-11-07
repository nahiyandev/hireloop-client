"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"

export default function DashboardIndexPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  React.useEffect(() => {
    if (isPending) return

    if (!session?.user) {
      // Default to seeker if unauthenticated, or redirect to sign-in
      router.replace("/dashboard/seeker")
      return
    }

    const role = (session.user as any)?.role || (session.user as any)?.selectedRole || "seeker"

    if (role === "admin" || role === "superadmin") {
      router.replace("/dashboard/admin")
    } else if (role === "recruiter" || role === "employer") {
      router.replace("/dashboard/recruiter")
    } else {
      router.replace("/dashboard/seeker")
    }
  }, [session, isPending, router])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <Loader2 className="h-6 w-6 animate-spin text-[#665df5]" />
      <p className="text-xs text-zinc-400 font-mono">Redirecting to your workspace...</p>
    </div>
  )
}
