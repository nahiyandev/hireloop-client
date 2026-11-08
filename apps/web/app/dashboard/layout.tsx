"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { useSession } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"
import { toast } from "@workspace/ui/components/sonner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isPending } = useSession()

  React.useEffect(() => {
    if (isPending) return

    // 1. Unauthenticated Protection
    if (!session?.user) {
      router.replace("/sign-in")
      return
    }

    const role =
      (session.user as any)?.role ||
      (session.user as any)?.selectedRole ||
      (session.user as any)?.accountType ||
      "seeker"

    // 2. Strict Role-Based Route Guards
    if (pathname.startsWith("/dashboard/admin")) {
      if (role !== "admin" && role !== "superadmin") {
        toast.error("Access Restricted", {
          description: "Administrator privileges required to access Admin Console.",
        })
        router.replace(role === "recruiter" || role === "employer" ? "/dashboard/recruiter" : "/dashboard/seeker")
      }
    } else if (pathname.startsWith("/dashboard/recruiter")) {
      if (role !== "recruiter" && role !== "employer" && role !== "admin" && role !== "superadmin") {
        toast.error("Access Restricted", {
          description: "Recruiter portal is restricted to employer accounts.",
        })
        router.replace("/dashboard/seeker")
      }
    }
  }, [session, isPending, pathname, router])

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030305] text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-[#665df5]" />
          <p className="text-xs text-zinc-400 font-mono tracking-wider">Verifying role permissions...</p>
        </div>
      </div>
    )
  }

  const role =
    (session?.user as any)?.role ||
    (session?.user as any)?.selectedRole ||
    (session?.user as any)?.accountType ||
    "seeker"

  const roleLabel =
    role === "admin" || role === "superadmin"
      ? "Admin Console"
      : role === "recruiter" || role === "employer"
      ? "Recruiter Portal"
      : "Job Seeker Workspace"

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <div className="flex flex-1 flex-col min-w-0 bg-[#030305] text-white">
        {/* Top Executive App Bar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#090a0f]/80 px-4 sm:px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="text-zinc-400">HireLoop</span>
              <span>/</span>
              <span className="text-white font-medium">{roleLabel}</span>
            </div>
          </div>

          {/* User Role Active Pill */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
              <span
                className={`h-2 w-2 rounded-full ${
                  role === "admin" || role === "superadmin"
                    ? "bg-purple-400"
                    : role === "recruiter" || role === "employer"
                    ? "bg-blue-400"
                    : "bg-emerald-400"
                }`}
              />
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-semibold">
                {role}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
