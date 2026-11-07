"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Bookmark,
  Briefcase,
  Building2,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Search,
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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { signOut, useSession } from "@/lib/auth-client"
import { toast } from "@workspace/ui/components/sonner"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  // 1. Determine User Role from Authentication Session
  const sessionRole = (session?.user as any)?.role || (session?.user as any)?.selectedRole

  // 2. Fallback to current URL pathname if not yet authenticated (for smooth testing)
  const isRecruiterPath = pathname.startsWith("/dashboard/recruiter")
  const isAdminPath = pathname.startsWith("/dashboard/admin")
  const isSeekerPath = pathname.startsWith("/dashboard/seeker")

  // Effective role: session priority, then route priority, default to 'seeker'
  const currentRole: "seeker" | "recruiter" | "admin" =
    sessionRole === "admin" || sessionRole === "superadmin"
      ? "admin"
      : sessionRole === "recruiter" || sessionRole === "employer"
      ? "recruiter"
      : sessionRole === "seeker"
      ? "seeker"
      : isAdminPath
      ? "admin"
      : isRecruiterPath
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
  // ROLE-BASED MENU CONFIGURATIONS (FIGMA EXACT)
  // ==========================================

  // 1. JOB SEEKER MENU ITEMS (Figma 02 · Job Seeker)
  const seekerMenuItems = [
    {
      title: "Dashboard Overview",
      href: "/dashboard/seeker",
      icon: LayoutDashboard,
    },
    {
      title: "Saved Jobs",
      href: "/dashboard/seeker/saved",
      icon: Bookmark,
    },
    {
      title: "My Applications",
      href: "/dashboard/seeker/applications",
      icon: FileText,
    },
    {
      title: "Browse All Jobs",
      href: "/jobs",
      icon: Search,
    },
  ]

  // 2. RECRUITER MENU ITEMS (Figma 03 · Recruiter)
  const recruiterMenuItems = [
    {
      title: "Recruiter Overview",
      href: "/dashboard/recruiter",
      icon: LayoutDashboard,
    },
    {
      title: "Manage Job Posts",
      href: "/dashboard/recruiter/jobs",
      icon: Briefcase,
    },
    {
      title: "Post a New Job",
      href: "/dashboard/recruiter/jobs/new",
      icon: PlusCircle,
    },
    {
      title: "Candidates & Applicants",
      href: "/dashboard/recruiter/applicants",
      icon: Users,
    },
  ]

  // 3. ADMIN MENU ITEMS (Figma 04 · Admin Console)
  const adminMenuItems = [
    {
      title: "Admin Dashboard",
      href: "/dashboard/admin",
      icon: ShieldCheck,
    },
    {
      title: "Manage Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: "Manage Jobs",
      href: "/dashboard/admin/jobs",
      icon: Briefcase,
    },
    {
      title: "Full Admin Console",
      href: "/admin",
      icon: Shield,
    },
  ]

  // Select the appropriate role-based menu items
  const menuItems =
    currentRole === "admin"
      ? adminMenuItems
      : currentRole === "recruiter"
      ? recruiterMenuItems
      : seekerMenuItems

  const roleLabel =
    currentRole === "admin"
      ? "Admin Console"
      : currentRole === "recruiter"
      ? "Recruiter Portal"
      : "Job Seeker Portal"

  return (
    <Sidebar>
      {/* Sidebar Header with HireLoop Logo & Brand */}
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2.5 px-2">
          <img src="/images/logo.png" alt="HireLoop" className="h-6 w-auto" />
          <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-bold">
            Portal
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Role Badge Indicator */}
        <SidebarGroup>
          <div className="mx-1 rounded-xl border border-white/10 bg-[#12131a] p-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                Current Role
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                  currentRole === "admin"
                    ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                    : currentRole === "recruiter"
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    : "bg-[#665df5]/15 text-[#a5b4fc] border border-[#665df5]/30"
                }`}
              >
                {currentRole}
              </span>
            </div>
            <div className="mt-1 text-xs font-bold text-white flex items-center gap-1.5">
              {currentRole === "admin" ? (
                <ShieldCheck className="h-3.5 w-3.5 text-rose-400" />
              ) : currentRole === "recruiter" ? (
                <Building2 className="h-3.5 w-3.5 text-amber-400" />
              ) : (
                <User className="h-3.5 w-3.5 text-[#818cf8]" />
              )}
              <span>{roleLabel}</span>
            </div>
          </div>
        </SidebarGroup>

        {/* Dynamic Role-Based Menu Items */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-400">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Global Quick Links */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-400">Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Home className="h-4 w-4 text-zinc-400" />
                    <span>Public Homepage</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/jobs">
                    <Search className="h-4 w-4 text-zinc-400" />
                    <span>Browse All Jobs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer with Logged-in User Profile & Sign Out */}
      <SidebarFooter>
        <div className="flex items-center justify-between rounded-xl bg-white/5 p-2.5 border border-white/5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#665df5]/20 text-[#a5b4fc] border border-[#665df5]/30">
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">
                {session?.user?.name || "HireLoop User"}
              </p>
              <p className="truncate text-[10px] text-zinc-400 font-mono capitalize">
                {currentRole}
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
