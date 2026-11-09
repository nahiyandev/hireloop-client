"use client"

import * as React from "react"
import Link from "next/link"
import {
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  Download,
  FolderKanban,
  HelpCircle,
  MoreVertical,
  Search,
  TrendingDown,
  TrendingUp,
  User,
  Users,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { toast } from "@workspace/ui/components/sonner"

interface Transaction {
  id: string
  userEmail: string
  company: string
  avatar: string
  planType: string
  transactionId: string
  amount: string
  date: string
  status: "Success" | "Pending" | "Failed"
}

export default function AdminDashboardOverviewPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statsData, setStatsData] = React.useState({
    totalUsers: 0,
    totalRecruiters: 0,
    totalCompanies: 0,
    jobsPosted: 0,
    platformRevenue: "$0.00",
  })
  const [transactionsList, setTransactionsList] = React.useState<Transaction[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadAdminData() {
      setIsLoading(true)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
        const [usersRes, jobsRes, companiesRes, paymentsRes] = await Promise.all([
          fetch(`${apiUrl}/users`).catch(() => null),
          fetch(`${apiUrl}/jobs`).catch(() => null),
          fetch(`${apiUrl}/companies`).catch(() => null),
          fetch(`${apiUrl}/payments`).catch(() => null),
        ])

        let userCount = 0
        let recruiterCount = 0
        if (usersRes && usersRes.ok) {
          const users = await usersRes.json()
          if (Array.isArray(users)) {
            userCount = users.length
            recruiterCount = users.filter((u: any) => u.role === "recruiter").length
          }
        }

        let jobCount = 0
        if (jobsRes && jobsRes.ok) {
          const jobs = await jobsRes.json()
          if (Array.isArray(jobs)) {
            jobCount = jobs.length
          }
        }

        let companyCount = 0
        if (companiesRes && companiesRes.ok) {
          const comps = await companiesRes.json()
          if (Array.isArray(comps)) {
            companyCount = comps.length
          }
        }

        let paymentList: Transaction[] = []
        let totalRev = 0
        if (paymentsRes && paymentsRes.ok) {
          const pays = await paymentsRes.json()
          if (Array.isArray(pays)) {
            paymentList = pays.map((p: any, idx: number) => {
              const amtNum = parseFloat(String(p.amount || "20").replace(/[^0-9.]/g, "")) || 20
              totalRev += amtNum
              return {
                id: p._id || p.transactionId || `tx-${idx}`,
                userEmail: p.userEmail || "user@example.com",
                company: p.company || "HireLoop Member",
                avatar: `https://images.unsplash.com/photo-${1500000000000 + idx * 1000}?w=100`,
                planType: p.plan ? `${p.plan} Plan` : "Pro Plan",
                transactionId: p.transactionId || `#TXN-${882100 + idx}`,
                amount: p.amount || `$${amtNum.toFixed(2)}`,
                date: p.date
                  ? new Date(p.date).toLocaleString("en-US", {
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Recently",
                status: (p.status || "Success") as Transaction["status"],
              }
            })
          }
        }

        setStatsData({
          totalUsers: userCount,
          totalRecruiters: recruiterCount,
          totalCompanies: companyCount,
          jobsPosted: jobCount,
          platformRevenue: `$${totalRev.toLocaleString()}`,
        })
        setTransactionsList(paymentList)
      } catch (err) {
        console.warn("Could not load admin overview data:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadAdminData()
  }, [])

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "Success":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Success
          </span>
        )
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Pending
          </span>
        )
      case "Failed":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            Failed
          </span>
        )
    }
  }

  const handleExport = () => {
    toast.success("Exporting Report", {
      description: "Generating platform performance metrics (CSV)...",
    })
  }

  return (
    <div className="space-y-8">
      {/* Top Search & Executive Tools (Figma exact) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Real-time platform performance and growth metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-9 gap-2 rounded-xl border-white/10 bg-white/[0.03] text-xs text-zinc-300 hover:text-white"
          >
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span>Last 30 Days</span>
          </Button>

          <Button
            onClick={handleExport}
            className="h-9 rounded-xl bg-white text-xs font-semibold text-zinc-900 hover:bg-zinc-100 shadow-sm transition-all"
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* 5 Stats Cards (Exact match with Figma Screenshot 1) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Total Users */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-300">
              <User className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 font-mono">Live</span>
          </div>
          <div className="mt-4">
            <span className="text-[11px] text-zinc-400 font-medium">Total Users</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">
              {isLoading ? "..." : statsData.totalUsers}
            </div>
          </div>
        </div>

        {/* Card 2: Total Recruiters */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-300">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 font-mono">Live</span>
          </div>
          <div className="mt-4">
            <span className="text-[11px] text-zinc-400 font-medium">Total Recruiters</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">
              {isLoading ? "..." : statsData.totalRecruiters}
            </div>
          </div>
        </div>

        {/* Card 3: Total Companies */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-300">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 font-mono">Verified</span>
          </div>
          <div className="mt-4">
            <span className="text-[11px] text-zinc-400 font-medium">Total Companies</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">
              {isLoading ? "..." : statsData.totalCompanies}
            </div>
          </div>
        </div>

        {/* Card 4: Jobs Posted */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-300">
              <FolderKanban className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 font-mono">Active</span>
          </div>
          <div className="mt-4">
            <span className="text-[11px] text-zinc-400 font-medium">Jobs Posted</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">
              {isLoading ? "..." : statsData.jobsPosted}
            </div>
          </div>
        </div>

        {/* Card 5: Platform Revenue */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-4 flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-300">
              <CreditCard className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 font-mono">Stripe</span>
          </div>
          <div className="mt-4">
            <span className="text-[11px] text-zinc-400 font-medium">Platform Revenue</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">
              {isLoading ? "..." : statsData.platformRevenue}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Subscription Transactions (Exact Table from Figma Screenshot 1) */}
      <div className="rounded-2xl border border-white/5 bg-[#0c0d12] overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <h2 className="text-sm font-semibold text-white">Recent Subscription Transactions</h2>
          <Link
            href="/dashboard/admin/payments"
            className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            View All Activity
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/5 bg-white/[0.01] text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-6 py-3.5">USER/RECRUITER</th>
                <th className="px-6 py-3.5">PLAN TYPE</th>
                <th className="px-6 py-3.5">TRANSACTION ID</th>
                <th className="px-6 py-3.5">AMOUNT</th>
                <th className="px-6 py-3.5">DATE</th>
                <th className="px-6 py-3.5 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactionsList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                    No transactions recorded yet.
                  </td>
                </tr>
              ) : (
                transactionsList.slice(0, 5).map((t) => (
                  <tr key={t.id} className="transition-colors hover:bg-white/[0.01]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={t.avatar}
                          alt={t.userEmail}
                          className="h-8 w-8 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <div className="font-medium text-white">{t.userEmail}</div>
                          <div className="text-[11px] text-zinc-400">{t.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-white/[0.04] px-3 py-1 text-[11px] text-zinc-300 border border-white/5 font-medium">
                        {t.planType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-zinc-400">{t.transactionId}</td>
                    <td className="px-6 py-4 font-semibold text-white font-mono">{t.amount}</td>
                    <td className="px-6 py-4 text-zinc-400 font-mono text-[11px]">{t.date}</td>
                    <td className="px-6 py-4 text-right">{getStatusBadge(t.status)}</td>
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
