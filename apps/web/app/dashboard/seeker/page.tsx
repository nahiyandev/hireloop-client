"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  Search,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { useSession } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"

interface ApplicationItem {
  id: string
  company: string
  logo: string
  role: string
  location: string
  appliedDate: string
  salary: string
  stage: "Applied" | "Reviewing" | "Interviewing" | "Offer" | "Rejected"
  nextStep?: string
}

interface RecommendedRole {
  id: string
  title: string
  company: string
  location: string
  salary: string
  type: string
}

export default function SeekerDashboardPage() {
  const { data: session } = useSession()
  const userName = session?.user?.name || "Job Seeker"

  const [applications, setApplications] = React.useState<ApplicationItem[]>([])
  const [recommendedJobs, setRecommendedJobs] = React.useState<RecommendedRole[]>([])
  const [savedJobsCount, setSavedJobsCount] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadSeekerDashboard() {
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
            const mapped: ApplicationItem[] = appData.map((a: any, idx: number) => ({
              id: a._id || a.id || `app-${idx}`,
              company: a.company || "Company",
              logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100",
              role: a.jobTitle || a.role || "Job Applicant",
              location: a.location || "Remote",
              appliedDate: a.appliedAt
                ? new Date(a.appliedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
                : "Recently",
              salary: a.salary || "$130k – $160k",
              stage: (a.status === "New" ? "Applied" : a.status || "Applied") as ApplicationItem["stage"],
              nextStep: a.status === "Interviewing" ? "Interview round scheduled" : "Awaiting recruiter review",
            }))
            setApplications(mapped)
          }
        }

        if (jobRes && jobRes.ok) {
          const jobData = await jobRes.json()
          if (Array.isArray(jobData)) {
            const mappedRoles: RecommendedRole[] = jobData.slice(0, 3).map((j: any) => ({
              id: j._id || j.id,
              title: j.title || "Software Engineer",
              company: j.company || "TechCorp",
              location: j.location || "Remote",
              salary: j.compensation || "$140k – $170k",
              type: j.type || "Full-time",
            }))
            setRecommendedJobs(mappedRoles)
          }
        }

        try {
          const saved = JSON.parse(localStorage.getItem("hireloop_saved_jobs") || "[]")
          if (Array.isArray(saved)) setSavedJobsCount(saved.length)
        } catch {
          // ignore
        }
      } catch (err) {
        console.warn("Could not load seeker dashboard:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadSeekerDashboard()
  }, [])

  const getStageBadge = (stage: ApplicationItem["stage"]) => {
    switch (stage) {
      case "Applied":
        return <Badge className="bg-sky-500/15 text-sky-400 border border-sky-500/30">Applied</Badge>
      case "Reviewing":
        return <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30">Reviewing</Badge>
      case "Interviewing":
        return <Badge className="bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">Interviewing</Badge>
      case "Offer":
        return <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Offer</Badge>
      case "Rejected":
        return <Badge className="bg-rose-500/15 text-rose-400 border border-rose-500/30">Archived</Badge>
      default:
        return <Badge variant="outline">{stage}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#818cf8]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Job Seeker Hub • Career Dashboard</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {userName}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Track your ongoing applications, interview invitations, and recommended opportunities.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/jobs">
            <Button
              variant="brand"
              className="h-10 rounded-xl px-4 text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Browse 50K+ Jobs</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Seeker Overview Stat Cards (Figma 02 · Job Seeker) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-white/10 bg-[#0c0d12]/90 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">Applications Submitted</CardTitle>
            <FileText className="h-4 w-4 text-[#818cf8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {isLoading ? "..." : applications.length}
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">
              {applications.filter((a) => a.stage === "Interviewing").length} actively in interview
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#0c0d12]/90 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">Saved Jobs</CardTitle>
            <Bookmark className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{savedJobsCount}</div>
            <p className="mt-1 text-[11px] text-zinc-400">Bookmarked for later</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#0c0d12]/90 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">Profile Status</CardTitle>
            <Eye className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">Active</div>
            <p className="mt-1 flex items-center text-[11px] text-emerald-400">
              <TrendingUp className="mr-1 h-3 w-3" /> Visible to recruiters
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#0c0d12]/90 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">Interview Invites</CardTitle>
            <Calendar className="h-4 w-4 text-[#818cf8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#818cf8]">
              {isLoading ? "..." : applications.filter((a) => a.stage === "Interviewing").length}
            </div>
            <p className="mt-1 text-[11px] text-emerald-400">Action required</p>
          </CardContent>
        </Card>
      </div>

      {/* 2/3 & 1/3 Split Grid (Matching Figma Seeker Dashboard) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2/3): Application Pipeline Tracker */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-white/10 bg-[#0c0d12]/90 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/5">
              <div>
                <CardTitle className="text-base font-bold text-white">Application Pipeline</CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  Real-time status updates from hiring companies.
                </CardDescription>
              </div>
              <Link href="/jobs" className="text-xs font-semibold text-[#818cf8] hover:text-[#a5b4fc] flex items-center gap-1">
                <span>Explore roles</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-[#665df5]" />
                </div>
              ) : applications.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-500">
                  You haven't submitted any job applications yet. Browse open jobs to apply!
                </div>
              ) : (
                applications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-white/15 hover:bg-white/[0.04]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 p-1">
                          <Building2 className="h-5 w-5 text-zinc-300" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{app.role}</h4>
                          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                            <span className="font-semibold text-zinc-300">{app.company}</span>
                            <span>•</span>
                            <span>{app.location}</span>
                            <span>•</span>
                            <span className="font-mono text-zinc-300">{app.salary}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        {getStageBadge(app.stage)}
                      </div>
                    </div>

                    {/* Next Step Ribbon */}
                    {app.nextStep && (
                      <div className="mt-3.5 flex items-center justify-between rounded-xl bg-white/[0.03] px-3.5 py-2 border border-white/5 text-xs">
                        <div className="flex items-center gap-2 text-zinc-300">
                          <Clock className="h-3.5 w-3.5 text-[#818cf8]" />
                          <span>{app.nextStep}</span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">Applied {app.appliedDate}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right (1/3): Recommended Roles & Profile Strength */}
        <div className="space-y-6">
          {/* Profile Strength Card */}
          <Card className="border-white/10 bg-[#0c0d12]/90 backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-white/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-white">Profile Readiness</CardTitle>
                <span className="font-mono text-xs font-bold text-emerald-400">85% Complete</span>
              </div>
              <CardDescription className="text-xs text-zinc-400">
                A complete profile boosts recruiter response rate by 3.2x.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {/* Progress Bar */}
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#665df5] to-emerald-400 rounded-full w-[85%]" />
              </div>

              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Resume uploaded & verified</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Core skills & experience listed</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <div className="h-3.5 w-3.5 rounded-full border border-dashed border-zinc-500 shrink-0" />
                  <span>Add GitHub / Portfolio link (+15%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Jobs Card */}
          <Card className="border-white/10 bg-[#0c0d12]/90 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/5">
              <div>
                <CardTitle className="text-sm font-bold text-white">Recommended Roles</CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  Curated based on your verified skills.
                </CardDescription>
              </div>
              <Link href="/jobs" className="text-xs text-[#818cf8] hover:text-[#a5b4fc]">
                View all
              </Link>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {recommendedJobs.length === 0 ? (
                <div className="py-4 text-center text-xs text-zinc-500">
                  No recommendations available.
                </div>
              ) : (
                recommendedJobs.map((role) => (
                  <Link key={role.id} href={`/jobs/${role.id}`} className="block">
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:border-white/15">
                      <h4 className="text-xs font-semibold text-white leading-tight hover:text-[#818cf8] transition-colors">{role.title}</h4>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-400">
                        <span className="text-zinc-300 font-medium">{role.company}</span>
                        <span className="font-mono text-zinc-300">{role.salary}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-zinc-500">
                        <span>{role.location}</span>
                        <span className="font-semibold text-[#818cf8]">{role.type}</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
