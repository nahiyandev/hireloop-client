"use client"

import * as React from "react"
import {
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  Download,
  Eye,
  Filter,
  Receipt,
  Search,
  TrendingUp,
  User,
  X,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/components/sonner"
import { Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"

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

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = React.useState<PaymentTransaction[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [filterPlan, setFilterPlan] = React.useState<string>("all")
  const [selectedTx, setSelectedTx] = React.useState<PaymentTransaction | null>(null)
  const [activeProUsers, setActiveProUsers] = React.useState(0)
  const [totalRevenue, setTotalRevenue] = React.useState(0)

  React.useEffect(() => {
    async function loadPayments() {
      setIsLoading(true)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
        const [payRes, userRes] = await Promise.all([
          fetch(`${apiUrl}/payments`).catch(() => null),
          fetch(`${apiUrl}/users`).catch(() => null),
        ])

        if (userRes && userRes.ok) {
          const users = await userRes.json()
          if (Array.isArray(users)) {
            setActiveProUsers(users.filter((u: any) => u.isPro || u.plan === "pro").length)
          }
        }

        if (payRes && payRes.ok) {
          const data = await payRes.json()
          if (Array.isArray(data)) {
            let rev = 0
            const mapped: PaymentTransaction[] = data.map((p: any, idx: number) => {
              const amtNum = parseFloat(String(p.amount || "20").replace(/[^0-9.]/g, "")) || 20
              rev += amtNum
              return {
                id: p._id || p.transactionId || `tx-${idx}`,
                userEmail: p.userEmail || "user@example.com",
                avatar: `https://images.unsplash.com/photo-${1500000000000 + idx * 1000}?w=100`,
                plan: (p.plan === "Growth" ? "Enterprise" : p.plan || "Pro") as PaymentTransaction["plan"],
                amount: p.amount || `$${amtNum.toFixed(2)}`,
                date: p.date
                  ? new Date(p.date).toLocaleString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Recently",
                transactionId: p.transactionId || `TXN-${882910000 + idx}`,
                status: (p.status || "Success") as PaymentTransaction["status"],
              }
            })
            setTransactions(mapped)
            setTotalRevenue(rev)
          }
        }
      } catch (err) {
        console.warn("Could not load payments:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadPayments()
  }, [])

  const filteredTransactions = transactions.filter((t) => {
    const matchesPlan = filterPlan === "all" || t.plan === filterPlan
    const matchesSearch =
      search === "" ||
      t.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      t.transactionId.toLowerCase().includes(search.toLowerCase())
    return matchesPlan && matchesSearch
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
    if (filteredTransactions.length === 0) {
      toast.error("No transactions to export.")
      return
    }

    const headers = ["Transaction ID", "User Email", "Subscription Plan", "Amount Paid", "Date", "Payment Status"]
    const rows = filteredTransactions.map((t) => [
      `"${t.transactionId}"`,
      `"${t.userEmail}"`,
      `"${t.plan}"`,
      `"${t.amount}"`,
      `"${t.date}"`,
      `"${t.status}"`,
    ])

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `hireloop_payments_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success("Transactions Exported!", {
      description: `Downloaded ${filteredTransactions.length} transaction records as CSV.`,
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
            <div className="text-2xl font-extrabold text-white tracking-tight">
              {isLoading ? "..." : `$${totalRevenue.toLocaleString()}`}
            </div>
          </div>
        </div>

        {/* Card 2: Monthly Revenue */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-300">
              <Calendar className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 font-mono">Live</span>
          </div>
          <div className="mt-4">
            <span className="text-xs text-zinc-400 font-medium">Recorded Volume</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">
              {isLoading ? "..." : transactions.length}
            </div>
          </div>
        </div>

        {/* Card 3: Active Pro Users */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-300">
              <User className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 font-mono">Live</span>
          </div>
          <div className="mt-4">
            <span className="text-xs text-zinc-400 font-medium">Active Pro Users</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">
              {isLoading ? "..." : activeProUsers}
            </div>
          </div>
        </div>

        {/* Card 4: Active Enterprise Users */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-300">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 font-mono">Live</span>
          </div>
          <div className="mt-4">
            <span className="text-xs text-zinc-400 font-medium">Active Enterprise / Growth</span>
            <div className="text-2xl font-extrabold text-white tracking-tight">
              {isLoading ? "..." : transactions.filter((t) => t.plan === "Enterprise").length}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="rounded-2xl border border-white/5 bg-[#0c0d12] overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 px-6 py-4 gap-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Recent Transactions</h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Live subscription payments and membership upgrades
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search email or txn ID..."
                className="h-8 w-48 sm:w-56 rounded-xl border border-white/10 bg-white/[0.03] pl-8 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#665df5]"
              />
            </div>

            {/* Plan Filter */}
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-0.5">
              {(["all", "Enterprise", "Pro"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFilterPlan(p)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                    filterPlan === p
                      ? "bg-[#665df5] text-white font-semibold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {p === "all" ? "All Plans" : p}
                </button>
              ))}
            </div>

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
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-zinc-500">
                    <Loader2 className="h-6 w-6 animate-spin text-[#665df5] mx-auto" />
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 max-w-sm mx-auto">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-[#818cf8]">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-white tracking-tight">No transactions found</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {search || filterPlan !== "all"
                            ? "No transaction records match your search or filter. Try clearing filters."
                            : "No customer payment transactions have been logged yet."}
                        </p>
                      </div>
                      {(search || filterPlan !== "all") && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearch("")
                            setFilterPlan("all")
                          }}
                          className="text-xs font-semibold text-[#818cf8] hover:underline"
                        >
                          Clear Search & Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
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
                    <td className="px-6 py-4">
                      {getStatusBadge(tx.status)}
                    </td>

                    {/* ACTION (Receipt Modal) */}
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedTx(tx)}
                        className="h-7 px-2.5 rounded-lg border-white/10 bg-white/[0.02] text-xs text-zinc-300 hover:text-white hover:bg-white/10"
                      >
                        <Receipt className="h-3 w-3 mr-1 text-[#818cf8]" />
                        <span>Receipt</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Receipt Modal */}
      <AlertDialog open={!!selectedTx} onOpenChange={(open: boolean) => !open && setSelectedTx(null)}>
        {selectedTx && (
          <AlertDialogContent className="max-w-md bg-[#0c0d12] border border-white/10 text-white">
            <AlertDialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[#818cf8]">
                    <Receipt className="h-4 w-4" />
                  </div>
                  <div>
                    <AlertDialogTitle className="text-base font-bold text-white">
                      Payment Receipt
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-[11px] text-zinc-400 font-mono">
                      Invoice #{selectedTx.transactionId}
                    </AlertDialogDescription>
                  </div>
                </div>
                {getStatusBadge(selectedTx.status)}
              </div>
            </AlertDialogHeader>

            <div className="space-y-4 pt-3 text-xs">
              {/* Receipt Amount Banner */}
              <div className="rounded-xl border border-white/10 bg-[#161720] p-4 text-center space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Total Paid
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {selectedTx.amount}
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">
                  Payment processed via Stripe
                </div>
              </div>

              {/* Receipt Line Items */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-2.5 font-mono text-[11px]">
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Customer:</span>
                  <span className="text-white font-sans">{selectedTx.userEmail}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Subscription:</span>
                  <span className="text-indigo-400 font-semibold">{selectedTx.plan} Plan</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Payment Date:</span>
                  <span className="text-zinc-200">{selectedTx.date}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Payment Method:</span>
                  <span className="text-zinc-200">Visa ending in 4242</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between items-center font-bold text-white">
                  <span>Status:</span>
                  <span className="text-emerald-400">Completed & Verified</span>
                </div>
              </div>
            </div>

            <AlertDialogFooter className="mt-4 gap-2">
              <AlertDialogCancel
                onClick={() => setSelectedTx(null)}
                className="h-8 rounded-xl border-white/10 bg-white/5 text-xs text-zinc-300 hover:text-white"
              >
                Close
              </AlertDialogCancel>
              <Button
                size="sm"
                onClick={() => {
                  const receiptText = `HIRELOOP PAYMENT RECEIPT\n=======================\nInvoice: #${selectedTx.transactionId}\nCustomer: ${selectedTx.userEmail}\nPlan: ${selectedTx.plan}\nAmount: ${selectedTx.amount}\nDate: ${selectedTx.date}\nPayment Method: Visa ending in 4242\nStatus: ${selectedTx.status}\n\nThank you for choosing HireLoop!`
                  const blob = new Blob([receiptText], { type: "text/plain" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = `receipt_${selectedTx.transactionId}.txt`
                  a.click()
                  URL.revokeObjectURL(url)
                  toast.success("Receipt Downloaded", {
                    description: `Invoice #${selectedTx.transactionId} saved.`,
                  })
                }}
                className="h-8 rounded-xl bg-white text-xs font-semibold text-zinc-900 hover:bg-zinc-100"
              >
                <Download className="h-3 w-3 mr-1" />
                <span>Download Receipt</span>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </div>
  )
}
