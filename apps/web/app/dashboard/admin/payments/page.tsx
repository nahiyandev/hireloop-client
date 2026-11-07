"use client"

import * as React from "react"
import {
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  Download,
  Filter,
  TrendingUp,
  User,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/components/sonner"

interface PaymentTransaction {
  id: string
  userEmail: string
  avatar: string
  plan: "Enterprise" | "Pro" | "Starter"
  amount: string
  date: string
  transactionId: string
  status: "Success" | "Pending" | "Failed"
}

const paymentRows: PaymentTransaction[] = [
  {
    id: "tx-p1",
    userEmail: "jordan.daniels@enterprise.co",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    plan: "Enterprise",
    amount: "$4,500.00",
    date: "May 19, 2026 • Just now",
    transactionId: "TXN-882910443",
    status: "Success",
  },
  {
    id: "tx-p2",
    userEmail: "sarah.k@techflow.io",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    plan: "Pro",
    amount: "$299.00",
    date: "May 18, 2026 • 1 day ago",
    transactionId: "TXN-773410291",
    status: "Success",
  },
  {
    id: "tx-p3",
    userEmail: "marcus.lee@gmail.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    plan: "Starter",
    amount: "$49.00",
    date: "May 17, 2026 • 2 days ago",
    transactionId: "TXN-110294857",
    status: "Pending",
  },
  {
    id: "tx-p4",
    userEmail: "e.lopez@globalfoundries.com",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100",
    plan: "Enterprise",
    amount: "$12,000.00",
    date: "May 10, 2026 • 9 days ago",
    transactionId: "TXN-009485712",
    status: "Failed",
  },
]

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = React.useState<PaymentTransaction[]>(paymentRows)
  const [filterPlan, setFilterPlan] = React.useState<string>("all")

  const filteredTransactions = transactions.filter((t) => {
    return filterPlan === "all" || t.plan === filterPlan
  })

  const getStatusBadge = (status: PaymentTransaction["status"]) => {
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

  const handleExportCSV = () => {
    toast.success("Exporting CSV", {
      description: "Generating financial transactions ledger...",
    })
  }

  return (
    <div className="space-y-8">
      {/* Top Header (Figma Screenshot 4) */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Payments & Subscriptions
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Comprehensive overview of platform revenue and active subscriptions.
        </p>
      </div>

      {/* 4 Revenue Stat Cards (Exact match from Screenshot 4) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-300">
              <CreditCard className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 font-mono">↑12.4%</span>
          </div>
          <div className="mt-4">
            <span className="text-xs text-zinc-400 font-medium">Total Revenue</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">$1,284,500</div>
          </div>
        </div>

        {/* Card 2: Monthly Revenue */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-300">
              <Calendar className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 font-mono">↑8.1%</span>
          </div>
          <div className="mt-4">
            <span className="text-xs text-zinc-400 font-medium">Monthly Revenue</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">$94,210</div>
          </div>
        </div>

        {/* Card 3: Active Pro Users */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-300">
              <User className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-amber-400 font-mono">↑2.3%</span>
          </div>
          <div className="mt-4">
            <span className="text-xs text-zinc-400 font-medium">Active Pro Users</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">12,408</div>
          </div>
        </div>

        {/* Card 4: Active Enterprise Users */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-300">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 font-mono">↑15.7%</span>
          </div>
          <div className="mt-4">
            <span className="text-xs text-zinc-400 font-medium">Active Enterprise Users</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">842</div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table (Exact match from Screenshot 4) */}
      <div className="rounded-2xl border border-white/5 bg-[#0c0d12] overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <h2 className="text-sm font-semibold text-white">Recent Transactions</h2>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilterPlan(
                  filterPlan === "all" ? "Enterprise" : filterPlan === "Enterprise" ? "Pro" : "all"
                )
              }
              className="h-8 gap-1.5 rounded-xl border-white/10 bg-white/[0.03] text-xs text-zinc-300 hover:text-white"
            >
              <Filter className="h-3.5 w-3.5 text-zinc-400" />
              <span>Filter: {filterPlan === "all" ? "All" : filterPlan}</span>
            </Button>

            <Button
              onClick={handleExportCSV}
              size="sm"
              className="h-8 gap-1.5 rounded-xl bg-white text-xs font-semibold text-zinc-900 hover:bg-zinc-100 shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/5 bg-white/[0.01] text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-6 py-4">USER EMAIL</th>
                <th className="px-6 py-4">PLAN</th>
                <th className="px-6 py-4">AMOUNT</th>
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">TRANSACTION ID</th>
                <th className="px-6 py-4 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="transition-colors hover:bg-white/[0.01]">
                  {/* USER EMAIL with Avatar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={tx.avatar}
                        alt={tx.userEmail}
                        className="h-8 w-8 rounded-full object-cover border border-white/10"
                      />
                      <span className="font-medium text-white">{tx.userEmail}</span>
                    </div>
                  </td>

                  {/* PLAN PILL */}
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-white/[0.04] px-3 py-1 text-[11px] text-zinc-300 border border-white/5 font-medium">
                      {tx.plan}
                    </span>
                  </td>

                  {/* AMOUNT */}
                  <td className="px-6 py-4 font-semibold text-white font-mono">
                    {tx.amount}
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4 text-zinc-400 font-mono text-[11px]">
                    {tx.date}
                  </td>

                  {/* TRANSACTION ID */}
                  <td className="px-6 py-4 font-mono text-[11px] text-zinc-400">
                    {tx.transactionId}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4 text-right">
                    {getStatusBadge(tx.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
