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
  Filter,
  Mail,
  MoreVertical,
  Search,
  Star,
  UserCheck,
  Users,
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
import { toast } from "@workspace/ui/components/sonner"

interface Candidate {
  id: string
  name: string
  avatar: string
  email: string
  role: string
  jobId: string
  experience: string
  skills: string[]
  rating: number
  appliedDate: string
  stage: "New" | "Reviewing" | "Interviewing" | "Shortlisted" | "Hired" | "Rejected"
}

const initialCandidates: Candidate[] = [
  {
    id: "cand-1",
    name: "Julianne Moore",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    email: "julianne.m@example.com",
    role: "Lead UX Designer",
    jobId: "job-f1",
    experience: "6 years",
    skills: ["Figma", "Design Systems", "Prototyping"],
    rating: 4.9,
    appliedDate: "Oct 24, 2023",
    stage: "Interviewing",
  },
  {
    id: "cand-2",
    name: "Robert Downey",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
    email: "robert.d@example.com",
    role: "Backend Engineer (Go)",
    jobId: "job-f3",
    experience: "4 years",
    skills: ["Go", "Kubernetes", "gRPC"],
    rating: 4.7,
    appliedDate: "Oct 23, 2023",
    stage: "New",
  },
  {
    id: "cand-3",
    name: "Emma Stone",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100",
    email: "emma.stone@example.com",
    role: "Product Marketing Lead",
    jobId: "job-f4",
    experience: "8 years",
    skills: ["Growth", "Analytics", "Copywriting"],
    rating: 5.0,
    appliedDate: "Oct 22, 2023",
    stage: "Reviewing",
  },
  {
    id: "cand-4",
    name: "Chris Pratt",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100",
    email: "chris.pratt@example.com",
    role: "Technical Product Manager",
    jobId: "job-f1",
    experience: "5 years",
    skills: ["Roadmapping", "Scrum", "SQL"],
    rating: 4.8,
    appliedDate: "Oct 21, 2023",
    stage: "Interviewing",
  },
  {
    id: "cand-5",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100",
    email: "sarah.chen@example.com",
    role: "Senior Full-Stack Engineer",
    jobId: "job-f1",
    experience: "5 years",
    skills: ["React", "TypeScript", "Node.js"],
    rating: 4.9,
    appliedDate: "Oct 20, 2023",
    stage: "Shortlisted",
  },
]

export default function RecruiterApplicantsPage() {
  const [candidates, setCandidates] = React.useState<Candidate[]>(initialCandidates)
  const [search, setSearch] = React.useState("")
  const [selectedStage, setSelectedStage] = React.useState<string>("all")

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

  const handleStageChange = (id: string, nextStage: Candidate["stage"]) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, stage: nextStage } : c))
    )
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
            Review candidate resumes, advance application stages, and schedule interviews.
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
            <CardTitle className="text-xs font-medium text-zinc-400">New Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-400">28</div>
            <p className="mt-1 text-[11px] text-zinc-500">Unreviewed profiles</p>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-[#0c0d12]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">In Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">14</div>
            <p className="mt-1 text-[11px] text-zinc-500">Screening in progress</p>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-[#0c0d12]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">Interviewing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#818cf8]">9</div>
            <p className="mt-1 text-[11px] text-zinc-500">Rounds scheduled</p>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-[#0c0d12]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-zinc-400">Offers Extended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">3</div>
            <p className="mt-1 text-[11px] text-zinc-500">Awaiting acceptance</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Stage Filter Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-zinc-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates by name, role or email..."
            className="h-9 w-full rounded-xl border-white/10 bg-[#161720] pl-9 pr-3 text-xs text-white placeholder:text-zinc-500 focus:border-[#665df5]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["all", "New", "Reviewing", "Interviewing", "Shortlisted", "Hired"].map((stage) => (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                selectedStage === stage
                  ? "bg-[#665df5] text-white font-semibold shadow-sm"
                  : "bg-white/[0.03] text-zinc-400 border border-white/5 hover:text-white"
              }`}
            >
              {stage === "all" ? "All Stages" : stage}
            </button>
          ))}
        </div>
      </div>

      {/* Candidates Shadcn Table */}
      <Card className="border-white/5 bg-[#0c0d12] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="border-b border-white/5 bg-white/[0.01]">
            <TableRow className="border-white/5 hover:bg-transparent text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              <TableHead className="px-6 py-4 text-zinc-400">Candidate</TableHead>
              <TableHead className="px-6 py-4 text-zinc-400">Applied Role</TableHead>
              <TableHead className="px-6 py-4 text-zinc-400">Experience</TableHead>
              <TableHead className="px-6 py-4 text-zinc-400">Match Rating</TableHead>
              <TableHead className="px-6 py-4 text-zinc-400">Stage</TableHead>
              <TableHead className="px-6 py-4 text-right text-zinc-400">Pipeline Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-white/5">
            {filteredCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-xs text-zinc-500">
                  No applicants found matching your filter criteria.
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
                        <div className="font-semibold text-white">{cand.name}</div>
                        <div className="text-[11px] text-zinc-400 font-mono">{cand.email}</div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Applied Role */}
                  <TableCell className="px-6 py-4 font-medium text-zinc-200">
                    <div>{cand.role}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {cand.skills.map((s) => (
                        <span
                          key={s}
                          className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-zinc-400 border border-white/5"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </TableCell>

                  {/* Experience */}
                  <TableCell className="px-6 py-4 text-zinc-300">
                    <div>{cand.experience}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">Applied {cand.appliedDate}</div>
                  </TableCell>

                  {/* Match Rating */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-amber-400" />
                      <span>{cand.rating.toFixed(1)}</span>
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
                      className="rounded-xl border border-white/10 bg-[#161720] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#665df5]"
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
    </div>
  )
}
