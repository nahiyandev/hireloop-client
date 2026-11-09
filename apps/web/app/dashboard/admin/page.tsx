"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  CreditCard,
  Crown,
  Loader2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { toast } from "@workspace/ui/components/sonner"

interface Transaction {
  id: string
  userEmail: string
  planType: string
  amount: string
  date: string
  status: "Success" | "Pending" | "Failed"
}

export default function AdminDashboardOverviewPage() {
  const { data: session } = useSession()
  const adminName = session?.user?.name || "Admin"
  const [isSuperAdmin, setIsSuperAdmin] = React.useState(false)

  const [stats, setStats] = React.useState({
    totalUsers: 0,
    pendingAdmins: 0,
    activeJobs: 0,
    totalRevenue: 0,
  })
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
        const [usersRes, jobsRes, paymentsRes] = await Promise.all([
          fetch(`${apiUrl}/users`).catch(() => null),
          fetch(`${apiUrl}/jobs`).catch(() => null),
          fetch(`${apiUrl}/payments`).catch(() => null),
        ])

        let totalUsers = 0
        let pendingAdmins = 0
        if (usersRes?.ok) {
          const users = await usersRes.json()
          if (Array.isArray(users)) {
            totalUsers = users.length
            pendingAdmins = users.filter(
              (u: any) => u.role === "admin" && (u.adminApproved === false || u.status === "Pending")
            ).length

            // Determine if the current authenticated user has Super Admin authority
            const myEmail = session?.user?.email?.toLowerCase()
            const sessionRole = (session?.user as any)?.role || (session?.user as any)?.selectedRole
            const me = users.find((u: any) => u.email?.toLowerCase() === myEmail)

            if (me?.role === "superadmin" || sessionRole === "superadmin") {
              setIsSuperAdmin(true)
            } else {
              setIsSuperAdmin(false)
            }
          }
        }

        let activeJobs = 0
        if (jobsRes?.ok) {
          const jobs = await jobsRes.json()
          if (Array.isArray(jobs)) activeJobs = jobs.length
        }

        let totalRevenue = 0
        let txList: Transaction[] = []
        if (paymentsRes?.ok) {
          const pays = await paymentsRes.json()
          if (Array.isArray(pays)) {
            pays.forEach((p: any) => {
              const amt = parseFloat(String(p.amount || "0").replace(/[^0-9.]/g, "")) || 0
              totalRevenue += amt
            })
            txList = pays.slice(0, 5).map((p: any, idx: number) => ({
              id: p._id || `tx-${idx}`,
              userEmail: p.userEmail || "user@example.com",
              planType: p.plan ? `${p.plan} Plan` : "Pro Plan",
              amount: p.amount || `$${(parseFloat(String(p.amount || "20").replace(/[^0-9.]/g, "")) || 20).toFixed(2)}`,
              date: p.date
                ? new Date(p.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                : "Recently",
              status: (p.status || "Success") as Transaction["status"],
            }))
          }
        }

        setStats({ totalUsers, pendingAdmins, activeJobs, totalRevenue })
        setTransactions(txList)
      } catch (err) {
        console.warn("Admin dashboard load error:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [session])

  const statCards = [
    {
      label: "Total Platform Users",
      value: isLoading ? "—" : stats.totalUsers.toString(),
      sub: "Live MongoDB records",
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Pending Admin Approvals",
      value: isLoading ? "—" : stats.pendingAdmins.toString(),
      sub: stats.pendingAdmins > 0 ? "⚠️ Action required" : "All admins approved",
      icon: ShieldAlert,
      color: stats.pendingAdmins > 0 ? "text-amber-400" : "text-emerald-400",
      bg: stats.pendingAdmins > 0 ? "bg-amber-500/10" : "bg-emerald-500/10",
      border: stats.pendingAdmins > 0 ? "border-amber-500/30" : "border-white/5",
      urgent: stats.pendingAdmins > 0,
    },
    {
      label: "Active Job Listings",
      value: isLoading ? "—" : stats.activeJobs.toString(),
      sub: "Published on platform",
      icon: Briefcase,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
    {
      label: "Platform Revenue",
      value: isLoading ? "—" : `$${stats.totalRevenue.toLocaleString()}`,
      sub: "All-time subscriptions",
      icon: CreditCard,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
  ]

  const quickActions = [
    {
      title: "User Management",
      desc: "Review & approve pending admins, manage roles",
      href: "/dashboard/admin/users",
      icon: Users,
      accent: "text-amber-400",
      badge: stats.pendingAdmins > 0 ? `${stats.pendingAdmins} pending` : null,
      badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    },
    {
      title: "Payments Log",
      desc: "View subscription revenue & transaction history",
      href: "/dashboard/admin/payments",
      icon: CreditCard,
      accent: "text-emerald-400",
      badge: null,
    },
    {
      title: "Job Moderation",
      desc: "Review, moderate & manage active job listings",
      href: "/dashboard/admin/jobs",
      icon: Briefcase,
      accent: "text-indigo-400",
      badge: null,
    },
    {
      title: "Verified Companies",
      desc: "Company directory & employer verification status",
      href: "/dashboard/admin/companies",
      icon: Building2,
      accent: "text-blue-400",
      badge: null,
    },
  ]

  return (
    <div className="space-y-8">
      {/* ── Header (Role-Aware: Super Admin vs Platform Admin) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                isSuperAdmin
                  ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                  : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
              }`}
            >
              {isSuperAdmin ? <Crown className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                {isSuperAdmin ? "Super Admin Command Center" : "Admin Console"}
              </h1>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                {isSuperAdmin
                  ? `Root platform authority — ${adminName}`
                  : `Platform operations & governance — ${adminName}`}
              </p>
            </div>
          </div>
        </div>

        {isSuperAdmin ? (
          <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-mono font-semibold text-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>
            👑 SUPER ADMIN ACTIVE
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-mono font-semibold text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            🛡️ ADMIN CONSOLE
          </div>
        )}
      </div>

      {/* ── Pending Admins Alert Banner ── */}
      {!isLoading && stats.pendingAdmins > 0 && (
        <Link href="/dashboard/admin/users" className="block group">
          <div
            className={`rounded-2xl border p-4 flex items-center justify-between gap-4 shadow-lg transition-all ${
              isSuperAdmin
                ? "border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-[#0c0d12] to-amber-950/20 shadow-amber-950/20 hover:border-amber-500/60"
                : "border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-[#0c0d12] to-emerald-950/20 shadow-emerald-950/20 hover:border-emerald-500/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                  isSuperAdmin
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                    : "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                }`}
              >
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <p className={`text-sm font-bold ${isSuperAdmin ? "text-amber-300" : "text-emerald-300"}`}>
                  {stats.pendingAdmins} Admin Approval{stats.pendingAdmins > 1 ? "s" : ""}{" "}
                  {isSuperAdmin ? "Awaiting Your Authorization" : "Pending Review"}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {isSuperAdmin
                    ? "Super Admin authorization required: Click to review and approve administrator requests."
                    : "Awaiting approval by root Super Admin."}
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-1.5 text-xs font-semibold ${
                isSuperAdmin
                  ? "text-amber-400 group-hover:text-amber-300"
                  : "text-emerald-400 group-hover:text-emerald-300"
              } shrink-0`}
            >
              <span>Review Now</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Link>
      )}

      {/* ── 4 Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className={`rounded-2xl border p-5 flex flex-col gap-3 transition-all ${card.border} ${card.urgent ? "bg-amber-950/20 shadow-lg shadow-amber-950/20" : "bg-[#0c0d12]"}`}
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.bg}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
                {card.urgent && (
                  <span className="text-[10px] font-mono font-bold text-amber-400 animate-pulse">
                    ACTION
                  </span>
                )}
              </div>
              <div>
                <div className={`text-2xl font-extrabold tracking-tight ${card.urgent ? "text-amber-400" : "text-white"}`}>
                  {card.value}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">{card.label}</div>
                <div className={`text-[11px] mt-1 font-medium ${card.color}`}>{card.sub}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Quick Action Cards ── */}
      <div>
        <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 font-semibold">
          Command Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href} className="group block">
                <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5 h-full space-y-3 hover:border-white/15 hover:bg-white/[0.03] transition-all">
                  <div className="flex items-start justify-between">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/5`}>
                      <Icon className={`h-4 w-4 ${action.accent}`} />
                    </div>
                    {action.badge && (
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono font-semibold ${action.badgeColor}`}>
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-white/90">
                      {action.title}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      {action.desc}
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-[11px] font-semibold ${action.accent} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <span>Open</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Recent Transactions (5 rows) ── */}
      <div className="rounded-2xl border border-white/5 bg-[#0c0d12] overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">Recent Transactions</h2>
          </div>
          <Link
            href="/dashboard/admin/payments"
            className="text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
          >
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/5 bg-white/[0.01] text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Plan</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center">
                    <Loader2 className="h-5 w-5 animate-spin text-amber-400 mx-auto" />
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-zinc-500">
                    No transactions recorded yet.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-3.5 font-mono text-[11px] text-zinc-300">{t.userEmail}</td>
                    <td className="px-6 py-3.5">
                      <span className="rounded-full bg-white/[0.04] border border-white/5 px-2.5 py-0.5 text-[11px] text-zinc-300">
                        {t.planType}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-mono font-semibold text-white">{t.amount}</td>
                    <td className="px-6 py-3.5 font-mono text-[11px] text-zinc-400">{t.date}</td>
                    <td className="px-6 py-3.5 text-right">
                      {t.status === "Success" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Success
                        </span>
                      ) : t.status === "Pending" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-amber-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" /> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-rose-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" /> Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
