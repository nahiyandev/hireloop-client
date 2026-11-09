"use client"

import * as React from "react"
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Download,
  ExternalLink,
  Eye,
  Filter,
  Globe,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  XCircle,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { toast } from "@workspace/ui/components/sonner"
import { Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"

interface CompanyItem {
  id: string
  name: string
  initial: string
  domain: string
  industry: string
  size: string
  location: string
  jobsCount: number
  tier: "Enterprise" | "Growth" | "Starter"
  status: "Verified" | "Pending" | "Suspended"
  joinedDate: string
}

export default function CompaniesPage() {
  const [companies, setCompanies] = React.useState<CompanyItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [tierFilter, setTierFilter] = React.useState<string>("all")
  const [companyToDelete, setCompanyToDelete] = React.useState<CompanyItem | null>(null)

  React.useEffect(() => {
    async function loadCompanies() {
      setIsLoading(true)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
        const res = await fetch(`${apiUrl}/companies`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) {
            setCompanies(data)
          }
        }
      } catch (err) {
        console.warn("Could not load companies:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadCompanies()
  }, [])

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.domain.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || c.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesTier = tierFilter === "all" || c.tier === tierFilter
    return matchesSearch && matchesStatus && matchesTier
  })

  const toggleVerification = (id: string, currentStatus: CompanyItem["status"]) => {
    const nextStatus = currentStatus === "Verified" ? "Pending" : "Verified"
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c))
    )
    toast.success("Verification Status Updated", {
      description: `Company status changed to ${nextStatus}.`,
    })
  }

  const handleDelete = (id: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id))
    toast.success("Company Record Removed", {
      description: "Company profile and affiliated posts have been archived.",
    })
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Export (Figma Exact Styling) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Company Management</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Review, verify, and oversee registered employer organizations across the platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-xl border border-white/10 bg-[#161720] px-3 text-xs text-white focus:outline-none focus:border-[#665df5]"
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>

          <Button
            onClick={() => toast.success("Exporting Companies Directory (CSV)...")}
            className="h-9 rounded-xl bg-white text-xs font-semibold text-zinc-900 hover:bg-zinc-100 shadow-sm transition-all"
          >
            Export Directory
          </Button>
        </div>
      </div>

      {/* 4 Bento Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Companies */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Companies</span>
            <Building2 className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white">4,281</div>
          <span className="mt-1 inline-block text-[11px] text-zinc-400 font-medium">
            Active employers
          </span>
        </div>

        {/* Card 2: Verified Employers */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Verified Organizations</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white">3,892</div>
          <span className="mt-1 inline-block text-[11px] text-emerald-400 font-medium">
            91% verified rate
          </span>
        </div>

        {/* Card 3: Pending Verification */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Pending Review</span>
            <CheckCircle2 className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white">24</div>
          <span className="mt-1 inline-block text-[11px] text-amber-400 font-medium">
            Requires inspection
          </span>
        </div>

        {/* Card 4: Enterprise Partners */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Enterprise Partners</span>
            <Users className="h-4 w-4 text-[#818cf8]" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white">365</div>
          <span className="mt-1 inline-block text-[11px] text-[#818cf8] font-medium">
            +15.7% this month
          </span>
        </div>
      </div>

      {/* Filter and Search Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company by name, domain, or industry..."
            className="h-9 w-full rounded-xl border border-white/10 bg-[#161720] pl-9 pr-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#665df5]"
          />
        </div>

        <div className="flex items-center gap-2">
          {["all", "Enterprise", "Growth", "Starter"].map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                tierFilter === tier
                  ? "bg-[#665df5] text-white font-semibold shadow-sm"
                  : "bg-white/[0.03] text-zinc-400 border border-white/5 hover:text-white"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Companies High-Density Table */}
      <div className="rounded-2xl border border-white/5 bg-[#0c0d12] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/5 bg-white/[0.01] text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-6 py-4">COMPANY NAME & DOMAIN</th>
                <th className="px-6 py-4">INDUSTRY & HEADQUARTERS</th>
                <th className="px-6 py-4">PLAN TIER</th>
                <th className="px-6 py-4">ACTIVE JOBS</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-zinc-500">
                    <Loader2 className="h-6 w-6 animate-spin text-[#665df5] mx-auto" />
                  </td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-zinc-500">
                    No companies found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((comp) => (
                  <tr key={comp.id} className="transition-colors hover:bg-white/[0.01]">
                    {/* COMPANY NAME & DOMAIN */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 font-bold text-xs text-white shrink-0">
                          {comp.initial}
                        </div>
                        <div>
                          <div className="font-semibold text-white leading-tight">{comp.name}</div>
                          <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-1 mt-0.5">
                            <Globe className="h-3 w-3 text-zinc-500" />
                            <span>{comp.domain}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* INDUSTRY & LOCATION */}
                    <td className="px-6 py-4">
                      <div className="text-zinc-200 font-medium">{comp.industry}</div>
                      <div className="text-[11px] text-zinc-500">{comp.location}</div>
                    </td>

                    {/* TIER */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                        comp.tier === "Enterprise"
                          ? "bg-[#665df5]/15 text-[#a5b4fc] border-[#665df5]/30"
                          : comp.tier === "Growth"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-white/[0.04] text-zinc-300 border-white/10"
                      }`}>
                        {comp.tier}
                      </span>
                    </td>

                    {/* JOBS COUNT */}
                    <td className="px-6 py-4 font-mono text-zinc-300">
                      {comp.jobsCount} open roles
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      {comp.status === "Verified" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Verified
                        </span>
                      ) : comp.status === "Pending" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                          Pending Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                          Suspended
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 text-xs">
                        <button
                          onClick={() => toggleVerification(comp.id, comp.status)}
                          className={`font-medium transition-colors ${
                            comp.status === "Verified"
                              ? "text-zinc-400 hover:text-amber-400"
                              : "text-emerald-400 hover:text-emerald-300"
                          }`}
                        >
                          {comp.status === "Verified" ? "Set Pending" : "Verify"}
                        </button>

                        <button
                          onClick={() => setCompanyToDelete(comp)}
                          title="Delete Company"
                          className="rounded-lg p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog (shadcn UI) */}
      <AlertDialog open={!!companyToDelete} onOpenChange={(open) => !open && setCompanyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employer Record?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete <span className="font-semibold text-white">"{companyToDelete?.name}"</span>? All affiliated job postings and candidate pipelines associated with this organization will be archived.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCompanyToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (companyToDelete) {
                  handleDelete(companyToDelete.id)
                  setCompanyToDelete(null)
                }
              }}
            >
              Delete Organization
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
