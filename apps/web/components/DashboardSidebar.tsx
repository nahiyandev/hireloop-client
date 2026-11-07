"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Bookmark,
  Briefcase,
  Building2,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  User,
  Users,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { signOut, useSession } from "@/lib/auth-client"
import { toast } from "@workspace/ui/components/sonner"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  // Detect role from path or session
  const isAdminPath = pathname.startsWith("/dashboard/admin") || pathname.startsWith("/admin")
  const isRecruiterPath = pathname.startsWith("/dashboard/recruiter")
  const isSeekerPath = pathname.startsWith("/dashboard/seeker")

  const sessionRole = (session?.user as any)?.role || (session?.user as any)?.selectedRole

  const currentRole: "admin" | "recruiter" | "seeker" =
    isAdminPath
      ? "admin"
      : isRecruiterPath
      ? "recruiter"
      : isSeekerPath
      ? "seeker"
      : sessionRole === "admin" || sessionRole === "superadmin"
      ? "admin"
      : sessionRole === "recruiter"
      ? "recruiter"
      : "seeker"

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully")
      router.push("/sign-in")
      router.refresh()
    } catch {
      toast.error("Could not sign out")
    }
  }

  // ==========================================
  // FIGMA EXACT ROLE-BASED NAVIGATION ITEMS
  // ==========================================

  // 1. ADMIN MENU (Exact match with Figma 04 · Admin Console Screenshots)
  const adminNav = [
    { title: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { title: "Users", href: "/dashboard/admin/users", icon: Users },
    { title: "Companies", href: "/dashboard/admin/companies", icon: Building2 },
    { title: "Jobs", href: "/dashboard/admin/jobs", icon: Briefcase },
    { title: "Payments", href: "/dashboard/admin/payments", icon: CreditCard },
    { title: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ]

  // 2. RECRUITER MENU (Figma 03 · Recruiter)
  const recruiterNav = [
    { title: "Dashboard", href: "/dashboard/recruiter", icon: LayoutDashboard },
    { title: "Jobs", href: "/dashboard/recruiter/jobs", icon: Briefcase },
    { title: "Post a Job", href: "/dashboard/recruiter/jobs/new", icon: PlusCircle },
    { title: "Candidates", href: "/dashboard/recruiter/applicants", icon: Users },
    { title: "Company", href: "/dashboard/recruiter/company", icon: Building2 },
    { title: "Settings", href: "/dashboard/recruiter/settings", icon: Settings },
  ]

  // 3. JOB SEEKER MENU (Figma 02 · Job Seeker)
  const seekerNav = [
    { title: "Dashboard", href: "/dashboard/seeker", icon: LayoutDashboard },
    { title: "Saved Jobs", href: "/dashboard/seeker/saved", icon: Bookmark },
    { title: "Applications", href: "/dashboard/seeker/applications", icon: FileText },
    { title: "Browse Jobs", href: "/jobs", icon: Search },
    { title: "Settings", href: "/dashboard/seeker/settings", icon: Settings },
  ]

  const activeNav =
    currentRole === "admin"
      ? adminNav
      : currentRole === "recruiter"
      ? recruiterNav
      : seekerNav

  const roleSubtitle =
    currentRole === "admin"
      ? "Admin Console"
      : currentRole === "recruiter"
      ? "Recruiter Portal"
      : "Seeker Portal"

  return (
    <Sidebar className="border-r border-white/5 bg-[#090a0f] text-white">
      {/* Sidebar Header with exact Figma logo branding */}
      <SidebarHeader className="border-b border-white/5 px-5 py-4">
        <Link href="/" className="flex flex-col gap-0.5 group">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="hireloop" className="h-6 w-auto" />
          </div>
          <span className="text-[11px] font-medium text-zinc-400 pl-0.5">
            {roleSubtitle}
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 space-y-6">
        {/* Role Quick Switcher Pills (Allows testing each role smoothly) */}
        <SidebarGroup>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-white/[0.03] p-1 border border-white/5 text-[11px]">
            <Link
              href="/dashboard/admin"
              className={`flex items-center justify-center py-1.5 rounded-lg transition-all ${
                currentRole === "admin"
                  ? "bg-[#665df5] text-white font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Admin
            </Link>
            <Link
              href="/dashboard/recruiter"
              className={`flex items-center justify-center py-1.5 rounded-lg transition-all ${
                currentRole === "recruiter"
                  ? "bg-[#665df5] text-white font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Recruiter
            </Link>
            <Link
              href="/dashboard/seeker"
              className={`flex items-center justify-center py-1.5 rounded-lg transition-all ${
                currentRole === "seeker"
                  ? "bg-[#665df5] text-white font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Seeker
            </Link>
          </div>
        </SidebarGroup>

        {/* Main Navigation Links */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {activeNav.map((item) => {
                const Icon = item.icon
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard/admin" &&
                    item.href !== "/dashboard/recruiter" &&
                    item.href !== "/dashboard/seeker" &&
                    pathname.startsWith(item.href))

                return (
                  <SidebarMenuItem key={item.href}>
                    <Link
                      href={item.href}
                      className={`relative flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                        isActive
                          ? "bg-white/[0.08] text-white font-semibold"
                          : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      {/* Exact Figma left purple vertical bar indicator */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r bg-[#665df5]" />
                      )}
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? "text-[#818cf8]" : "text-zinc-400"
                        }`}
                      />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer with Exact Figma User Profile Card */}
      <SidebarFooter className="border-t border-white/5 p-3">
        <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-2.5 border border-white/5">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
              alt="Alex Rivera"
              className="h-8 w-8 rounded-full object-cover border border-white/10"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">
                {session?.user?.name || "Alex Rivera"}
              </p>
              <p className="truncate text-[10px] text-zinc-400 capitalize">
                {currentRole === "admin"
                  ? "Super Admin"
                  : currentRole === "recruiter"
                  ? "Recruiter"
                  : "Job Seeker"}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-rose-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
