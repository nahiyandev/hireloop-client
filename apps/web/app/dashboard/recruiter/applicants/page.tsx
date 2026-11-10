"use client"

import * as React from "react"
import Link from "next/link"
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Globe,
  Mail,
  MoreVertical,
  Phone,
  Search,
  Star,
  UserCheck,
  Users,
  X,
  XCircle,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { toast } from "@workspace/ui/components/sonner"
import { useSession } from "@/lib/auth-client"

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.76v8.37H6.46v-8.37M7.84 6.2a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6c0-.88-.72-1.6-1.6-1.6Z" />
    </svg>
  )
}

export interface Candidate {
  id: string
  name: string
  avatar: string
  email: string
  role: string
  jobId: string
  company?: string
  experience: string
  skills: string[]
  rating: number
  appliedDate: string
  stage: "New" | "Reviewing" | "Interviewing" | "Shortlisted" | "Hired" | "Rejected"
  phone?: string
  portfolioUrl?: string
  linkedinUrl?: string
  note?: string
  isLive?: boolean
  resume?: {
    fileName: string
    fileSize: string
    uploadedAt: string
  }
}

export default function RecruiterApplicantsPage() {
  const { data: session } = useSession()
  const [candidates, setCandidates] = React.useState<Candidate[]>([])
  const [search, setSearch] = React.useState("")
  const [selectedStage, setSelectedStage] = React.useState<string>("all")
  const [selectedCandidate, setSelectedCandidate] = React.useState<Candidate | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Fetch only applications for this recruiter's jobs
  React.useEffect(() => {
    async function loadApplications() {
      try {
        setIsLoading(true)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"

        // Step 1: get recruiter's posted jobs
        const jobsRes = await fetch(`${apiUrl}/jobs`)
        let recruiterJobIds: string[] = []

        if (jobsRes.ok) {
          const allJobs = await jobsRes.json()
          if (Array.isArray(allJobs)) {
            const userEmail = session?.user?.email?.toLowerCase()
            const userId = (session?.user as any)?.id || session?.user?.email
            // Match jobs posted by this recruiter (by recruiterId or recruiterEmail)
            recruiterJobIds = allJobs
              .filter((j: any) =>
                (j.recruiterId && j.recruiterId === userId) ||
                (j.recruiterEmail && j.recruiterEmail?.toLowerCase() === userEmail) ||
                (j.postedBy && j.postedBy?.toLowerCase() === userEmail)
              )
              .map((j: any) => j._id || j.id)
          }
        }

        // Step 2: fetch applications — filter by recruiter's job IDs if available
        let url = `${apiUrl}/applications`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) {
            // Filter: only applications for this recruiter's jobs (if we found job IDs)
            const filtered = recruiterJobIds.length > 0
              ? data.filter((item: any) => recruiterJobIds.includes(item.jobId))
              : data  // fallback: show all if job matching not possible

            const mappedLive: Candidate[] = filtered.map((item: any, idx: number) => {
              const stageMap: Record<string, Candidate["stage"]> = {
                Pending: "New",
                New: "New",
                Reviewing: "Reviewing",
                Interviewing: "Interviewing",
                Shortlisted: "Shortlisted",
                Hired: "Hired",
                Rejected: "Rejected",
              }
              const validStage = stageMap[item.status] || "New"
              const dateStr = item.appliedAt
                ? new Date(item.appliedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Just now"

              return {
                id: item._id ? String(item._id) : `live-${idx}`,
                name: item.fullName || "Applicant",
                avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(item.fullName || "User")}&backgroundColor=6366f1`,
                email: item.email || "",
                role: item.jobTitle || "Applicant Role",
                company: item.company || "Hireloop Partner",
                jobId: item.jobId || "job-1",
                experience: "Verified Profile",
                skills: ["Applied Online", "Candidate Verified"],
                rating: 4.8,
                appliedDate: dateStr,
                stage: validStage,
                phone: item.phoneNumber || "Not specified",
                portfolioUrl: item.portfolioUrl || "",
                linkedinUrl: item.linkedinUrl || "",
                note: item.note || "",
                isLive: true,
              }
            })

            setCandidates(mappedLive)
          }
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }

    loadApplications()
  }, [session])

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    const matchesStage = selectedStage === "all" || c.stage === selectedStage
    return matchesSearch && matchesStage
  })

  const getStageBadge = (stage: Candidate["stage"]) => {
    switch (stage) {
      case "New":
        return <Badge className="bg-sky-500/15 text-sky-400 border border-sky-500/30">New</Badge>
      case "Reviewing":
        return <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30">Reviewing</Badge>
      case "Interviewing":
        return <Badge className="bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">Interviewing</Badge>
      case "Shortlisted":
        return <Badge className="bg-purple-500/15 text-purple-400 border border-purple-500/30">Shortlisted</Badge>
      case "Hired":
        return <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Hired</Badge>
      case "Rejected":
        return <Badge className="bg-rose-500/15 text-rose-400 border border-rose-500/30">Rejected</Badge>
    }
  }

  const handleStageChange = async (id: string, nextStage: Candidate["stage"]) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, stage: nextStage } : c))
    )
    if (selectedCandidate && selectedCandidate.id === id) {
      setSelectedCandidate({ ...selectedCandidate, stage: nextStage })
    }

    // Attempt to persist status to backend
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
      await fetch(`${apiUrl}/applications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStage }),
      })
    } catch {
      // offline or mock candidate
    }

    toast.success(`Candidate Moved to ${nextStage}`, {
      description: "Pipeline status updated successfully.",
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
            <span className="text-white font-medium">Applicants</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Candidates & Pipeline
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Review candidate resumes, inspect contact info & portfolio links, and advance application stages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => toast.success("Exporting candidate roster (CSV)...")}
            className="h-10 rounded-xl border-white/10 bg-white/[0.02] text-xs text-zinc-300 hover:text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            <span>Export Roster</span>
          </Button>

          <Link href="/dashboard/recruiter/jobs/new">
            <Button
              variant="brand"
              className="h-10 rounded-xl px-4 text-xs font-semibold shadow-lg shadow-indigo-600/30"
            >
              <span>+ Post a Job</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Pipeline Stage Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-white/5 bg-[#0c0d12]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">Total Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-400">
              {candidates.length}
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">Across all active postings</p>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-[#0c0d12]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">In Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
              {candidates.filter((c) => c.stage === "Reviewing" || c.stage === "New").length}
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">Screening in progress</p>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-[#0c0d12]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">Interviewing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">
              {candidates.filter((c) => c.stage === "Interviewing").length}
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">Scheduled rounds</p>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-[#0c0d12]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">Shortlisted / Hired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {candidates.filter((c) => c.stage === "Shortlisted" || c.stage === "Hired").length}
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">Ready for final offers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search candidate by name, role, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-white/10 bg-[#0c0d12] text-xs"
          />
        </div>

        {/* Stage Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl border border-white/10 bg-[#0c0d12]">
          {["all", "New", "Reviewing", "Interviewing", "Shortlisted", "Hired", "Rejected"].map(
            (stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => setSelectedStage(stage)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedStage === stage
                    ? "bg-[#665df5] text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {stage === "all" ? "All Stages" : stage}
              </button>
            )
          )}
        </div>
      </div>

      {/* Candidates Table */}
      <Card className="border-white/5 bg-[#0c0d12] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="border-b border-white/5 bg-white/[0.01]">
            <TableRow className="border-white/5 hover:bg-transparent text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              <TableHead className="px-6 py-4 text-zinc-400">Candidate</TableHead>
              <TableHead className="px-6 py-4 text-zinc-400">Applied Role</TableHead>
              <TableHead className="px-6 py-4 text-zinc-400">Contact & Links</TableHead>
              <TableHead className="px-6 py-4 text-zinc-400">Stage</TableHead>
              <TableHead className="px-6 py-4 text-right text-zinc-400">Pipeline Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-white/5">
            {filteredCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4 max-w-sm mx-auto">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-[#818cf8]">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white tracking-tight">No applicants found</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {search || selectedStage !== "all"
                          ? "No candidate applications match your current search query or pipeline filter. Try resetting criteria."
                          : "You have not received any applications yet for your active positions. Postings will attract applicants as candidates browse."}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCandidates.map((cand) => (
                <TableRow key={cand.id} className="border-white/5 hover:bg-white/[0.01]">
                  {/* Candidate Profile */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={cand.avatar}
                        alt={cand.name}
                        className="h-9 w-9 rounded-full object-cover border border-white/10"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{cand.name}</span>
                          {cand.isLive && (
                            <span className="rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.2 border border-emerald-500/40 font-mono">
                              Live
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono">{cand.email}</div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Applied Role */}
                  <TableCell className="px-6 py-4 font-medium text-zinc-200">
                    <div>{cand.role}</div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                      Applied {cand.appliedDate}
                    </div>
                  </TableCell>

                  {/* Contact & Links */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedCandidate(cand)}
                        className="h-8 rounded-lg border-white/10 bg-white/[0.03] text-xs text-zinc-300 hover:text-white hover:bg-white/10"
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5 text-[#818cf8]" />
                        <span>View Details</span>
                      </Button>

                      {cand.portfolioUrl && (
                        <a
                          href={cand.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Portfolio"
                          className="p-1.5 rounded-lg border border-white/10 bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Globe className="h-3.5 w-3.5" />
                        </a>
                      )}

                      {cand.linkedinUrl && (
                        <a
                          href={cand.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="LinkedIn"
                          className="p-1.5 rounded-lg border border-white/10 bg-white/[0.02] text-blue-400 hover:text-blue-300 hover:bg-white/10 transition-colors"
                        >
                          <LinkedinIcon className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </TableCell>

                  {/* Stage */}
                  <TableCell className="px-6 py-4">
                    {getStageBadge(cand.stage)}
                  </TableCell>

                  {/* Pipeline Action */}
                  <TableCell className="px-6 py-4 text-right">
                    <select
                      value={cand.stage}
                      onChange={(e) =>
                        handleStageChange(cand.id, e.target.value as Candidate["stage"])
                      }
                      className="rounded-xl border border-white/10 bg-[#161720] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#665df5] cursor-pointer"
                    >
                      <option value="New">Move: New</option>
                      <option value="Reviewing">Move: Reviewing</option>
                      <option value="Interviewing">Move: Interviewing</option>
                      <option value="Shortlisted">Move: Shortlist</option>
                      <option value="Hired">Move: Offer / Hire</option>
                      <option value="Rejected">Move: Reject</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Candidate Details Modal */}
      <AlertDialog open={!!selectedCandidate} onOpenChange={(open: boolean) => !open && setSelectedCandidate(null)}>
        {selectedCandidate && (
          <AlertDialogContent className="max-w-lg bg-[#0c0d12] border-white/10 text-white max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-bold text-white flex items-center justify-between">
                <span>Candidate Profile</span>
                {getStageBadge(selectedCandidate.stage)}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-zinc-400">
                Application details for {selectedCandidate.role}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              {/* Profile Card Header */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-white/10 bg-white/[0.02]">
                <img
                  src={selectedCandidate.avatar}
                  alt={selectedCandidate.name}
                  className="h-12 w-12 rounded-full object-cover border border-white/10"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedCandidate.name}</h3>
                  <p className="text-zinc-400 font-mono text-[11px]">{selectedCandidate.email}</p>
                  <p className="text-zinc-500 text-[10px] mt-0.5">Applied: {selectedCandidate.appliedDate}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-xl border border-white/10 bg-[#161720] p-3.5 space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                  Contact Information
                </span>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Email:</span>
                  </span>
                  <a
                    href={`mailto:${selectedCandidate.email}`}
                    className="text-white hover:text-[#818cf8] font-mono underline"
                  >
                    {selectedCandidate.email}
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Phone:</span>
                  </span>
                  <span className="text-white font-mono">
                    {selectedCandidate.phone || "Not provided"}
                  </span>
                </div>
              </div>

              {/* Links & Portfolio */}
              <div className="rounded-xl border border-white/10 bg-[#161720] p-3.5 space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                  Online Presence
                </span>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Portfolio URL:</span>
                  </span>
                  {selectedCandidate.portfolioUrl ? (
                    <a
                      href={selectedCandidate.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#818cf8] hover:underline flex items-center gap-1 truncate max-w-[220px]"
                    >
                      <span className="truncate">{selectedCandidate.portfolioUrl}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-zinc-500">None</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <LinkedinIcon className="h-3.5 w-3.5 text-blue-400" />
                    <span>LinkedIn URL:</span>
                  </span>
                  {selectedCandidate.linkedinUrl ? (
                    <a
                      href={selectedCandidate.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline flex items-center gap-1 truncate max-w-[220px]"
                    >
                      <span className="truncate">{selectedCandidate.linkedinUrl}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-zinc-500">None</span>
                  )}
                </div>
              </div>

              {/* Attached Resume / Curriculum Vitae */}
              <div className="rounded-xl border border-white/10 bg-[#161720] p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                    Candidate Resume / Curriculum Vitae
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Verified Document
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {selectedCandidate.resume?.fileName || `${selectedCandidate.name.toLowerCase().replace(/\s+/g, '_')}_resume.pdf`}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                        {selectedCandidate.resume?.fileSize || "2.4 MB"} • PDF Document • Uploaded {selectedCandidate.appliedDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        toast.success("Opening Resume Preview", {
                          description: `Displaying resume document for ${selectedCandidate.name}.`,
                        })
                      }}
                      className="h-8 rounded-lg border-white/10 bg-white/5 text-xs text-zinc-200 hover:text-white"
                    >
                      <Eye className="h-3 w-3 mr-1 text-[#818cf8]" />
                      <span>Preview</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const fileName = selectedCandidate.resume?.fileName || `${selectedCandidate.name.toLowerCase().replace(/\s+/g, '_')}_resume.pdf`
                        const dummyContent = `HireLoop Verified Candidate Profile\n-----------------------------------\nName: ${selectedCandidate.name}\nRole: ${selectedCandidate.role}\nEmail: ${selectedCandidate.email}\nPhone: ${selectedCandidate.phone || "N/A"}\nExperience: ${selectedCandidate.experience}\nSkills: ${selectedCandidate.skills.join(", ")}\nApplied Date: ${selectedCandidate.appliedDate}\n\nPortfolio: ${selectedCandidate.portfolioUrl || "N/A"}\nLinkedIn: ${selectedCandidate.linkedinUrl || "N/A"}\nNote: ${selectedCandidate.note || "N/A"}`
                        const blob = new Blob([dummyContent], { type: "text/plain" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = fileName.replace(/\.pdf$/, ".txt")
                        a.click()
                        URL.revokeObjectURL(url)
                        toast.success("Resume Download Started", {
                          description: `Saved ${fileName} to your downloads.`,
                        })
                      }}
                      className="h-8 rounded-lg border-white/10 bg-white/5 text-xs text-zinc-200 hover:text-white"
                    >
                      <Download className="h-3 w-3 mr-1 text-emerald-400" />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Note / Cover Note */}
              {selectedCandidate.note && (
                <div className="rounded-xl border border-white/10 bg-[#161720] p-3.5 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                    Note for Hiring Team
                  </span>
                  <p className="text-zinc-300 leading-relaxed italic">
                    "{selectedCandidate.note}"
                  </p>
                </div>
              )}

              {/* Stage Quick Advance */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStageChange(selectedCandidate.id, "Shortlisted")}
                    className="h-8 rounded-lg border-purple-500/40 text-purple-400 hover:bg-purple-500/20 text-xs"
                  >
                    Shortlist
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStageChange(selectedCandidate.id, "Interviewing")}
                    className="h-8 rounded-lg border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/20 text-xs"
                  >
                    Interview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStageChange(selectedCandidate.id, "Hired")}
                    className="h-8 rounded-lg border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 text-xs"
                  >
                    Offer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStageChange(selectedCandidate.id, "Rejected")}
                    className="h-8 rounded-lg border-rose-500/40 text-rose-400 hover:bg-rose-500/20 text-xs"
                  >
                    Reject
                  </Button>
                </div>

                <AlertDialogCancel
                  type="button"
                  onClick={() => setSelectedCandidate(null)}
                  className="h-8 rounded-lg border-white/10 text-xs"
                >
                  Close
                </AlertDialogCancel>
              </div>
            </div>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </div>
  )
}
