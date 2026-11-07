"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Bookmark,
  Briefcase,
  ChevronRight,
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

  // Determine current active section based on route
  const isRecruiter = pathname.startsWith("/dashboard/recruiter")
  const isAdmin = pathname.startsWith("/dashboard/admin")
  const isSeeker = pathname.startsWith("/dashboard/seeker") || (!isRecruiter && !isAdmin)

  const currentRole = isAdmin ? "admin" : isRecruiter ? "recruiter" : "seeker"

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully")
      router.push("/sign-in")
    } catch {
      toast.error("Could not sign out")
    }
  }

  // Navigation Items per Role
  const seekerNav = [
    { title: "Overview", href: "/dashboard/seeker", icon: LayoutDashboard },
    { title: "Saved Jobs", href: "/dashboard/seeker/saved", icon: Bookmark },
    { title: "My Applications", href: "/dashboard/seeker/applications", icon: FileText },
    { title: "Browse Jobs", href: "/jobs", icon: Search },
  ]

  const recruiterNav = [
    { title: "Overview", href: "/dashboard/recruiter", icon: LayoutDashboard },
    { title: "Manage Job Posts", href: "/dashboard/recruiter/jobs", icon: Briefcase },
    { title: "Post a New Job", href: "/dashboard/recruiter/jobs/new", icon: PlusCircle },
    { title: "Candidates", href: "/dashboard/recruiter/applicants", icon: Users },
  ]

  const adminNav = [
    { title: "Dashboard Overview", href: "/dashboard/admin", icon: ShieldCheck },
    { title: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { title: "Manage Jobs", href: "/dashboard/admin/jobs", icon: Briefcase },
    { title: "Admin Console Full", href: "/admin", icon: Shield },
  ]

  const activeNav = isAdmin ? adminNav : isRecruiter ? recruiterNav : seekerNav

  return (
    <Sidebar>
      {/* Sidebar Header with HireLoop Logo */}
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2.5 px-2">
          <img src="/images/logo.png" alt="HireLoop" className="h-6 w-auto" />
          <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-bold">
            Portal
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Role Switcher Pills (Allows testing each dashboard) */}
        <SidebarGroup>
          <SidebarGroupLabel>Workspace Mode</SidebarGroupLabel>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-white/5 p-1 border border-white/10 text-[11px] font-medium">
            <Link
              href="/dashboard/seeker"
              className={`flex items-center justify-center py-1.5 rounded-lg transition-all ${
                isSeeker
                  ? "bg-[#665df5] text-white font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Seeker
            </Link>
            <Link
              href="/dashboard/recruiter"
              className={`flex items-center justify-center py-1.5 rounded-lg transition-all ${
                isRecruiter
                  ? "bg-[#665df5] text-white font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Recruiter
            </Link>
            <Link
              href="/dashboard/admin"
              className={`flex items-center justify-center py-1.5 rounded-lg transition-all ${
                isAdmin
                  ? "bg-[#665df5] text-white font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Admin
            </Link>
          </div>
        </SidebarGroup>

        {/* Main Navigation Links */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {isAdmin ? "Administration" : isRecruiter ? "Recruitment Hub" : "Job Seeker Hub"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activeNav.map((item) => {
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

        {/* Quick Links */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Home className="h-4 w-4 text-zinc-400" />
                    <span>HireLoop Homepage</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/jobs">
                    <Search className="h-4 w-4 text-zinc-400" />
                    <span>Public Job Board</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer with User Profile & Sign Out */}
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
