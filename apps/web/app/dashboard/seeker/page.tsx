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
  Circle,
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
  const { data: session, isPending: sessionLoading } = useSession()
  const userName = session?.user?.name || "Job Seeker"
  const userEmail = session?.user?.email
  const userId = session?.user?.id

  const [applications, setApplications] = React.useState<ApplicationItem[]>([])
  const [recommendedJobs, setRecommendedJobs] = React.useState<RecommendedRole[]>([])
  const [savedJobsCount, setSavedJobsCount] = React.useState(0)
  const [hasProfileBio, setHasProfileBio] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadSeekerDashboard() {
      // If session is still loading, wait
      if (sessionLoading) return

      setIsLoading(true)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"

        // 1. Fetch strictly authenticated Seeker applications
        if (userEmail || userId) {
          const q = new URLSearchParams()
          if (userEmail) q.set("email", userEmail)
          if (userId) q.set("userId", userId)

          const appRes = await fetch(`${apiUrl}/applications?${q.toString()}`).catch(() => null)
          if (appRes && appRes.ok) {
            const appData = await appRes.json()
            if (Array.isArray(appData)) {
              const mapped: ApplicationItem[] = appData.map((a: any, idx: number) => ({
                id: a._id || a.id || `app-${idx}`,
                company: a.company || "Company",
                logo: a.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100",
                role: a.jobTitle || a.role || "Position",
                location: a.location || "Remote",
                appliedDate: a.appliedAt
                  ? new Date(a.appliedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
                  : "Recently",
                salary: a.salary || "Competitive",
                stage: (a.status === "New" ? "Applied" : a.status || "Applied") as ApplicationItem["stage"],
                nextStep:
                  a.status === "Interviewing"
                    ? "Interview round scheduled"
                    : a.status === "Offer"
                    ? "Offer extended"
                    : a.status === "Reviewing"
                    ? "Application undergoing screening"
                    : "Awaiting recruiter review",
              }))
              setApplications(mapped)
            } else {
              setApplications([])
            }
          } else {
            setApplications([])
          }
        } else {
          // New or unauthenticated visitor has 0 applications
          setApplications([])
        }

        // 2. Fetch live real job recommendations from database
        const jobRes = await fetch(`${apiUrl}/jobs`).catch(() => null)
        if (jobRes && jobRes.ok) {
          const jobData = await jobRes.json()
          if (Array.isArray(jobData)) {
            const mappedRoles: RecommendedRole[] = jobData.slice(0, 3).map((j: any) => ({
              id: j._id || j.id,
              title: j.title || "Job Listing",
              company: j.company || "Verified Company",
              location: j.location || (j.isRemote ? "Remote" : "On-site"),
              salary: j.compensation || "Competitive",
              type: j.type || "Full-time",
            }))
            setRecommendedJobs(mappedRoles)
          }
        }

        // 3. User-scoped saved jobs
        try {
          const storageKey = userEmail ? `hireloop_saved_jobs_${userEmail}` : "hireloop_saved_jobs"
          const saved = JSON.parse(localStorage.getItem(storageKey) || "[]")
          if (Array.isArray(saved)) setSavedJobsCount(saved.length)

          // Check if profile details exist in localStorage
          const profileKey = userEmail ? `hireloop_seeker_profile_${userEmail}` : "hireloop_seeker_profile"
          const savedProfile = JSON.parse(localStorage.getItem(profileKey) || "null")
          if (savedProfile && (savedProfile.headline || savedProfile.bio)) {
            setHasProfileBio(true)
          }
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
  }, [userEmail, userId, sessionLoading])

  // Dynamically compute profile readiness based on user's real activities
  const profileReadiness = React.useMemo(() => {
    let score = 25 // 25% for verified user account
    if (hasProfileBio) score += 25
    if (applications.length > 0) score += 25
    if (savedJobsCount > 0) score += 25
    return Math.min(score, 100)
  }, [hasProfileBio, applications.length, savedJobsCount])

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
              className="h-10 rounded-xl px-4 text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Browse Open Jobs</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Seeker Overview Stat Cards */}
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
              {applications.length === 0
                ? "No applications yet"
                : `${applications.filter((a) => a.stage === "Interviewing").length} actively in interview`}
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#0c0d12]/90 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">Saved Jobs</CardTitle>
            <Bookmark className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {isLoading ? "..." : savedJobsCount}
            </div>
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
            <p className="mt-1 text-[11px] text-zinc-400">
              {applications.filter((a) => a.stage === "Interviewing").length > 0
                ? "Action required"
                : "No pending invitations"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2/3 & 1/3 Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2/3): Application Pipeline Tracker */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-white/10 bg-[#0c0d12]/90 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/5">
              <div>
                <CardTitle className="text-base font-bold text-white">Application Pipeline</CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  Real-time status updates for your submitted job applications.
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
                <div className="py-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-6 space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-white">No Applications Submitted Yet</h4>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                      You haven't submitted any job applications yet. Discover matching positions and submit your first application.
                    </p>
                  </div>
                  <Link href="/jobs" className="inline-block pt-1">
                    <Button size="sm" variant="brand" className="h-8 rounded-xl px-4 text-xs font-semibold cursor-pointer">
                      Browse Open Jobs
                    </Button>
                  </Link>
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

        {/* Right (1/3): Dynamic Profile Readiness & Recommended Roles */}
        <div className="space-y-6">
          {/* Profile Readiness Card (100% Dynamic) */}
          <Card className="border-white/10 bg-[#0c0d12]/90 backdrop-blur-md">
            <CardHeader className="pb-3 border-b border-white/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-white">Profile Readiness</CardTitle>
                <span className="font-mono text-xs font-bold text-emerald-400">{profileReadiness}% Complete</span>
              </div>
              <CardDescription className="text-xs text-zinc-400">
                A complete profile boosts recruiter response rates.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {/* Dynamic Progress Bar */}
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#665df5] to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${profileReadiness}%` }}
                />
              </div>

              <div className="space-y-2 pt-1 text-xs">
                {/* Step 1: Account created */}
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Account registered ({userEmail || "Seeker"})</span>
                </div>

                {/* Step 2: First Job Application */}
                {applications.length > 0 ? (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>First job application submitted</span>
                  </div>
                ) : (
                  <Link href="/jobs" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                    <Circle className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
                    <span>Submit your first application (+25%)</span>
                  </Link>
                )}

                {/* Step 3: Saved Opportunities */}
                {savedJobsCount > 0 ? (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>Saved job opportunities</span>
                  </div>
                ) : (
                  <Link href="/jobs" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                    <Circle className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
                    <span>Bookmark a job opportunity (+25%)</span>
                  </Link>
                )}

                {/* Step 4: Profile & Preferences */}
                {hasProfileBio ? (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>Bio & career preferences updated</span>
                  </div>
                ) : (
                  <Link href="/dashboard/seeker/settings" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                    <Circle className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
                    <span>Complete profile & preferences (+25%)</span>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recommended Jobs Card (Live MongoDB Data) */}
          <Card className="border-white/10 bg-[#0c0d12]/90 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/5">
              <div>
                <CardTitle className="text-sm font-bold text-white">Recommended Roles</CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  Open opportunities matching your profile.
                </CardDescription>
              </div>
              <Link href="/jobs" className="text-xs text-[#818cf8] hover:text-[#a5b4fc]">
                View all
              </Link>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {recommendedJobs.length === 0 ? (
                <div className="py-4 text-center text-xs text-zinc-500">
                  No open job listings found.
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
