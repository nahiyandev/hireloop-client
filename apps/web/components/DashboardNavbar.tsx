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
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSession, signOut } from "@/lib/auth-client"
import { toast } from "@workspace/ui/components/sonner"

export function DashboardNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false)
  const [notificationsOpen, setNotificationsOpen] = React.useState(false)
  const [searchVal, setSearchVal] = React.useState("")

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
    if (pathname.includes("/admin/jobs")) return "Job Moderation"
    if (pathname.includes("/admin/settings")) return "System Settings"
    if (pathname.includes("/recruiter/jobs/new")) return "Create Job Listing"
    if (pathname.includes("/recruiter/jobs")) return "Manage Job Postings"
    if (pathname.includes("/recruiter/applicants")) return "Candidate Pipeline"
    if (pathname.includes("/recruiter/company")) return "Company Profile"
    if (pathname.includes("/recruiter/settings")) return "Recruiter Settings"
    if (pathname.includes("/seeker/applications")) return "My Applications"
    if (pathname.includes("/seeker/saved")) return "Saved Opportunities"
    if (pathname.includes("/seeker/settings")) return "Profile Settings"
    if (pathname.startsWith("/dashboard/admin")) return "Admin Console"
    if (pathname.startsWith("/dashboard/recruiter")) return "Recruiter Portal"
    if (pathname.startsWith("/dashboard/seeker")) return "Seeker Workspace"
    return "Dashboard"
  }, [pathname])

  const portalName = React.useMemo(() => {
    if (role === "superadmin") return "Super Admin Console"
    if (role === "admin") return "Admin Console"
    if (role === "recruiter") return "Recruiter Portal"
    return "Seeker Space"
  }, [role])

  const roleBadgeConfig = React.useMemo(() => {
    switch (role) {
      case "superadmin":
        return {
          label: "SUPER ADMIN",
          emoji: "👑",
          pillClass: "border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
          dotClass: "bg-amber-400",
        }
      case "admin":
        return {
          label: "ADMIN",
          emoji: "🛡️",
          pillClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
          dotClass: "bg-emerald-400",
        }
      case "recruiter":
        return {
          label: "RECRUITER",
          emoji: "💼",
          pillClass: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.15)]",
          dotClass: "bg-[#818cf8]",
        }
      default:
        return {
          label: "SEEKER",
          emoji: "👤",
          pillClass: "border-blue-500/30 bg-blue-500/10 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.15)]",
          dotClass: "bg-blue-400",
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchVal.trim()) return
    router.push(`/jobs?q=${encodeURIComponent(searchVal.trim())}`)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#090a0f]/90 px-4 sm:px-6 backdrop-blur-xl transition-all">
      {/* Left: Sidebar Trigger + Modern Breadcrumb Hierarchy */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-8 w-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer" />

        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        {/* Dynamic SaaS Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
            title="Return to Home"
          >
            <Home className="h-3.5 w-3.5 text-zinc-500" />
            <span className="hidden sm:inline font-medium">HireLoop</span>
          </Link>

          <span className="text-zinc-600 font-mono">/</span>

          <span className="text-zinc-400 font-medium hidden md:inline truncate max-w-[140px]">
            {portalName}
          </span>

          <span className="text-zinc-600 font-mono hidden md:inline">/</span>

          <div className="flex items-center gap-1.5 rounded-md bg-white/[0.04] px-2 py-0.5 border border-white/5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#665df5] animate-pulse" />
            <span className="text-white font-semibold text-xs tracking-tight truncate max-w-[160px] sm:max-w-[220px]">
              {pageTitle}
            </span>
          </div>
        </nav>
      </div>

      {/* Center: Sleek Quick Search Bar */}
      <div className="hidden lg:flex items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="absolute left-3 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search jobs, companies, skills..."
            className="h-8 w-60 xl:w-72 rounded-full border border-white/10 bg-white/[0.03] pl-8 pr-10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#665df5]/50 focus:bg-white/[0.06] transition-all"
          />
          <kbd className="absolute right-2.5 top-2 pointer-events-none rounded border border-white/10 bg-white/5 px-1.5 text-[9px] font-mono text-zinc-400">
            ↵
          </kbd>
        </form>

        <div className="h-4 w-px bg-white/10" />

        {/* Quick Nav Links */}
        <div className="flex items-center gap-4">
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
              className="flex items-center gap-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-2.5 py-1 rounded-lg transition-all shadow-sm shadow-indigo-600/30"
            >
              <Plus className="h-3 w-3" />
              <span>Post Job</span>
            </Link>
          )}

          {(role === "admin" || role === "superadmin") && (
            <Link
              href="/dashboard/admin/users"
              className="flex items-center gap-1.5 text-xs font-medium text-purple-300 hover:text-purple-200 transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
              <span>Governance</span>
            </Link>
          )}
        </div>
      </div>

      {/* Right: Actions + Role Pill + Notification Bell + Profile Dropdown */}
      <div className="flex items-center gap-3">
        {/* Role Active Pill Badge with glowing dot */}
        <div
          className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-mono font-semibold transition-all ${roleBadgeConfig.pillClass}`}
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${roleBadgeConfig.dotClass}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${roleBadgeConfig.dotClass}`} />
          </span>
          <span className="tracking-wide uppercase">{roleBadgeConfig.label}</span>
        </div>

        {/* Notifications Icon with Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen)
              setUserDropdownOpen(false)
            }}
            className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="System Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#665df5] animate-pulse" />
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
                    System Feed
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 space-y-1">
                    <div className="font-semibold text-white">Production Database</div>
                    <p className="text-[11px] text-zinc-400">
                      Connected to live MongoDB production database.
                    </p>
                  </div>
                  {role === "seeker" && (
                    <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-2.5 space-y-1">
                      <div className="font-semibold text-[#818cf8]">Seeker Verification</div>
                      <p className="text-[11px] text-zinc-400">
                        Exclusive application rights active on all open job listings.
                      </p>
                    </div>
                  )}
                  {role === "recruiter" && (
                    <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-2.5 space-y-1">
                      <div className="font-semibold text-indigo-400">Candidate Pipeline</div>
                      <p className="text-[11px] text-zinc-400">
                        Track live candidate applications and review seeker profiles.
                      </p>
                    </div>
                  )}
                  {(role === "admin" || role === "superadmin") && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-2.5 space-y-1">
                      <div className="font-semibold text-amber-400">
                        {role === "superadmin" ? "Super Admin Authority" : "Admin Console"}
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        {role === "superadmin"
                          ? "Full governance authorization to approve pending admins and promote accounts."
                          : "Administrator moderation active. Super Admin promotions require Super Admin privileges."}
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
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-[#101118] p-2 text-white shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Account Details Header */}
                <div className="border-b border-white/10 px-3 py-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-xs font-bold text-white">
                      {user?.name || "User"}
                    </p>
                    <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-zinc-300 border border-white/5">
                      {role}
                    </span>
                  </div>
                  <p className="truncate text-[11px] font-mono text-zinc-400">
                    {user?.email || "user@hireloop.io"}
                  </p>
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
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
