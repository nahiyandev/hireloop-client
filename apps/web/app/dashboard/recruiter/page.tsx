"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  Filter,
  MoreVertical,
  Plus,
  PlusCircle,
  Search,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { toast } from "@workspace/ui/components/sonner"
import { useSession } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"

interface Application {
  id: string
  candidateName: string
  avatar: string
  role: string
  appliedDate: string
  experience: string
  status: "New" | "Reviewing" | "Interviewing" | "Shortlisted" | "Rejected"
}

interface ActiveJob {
  id: string
  title: string
  department: string
  type: string
  applicants: number
  deadline: string
}

export default function RecruiterDashboardPage() {
  const { data: session } = useSession()
  const [applications, setApplications] = React.useState<Application[]>([])
  const [activeJobsList, setActiveJobsList] = React.useState<ActiveJob[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [filterStatus, setFilterStatus] = React.useState<string>("all")

  const recruiterName = session?.user?.name || "Recruiter"

  // Fetch live applications & jobs from backend
  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
        const [appRes, jobRes] = await Promise.all([
          fetch(`${apiUrl}/applications`).catch(() => null),
          fetch(`${apiUrl}/jobs`).catch(() => null),
        ])

        if (appRes && appRes.ok) {
          const appData = await appRes.json()
          if (Array.isArray(appData)) {
            const mappedApps: Application[] = appData.map((a: any, idx: number) => ({
              id: a._id || a.id || `app-${idx}`,
              candidateName: a.fullName || a.name || a.email || "Candidate",
              avatar: a.avatar || `https://images.unsplash.com/photo-${1500000000000 + idx * 1000}?w=150`,
              role: a.jobTitle || a.role || "Applicant",
              appliedDate: a.appliedAt
                ? new Date(a.appliedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
                : "Recent",
              experience: a.experience || "3+ years",
              status: (a.status || "New") as Application["status"],
            }))
            setApplications(mappedApps)
          }
        }

        if (jobRes && jobRes.ok) {
          const jobData = await jobRes.json()
          if (Array.isArray(jobData)) {
            const mappedJobs: ActiveJob[] = jobData.slice(0, 4).map((j: any) => ({
              id: j._id || j.id,
              title: j.title || "Job Listing",
              department: j.category || "Engineering",
              type: `${j.type || "Full-time"} • ${j.isRemote ? "Remote" : "On-site"}`,
              applicants: j.applicantsCount || 0,
              deadline: "Rolling Deadline",
            }))
            setActiveJobsList(mappedJobs)
          }
        }
      } catch (err) {
        console.warn("Could not load recruiter data:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredApps = applications.filter((app) => {
    if (filterStatus === "all") return true
    return app.status.toLowerCase() === filterStatus.toLowerCase()
  })

  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "New":
        return <Badge className="bg-sky-500/15 text-sky-400 border border-sky-500/30 font-medium">New</Badge>
      case "Reviewing":
        return <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30 font-medium">Reviewing</Badge>
      case "Interviewing":
        return <Badge className="bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-medium">Interviewing</Badge>
      case "Shortlisted":
        return <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium">Shortlisted</Badge>
      case "Rejected":
        return <Badge className="bg-rose-500/15 text-rose-400 border border-rose-500/30 font-medium">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleStatusChange = async (appId: string, nextStatus: Application["status"]) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: nextStatus } : a))
    )
    toast.success("Status Updated", {
      description: `Applicant status changed to ${nextStatus}.`,
    })
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
      await fetch(`${apiUrl}/applications/${appId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })
    } catch {
      // non-blocking
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome Header + Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#818cf8]">
            <Building2 className="h-3.5 w-3.5" />
            <span>Recruiter Portal • HireLoop Network</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {recruiterName}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Monitor incoming talent, review applications, and manage active job listings.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/dashboard/recruiter/jobs/new">
            <Button
              variant="brand"
              className="h-10 rounded-xl px-4 text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Post a New Job</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Overview Stat Cards (Matching Figma 03 · Recruiter) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-white/10 bg-[#0c0d12]/90 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">Total Job Posts</CardTitle>
            <Briefcase className="h-4 w-4 text-[#818cf8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {isLoading ? "..." : activeJobsList.length}
            </div>
            <p className="mt-1 flex items-center text-[11px] text-emerald-400">
              <TrendingUp className="mr-1 h-3 w-3" /> Live from database
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#0c0d12]/90 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-[#818cf8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {isLoading ? "..." : applications.length}
            </div>
            <p className="mt-1 flex items-center text-[11px] text-emerald-400">
              <TrendingUp className="mr-1 h-3 w-3" /> Active candidates
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#0c0d12]/90 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">Interviewing</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {isLoading ? "..." : applications.filter((a) => a.status === "Interviewing").length}
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">Candidates in review</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#0c0d12]/90 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">New Applications</CardTitle>
            <Clock className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-400">
              {isLoading ? "..." : applications.filter((a) => a.status === "New").length}
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">Pending screening</p>
          </CardContent>
        </Card>
      </div>

      {/* 2/3 & 1/3 Split Grid (Matching Figma Recruiter Dashboard) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2/3): Recent Applications Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-white/10 bg-[#0c0d12]/90 backdrop-blur-md">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <CardTitle className="text-base font-bold text-white">Recent Applications</CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  Review and advance candidates through your hiring pipeline.
                </CardDescription>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-400 font-mono">Filter:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-lg border border-white/10 bg-[#161720] px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#665df5]"
                >
                  <option value="all">All ({applications.length})</option>
                  <option value="New">New</option>
                  <option value="Reviewing">Reviewing</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Shortlisted">Shortlisted</option>
                </select>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/5 bg-white/[0.02] text-zinc-400 uppercase font-mono text-[10px] tracking-wider">
                    <tr>
                      <th className="px-5 py-3">Candidate</th>
                      <th className="px-5 py-3">Role</th>
                      <th className="px-5 py-3">Experience</th>
                      <th className="px-5 py-3">Applied</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-xs text-zinc-500">
                          <Loader2 className="h-6 w-6 animate-spin text-[#665df5] mx-auto" />
                        </td>
                      </tr>
                    ) : filteredApps.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-xs text-zinc-500">
                          No candidate applications submitted yet.
                        </td>
                      </tr>
                    ) : (
                      filteredApps.map((app) => (
                      <tr key={app.id} className="transition-colors hover:bg-white/[0.02]">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={app.avatar}
                              alt={app.candidateName}
                              className="h-8 w-8 rounded-full object-cover border border-white/10"
                            />
                            <div>
                              <div className="font-semibold text-white">{app.candidateName}</div>
                              <div className="text-[10px] text-zinc-400">ID: {app.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-zinc-300 font-medium">{app.role}</td>
                        <td className="px-5 py-3.5 text-zinc-400">{app.experience}</td>
                        <td className="px-5 py-3.5 text-zinc-400 font-mono text-[11px]">{app.appliedDate}</td>
                        <td className="px-5 py-3.5">{getStatusBadge(app.status)}</td>
                        <td className="px-5 py-3.5 text-right">
                          <select
                            value={app.status}
                            onChange={(e) =>
                              handleStatusChange(app.id, e.target.value as Application["status"])
                            }
                            className="rounded-lg border border-white/10 bg-[#161720] px-2 py-1 text-[11px] text-zinc-300 focus:outline-none focus:border-[#665df5]"
                          >
                            <option value="New">New</option>
                            <option value="Reviewing">Reviewing</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Rejected">Reject</option>
                          </select>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right (1/3): Active Listings & Quick Actions */}
        <div className="space-y-6">
          <Card className="border-white/10 bg-[#0c0d12]/90 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/5">
              <div>
                <CardTitle className="text-sm font-bold text-white">Active Listings</CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  Quick look at live jobs accepting candidates.
                </CardDescription>
              </div>
              <Link href="/dashboard/recruiter/jobs">
                <Button variant="ghost" size="sm" className="h-8 text-xs text-[#818cf8] hover:text-[#a5b4fc]">
                  View all
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {activeJobsList.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-500">
                  No active listings found. Post a job to start receiving applications!
                </div>
              ) : (
                activeJobsList.map((job) => (
                <div
                  key={job.id}
                  className="rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:border-white/10"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-semibold text-white leading-tight">{job.title}</h4>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400 shrink-0">
                      Active
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-400">
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-400 border-t border-white/5 pt-2">
                    <span className="font-semibold text-zinc-200">{job.applicants} Applicants</span>
                    <span className="font-mono text-[10px]">Due {job.deadline}</span>
                  </div>
                </div>
              )))}
            </CardContent>
          </Card>

          {/* Quick Post CTA banner */}
          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 to-[#0c0d12] p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white">Need to hire urgently?</h3>
            <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
              Use our live-preview job composer to draft and publish an open role in under 3 minutes.
            </p>
            <Link href="/dashboard/recruiter/jobs/new">
              <Button
                variant="brand"
                size="sm"
                className="mt-4 w-full justify-center gap-2 rounded-xl text-xs font-semibold"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Create New Listing</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
