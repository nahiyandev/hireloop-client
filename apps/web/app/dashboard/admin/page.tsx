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

const transactions: Transaction[] = [
  {
    id: "tx-1",
    userEmail: "marcus.k@techcorp.io",
    company: "TechCorp Inc.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    planType: "Enterprise Monthly",
    transactionId: "#TXN-902341",
    amount: "$1,299.00",
    date: "Oct 24, 2023, 14:20",
    status: "Success",
  },
  {
    id: "tx-2",
    userEmail: "sarah.l@creativestudio.com",
    company: "Creative Studio",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    planType: "Professional Annual",
    transactionId: "#TXN-882103",
    amount: "$499.00",
    date: "Oct 24, 2023, 11:05",
    status: "Success",
  },
  {
    id: "tx-3",
    userEmail: "j.doe@freelance.org",
    company: "Independent",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    planType: "Starter Monthly",
    transactionId: "#TXN-774129",
    amount: "$49.00",
    date: "Oct 23, 2023, 16:45",
    status: "Pending",
  },
  {
    id: "tx-4",
    userEmail: "admin@retailglobal.net",
    company: "Retail Global",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    planType: "Enterprise Monthly",
    transactionId: "#TXN-552014",
    amount: "$1,299.00",
    date: "Oct 23, 2023, 09:12",
    status: "Failed",
  },
]

export default function AdminDashboardOverviewPage() {
  const [searchQuery, setSearchQuery] = React.useState("")

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
            <span className="text-[11px] font-semibold text-emerald-400 font-mono">↑12%</span>
          </div>
          <div className="mt-4">
            <span className="text-[11px] text-zinc-400 font-medium">Total Users</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">124,892</div>
          </div>
        </div>

        {/* Card 2: Total Recruiters */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-300">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 font-mono">↑8%</span>
          </div>
          <div className="mt-4">
            <span className="text-[11px] text-zinc-400 font-medium">Total Recruiters</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">12,405</div>
          </div>
        </div>

        {/* Card 3: Total Companies */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-300">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-500 font-mono">-0%</span>
          </div>
          <div className="mt-4">
            <span className="text-[11px] text-zinc-400 font-medium">Total Companies</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">4,281</div>
          </div>
        </div>

        {/* Card 4: Jobs Posted */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-300">
              <FolderKanban className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 font-mono">↑24%</span>
          </div>
          <div className="mt-4">
            <span className="text-[11px] text-zinc-400 font-medium">Jobs Posted</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">8,920</div>
          </div>
        </div>

        {/* Card 5: Platform Revenue */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-4 flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-300">
              <CreditCard className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 font-mono">↑18.5%</span>
          </div>
          <div className="mt-4">
            <span className="text-[11px] text-zinc-400 font-medium">Platform Revenue</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">$245,800</div>
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
              {transactions.map((t) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
