"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Bell,
  Briefcase,
  Building2,
  ChevronDown,
  Compass,
  CreditCard,
  ExternalLink,
  Home,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSession, signOut } from "@/lib/auth-client"
import { toast } from "@workspace/ui/components/sonner"

export function DashboardNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false)
  const [notificationsOpen, setNotificationsOpen] = React.useState(false)

  // Close dropdowns on route changes
  React.useEffect(() => {
    setUserDropdownOpen(false)
    setNotificationsOpen(false)
  }, [pathname])

  const user = session?.user
  const rawRole =
    (user as any)?.role ||
    (user as any)?.selectedRole ||
    (user as any)?.accountType ||
    "seeker"

  const role: "superadmin" | "admin" | "recruiter" | "seeker" =
    rawRole === "superadmin"
      ? "superadmin"
      : rawRole === "admin"
      ? "admin"
      : rawRole === "recruiter" || rawRole === "employer"
      ? "recruiter"
      : "seeker"

  // Derive friendly page name from pathname
  const pageTitle = React.useMemo(() => {
    if (!pathname) return "Overview"
    if (pathname.includes("/admin/users")) return "User Management"
    if (pathname.includes("/admin/companies")) return "Verified Companies"
    if (pathname.includes("/admin/payments")) return "Payment Transactions"
    if (pathname.includes("/recruiter/jobs/new")) return "Create Job Listing"
    if (pathname.includes("/recruiter/jobs")) return "Manage Job Postings"
    if (pathname.includes("/recruiter/applicants")) return "Candidate Pipeline"
    if (pathname.includes("/recruiter/company")) return "Company Profile"
    if (pathname.includes("/seeker/applications")) return "My Applications"
    if (pathname.includes("/seeker/saved")) return "Saved Opportunities"
    if (pathname.includes("/seeker/settings")) return "Profile Settings"
    if (pathname.startsWith("/dashboard/admin")) return "Admin Overview"
    if (pathname.startsWith("/dashboard/recruiter")) return "Recruiter Dashboard"
    if (pathname.startsWith("/dashboard/seeker")) return "Seeker Workspace"
    return "Dashboard"
  }, [pathname])

  const roleBadgeConfig = React.useMemo(() => {
    switch (role) {
      case "superadmin":
        return {
          label: "Super Admin",
          emoji: "👑",
          pillClass: "border-rose-500/30 bg-rose-500/10 text-rose-300",
          dotClass: "bg-rose-400",
        }
      case "admin":
        return {
          label: "Admin",
          emoji: "🛡️",
          pillClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
          dotClass: "bg-emerald-400",
        }
      case "recruiter":
        return {
          label: "Recruiter",
          emoji: "💼",
          pillClass: "border-blue-500/30 bg-blue-500/10 text-blue-300",
          dotClass: "bg-blue-400",
        }
      default:
        return {
          label: "Seeker",
          emoji: "👤",
          pillClass: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
          dotClass: "bg-[#818cf8]",
        }
    }
  }, [role])

  const handleSignOut = async () => {
    try {
      setUserDropdownOpen(false)
      await signOut()
      toast.success("Signed out successfully")
      router.push("/sign-in")
      router.refresh()
    } catch {
      toast.error("Failed to sign out")
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#090a0f]/90 px-4 sm:px-6 backdrop-blur-xl transition-all">
      {/* Left: Sidebar Trigger + Logo + Breadcrumb */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-8 w-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors" />

        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80 shrink-0"
          title="Return to Home"
        >
          <img
            src="/images/logo.png"
            alt="HireLoop"
            className="h-6 sm:h-7 w-auto object-contain"
          />
        </Link>

        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        {/* Dynamic Breadcrumbs */}
        <nav className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Link href="/" className="hover:text-zinc-200 transition-colors">
            HireLoop
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400 capitalize">{role}</span>
          <span className="text-zinc-600">/</span>
          <span className="text-white font-medium truncate max-w-[180px]">
            {pageTitle}
          </span>
        </nav>
      </div>

      {/* Center: Quick Platform Links */}
      <div className="hidden lg:flex items-center gap-6">
        <Link
          href="/jobs"
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
        >
          <Compass className="h-3.5 w-3.5 text-[#818cf8]" />
          <span>Browse Jobs</span>
        </Link>

        <Link
          href="/pricing"
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
        >
          <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
          <span>Pricing</span>
        </Link>

        {role === "recruiter" && (
          <Link
            href="/dashboard/recruiter/jobs/new"
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Post New Job</span>
          </Link>
        )}

        {(role === "admin" || role === "superadmin") && (
          <Link
            href="/dashboard/admin/users"
            className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Admin Governance</span>
          </Link>
        )}
      </div>

      {/* Right: Actions + Role Pill + Notification Bell + Profile Dropdown */}
      <div className="flex items-center gap-3">
        {/* Role Active Pill Badge */}
        <div
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-mono font-semibold ${roleBadgeConfig.pillClass}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${roleBadgeConfig.dotClass}`} />
          <span>{roleBadgeConfig.emoji}</span>
          <span className="hidden sm:inline uppercase tracking-wider">{roleBadgeConfig.label}</span>
        </div>

        {/* Notifications Icon with Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen)
              setUserDropdownOpen(false)
            }}
            className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#665df5]" />
          </button>

          {notificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/10 bg-[#101118] p-4 text-white shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Notifications
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">Live Feed</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 space-y-1">
                    <div className="font-semibold text-white">System Synchronized</div>
                    <p className="text-[11px] text-zinc-400">
                      Connected to live MongoDB production database.
                    </p>
                  </div>
                  {role === "seeker" && (
                    <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-2.5 space-y-1">
                      <div className="font-semibold text-[#818cf8]">Applications Active</div>
                      <p className="text-[11px] text-zinc-400">
                        Check your pipeline status in the Seeker workspace.
                      </p>
                    </div>
                  )}
                  {(role === "admin" || role === "superadmin") && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-2.5 space-y-1">
                      <div className="font-semibold text-amber-400">Super Admin Mode</div>
                      <p className="text-[11px] text-zinc-400">
                        Full authorization to approve pending administrators.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Avatar Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setUserDropdownOpen(!userDropdownOpen)
              setNotificationsOpen(false)
            }}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1 sm:pr-2.5 hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            <img
              src={
                user?.image ||
                `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100`
              }
              alt={user?.name || "User"}
              className="h-7 w-7 rounded-lg object-cover border border-white/15"
            />
            <span className="hidden sm:inline text-xs font-semibold text-white max-w-[100px] truncate">
              {user?.name || "My Account"}
            </span>
            <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {userDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-white/10 bg-[#101118] p-2 text-white shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Account Details Header */}
                <div className="border-b border-white/10 px-3 py-2.5 space-y-1">
                  <p className="truncate text-xs font-bold text-white">
                    {user?.name || "User"}
                  </p>
                  <p className="truncate text-[11px] font-mono text-zinc-400">
                    {user?.email || "user@hireloop.io"}
                  </p>
                  <div className="pt-1">
                    <span className="inline-block rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-zinc-300">
                      {role}
                    </span>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="py-1.5 space-y-0.5">
                  <Link
                    href={
                      role === "admin" || role === "superadmin"
                        ? "/dashboard/admin"
                        : role === "recruiter"
                        ? "/dashboard/recruiter"
                        : "/dashboard/seeker"
                    }
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-[#818cf8]" />
                    <span>Workspace Dashboard</span>
                  </Link>

                  <Link
                    href="/jobs"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Compass className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Browse Public Jobs</span>
                  </Link>

                  <Link
                    href="/"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Home className="h-3.5 w-3.5 text-zinc-400" />
                    <span>HireLoop Landing Page</span>
                  </Link>
                </div>

                {/* Sign Out Action */}
                <div className="border-t border-white/10 pt-1">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
