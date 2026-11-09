"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  XCircle,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { toast } from "@workspace/ui/components/sonner"
import { authClient } from "@/lib/auth-client"

interface SeekerApplication {
  id: string
  company: string
  logo: string
  role: string
  location: string
  salary: string
  appliedDate: string
  stage: "Applied" | "Reviewing" | "Interviewing" | "Offer" | "Archived"
  nextStep: string
  stageIndex: number // 1: Applied, 2: Reviewing, 3: Interviewing, 4: Offer
}

export default function SeekerApplicationsPage() {
  const { data: session } = authClient.useSession()
  const [applications, setApplications] = React.useState<SeekerApplication[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedTab, setSelectedTab] = React.useState<string>("all")
  const [search, setSearch] = React.useState("")

  // Fetch real submitted applications for logged-in seeker
  React.useEffect(() => {
    async function loadSeekerApplications() {
      setIsLoading(true)
      try {
        const email = session?.user?.email
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
        const queryUrl = email ? `${apiUrl}/applications?email=${encodeURIComponent(email)}` : `${apiUrl}/applications`
        const res = await fetch(queryUrl)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) {
            const mapped: SeekerApplication[] = data.map((item: any, idx: number) => {
              const stageMap: Record<string, SeekerApplication["stage"]> = {
                Pending: "Applied",
                New: "Applied",
                Reviewing: "Reviewing",
                Interviewing: "Interviewing",
                Shortlisted: "Interviewing",
                Hired: "Offer",
                Rejected: "Archived",
              }
              const stage = stageMap[item.status] || "Applied"
              const stageIndex = stage === "Applied" ? 1 : stage === "Reviewing" ? 2 : stage === "Interviewing" ? 3 : 4
              const dateStr = item.appliedAt
                ? new Date(item.appliedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Just now"

              return {
                id: item._id ? String(item._id) : `app-live-${idx}`,
                company: item.company || "Verified Employer",
                logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100",
                role: item.jobTitle || "Tech Position",
                location: "Remote / Hybrid",
                salary: "$120k – $160k / yr",
                appliedDate: dateStr,
                stage,
                nextStep: item.status === "Pending" ? "Awaiting employer screening review" : `Status updated to ${item.status}`,
                stageIndex,
              }
            })

            setApplications(mapped)
          }
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }

    loadSeekerApplications()
  }, [session])

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.role.toLowerCase().includes(search.toLowerCase()) ||
      app.company.toLowerCase().includes(search.toLowerCase())
    const matchesTab =
      selectedTab === "all"
        ? true
        : selectedTab === "active"
        ? app.stage === "Applied" || app.stage === "Reviewing" || app.stage === "Interviewing"
        : selectedTab === "interviewing"
        ? app.stage === "Interviewing"
        : selectedTab === "offer"
        ? app.stage === "Offer"
        : app.stage === "Archived"
    return matchesSearch && matchesTab
  })

  const getStageBadge = (stage: SeekerApplication["stage"]) => {
    switch (stage) {
      case "Applied":
        return <Badge className="bg-sky-500/15 text-sky-400 border border-sky-500/30">Applied</Badge>
      case "Reviewing":
        return <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30">In Review</Badge>
      case "Interviewing":
        return <Badge className="bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">Interviewing</Badge>
      case "Offer":
        return <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">Offer Extended</Badge>
      case "Archived":
        return <Badge className="bg-zinc-800 text-zinc-400 border border-white/5">Archived</Badge>
    }
  }

  const handleWithdraw = (id: string, role: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id))
    toast.success("Application Withdrawn", {
      description: `Your application for "${role}" has been withdrawn.`,
    })
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-white font-medium">My Applications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Application Pipeline
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Track real-time candidate status, upcoming interview rounds, and job offers.
          </p>
        </div>

        <Link href="/jobs">
          <Button
            variant="brand"
            className="h-10 gap-2 rounded-xl px-4 text-xs font-semibold shadow-lg shadow-indigo-600/30"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Apply for New Roles</span>
          </Button>
        </Link>
      </div>

      {/* 4 Overview Stage Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-white/5 bg-[#0c0d12]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">Total Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {applications.length}
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">Across verified companies</p>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-[#0c0d12]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">In Active Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
              {applications.filter((a) => a.stage === "Reviewing").length}
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">Recruiters reviewing profile</p>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-[#0c0d12]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">Interviews Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#818cf8]">
              {applications.filter((a) => a.stage === "Interviewing").length}
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">Action items pending</p>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-[#0c0d12]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">Job Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {applications.filter((a) => a.stage === "Offer").length}
            </div>
            <p className="mt-1 text-[11px] text-emerald-400 font-semibold">Ready for decision</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Filter using shadcn Tabs */}
      <Tabs defaultValue="all" onValueChange={setSelectedTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="bg-white/[0.03] border border-white/5">
            <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
            <TabsTrigger value="active">Active Pipeline</TabsTrigger>
            <TabsTrigger value="interviewing">Interviews</TabsTrigger>
            <TabsTrigger value="offer">Offers</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applications..."
              className="h-9 w-full rounded-xl border-white/10 bg-[#161720] pl-8 pr-3 text-xs text-white placeholder:text-zinc-500 focus:border-[#665df5]"
            />
          </div>
        </div>

        {/* Applications List */}
        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-12 text-center text-xs text-zinc-400 flex flex-col items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#665df5] mb-2" />
              Loading your live applications...
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-12 text-center text-xs text-zinc-500">
              No applications found under this status.
            </div>
          ) : (
            filteredApps.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5 space-y-4 transition-all hover:border-white/15"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <img
                      src={app.logo}
                      alt={app.company}
                      className="h-11 w-11 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{app.role}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                        <span className="font-semibold text-zinc-200">{app.company}</span>
                        <span>•</span>
                        <span>{app.location}</span>
                        <span>•</span>
                        <span className="font-mono text-zinc-300">{app.salary}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {getStageBadge(app.stage)}
                    <button
                      onClick={() => handleWithdraw(app.id, app.role)}
                      className="text-xs text-zinc-500 hover:text-rose-400 transition-colors"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>

                {/* Progress Stepper (Applied -> In Review -> Interview -> Decision) */}
                <div className="pt-2 border-t border-white/5">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { step: 1, label: "Applied" },
                      { step: 2, label: "In Review" },
                      { step: 3, label: "Interview" },
                      { step: 4, label: "Offer / Decision" },
                    ].map((st) => {
                      const isComplete = app.stageIndex >= st.step
                      const isCurrent = app.stageIndex === st.step
                      return (
                        <div key={st.step} className="space-y-1">
                          <div
                            className={`h-1.5 w-full rounded-full transition-all ${
                              isComplete
                                ? "bg-gradient-to-r from-[#665df5] to-[#818cf8]"
                                : "bg-white/5"
                            }`}
                          />
                          <span
                            className={`text-[10px] font-mono ${
                              isCurrent
                                ? "text-[#a5b4fc] font-bold"
                                : isComplete
                                ? "text-zinc-300"
                                : "text-zinc-600"
                            }`}
                          >
                            {st.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Next Step Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl bg-white/[0.02] p-3 border border-white/5 text-xs">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Clock className="h-3.5 w-3.5 text-[#818cf8] shrink-0" />
                    <span>{app.nextStep}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">
                    Applied on {app.appliedDate}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Tabs>
    </div>
  )
}
