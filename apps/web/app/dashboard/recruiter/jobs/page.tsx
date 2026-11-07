"use client"

import * as React from "react"
import Link from "next/link"
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  Eye,
  Filter,
  MapPin,
  MoreVertical,
  Plus,
  PlusCircle,
  Search,
  Trash2,
  Users,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { toast } from "@workspace/ui/components/sonner"

interface RecruiterJob {
  id: string
  title: string
  dept: string
  company: string
  location: string
  type: string
  compensation: string
  applicants: number
  deadline: string
  postedTime: string
  status: "Active" | "Expired" | "Draft"
}

// Exact Job Listings from Figma 03 · Recruiter update (lines 3135-3210)
const figmaJobListings: RecruiterJob[] = [
  {
    id: "job-f1",
    title: "Senior Full-Stack Engineer",
    dept: "Engineering",
    company: "HirePulse Network",
    location: "Remote (New York, USA)",
    type: "Full-time",
    compensation: "€25 – €40 / hr",
    applicants: 34,
    deadline: "May 30, 2025",
    postedTime: "Posted 4d ago",
    status: "Active",
  },
  {
    id: "job-f2",
    title: "Lead Systems Architect",
    dept: "Core Platform",
    company: "HirePulse Labs",
    location: "London, UK (Hybrid)",
    type: "Full-time",
    compensation: "€90k – €115k / yr",
    applicants: 19,
    deadline: "Jun 14, 2025",
    postedTime: "Posted 1w ago",
    status: "Active",
  },
  {
    id: "job-f3",
    title: "DevOps Specialist",
    dept: "Infrastructure",
    company: "HirePulse Platform",
    location: "Berlin, Germany",
    type: "Full-time",
    compensation: "€95k – €120k / yr",
    applicants: 12,
    deadline: "Jun 30, 2025",
    postedTime: "Posted 2w ago",
    status: "Active",
  },
  {
    id: "job-f4",
    title: "Product Marketing Lead",
    dept: "Growth",
    company: "HirePulse Network",
    location: "Remote (EU/US)",
    type: "Full-time",
    compensation: "€80k – €105k / yr",
    applicants: 27,
    deadline: "Jul 15, 2025",
    postedTime: "Posted 5d ago",
    status: "Active",
  },
  {
    id: "job-f5",
    title: "QA Automation Engineer",
    dept: "Quality",
    company: "HirePulse Labs",
    location: "Dublin, Ireland (Hybrid)",
    type: "Contract",
    compensation: "€35 – €50 / hr",
    applicants: 8,
    deadline: "May 01, 2025",
    postedTime: "Expired",
    status: "Expired",
  },
]

export default function ManageJobPostsPage() {
  const [jobs, setJobs] = React.useState<RecruiterJob[]>(figmaJobListings)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase()) ||
      j.dept.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || j.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const handleDelete = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id))
    toast.success("Job Post Removed", {
      description: "Listing has been archived and unpublished.",
    })
  }

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Page Headings (Figma Exact: lines 3136-3148) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-white font-medium">Manage Job Posts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Job Listings & Postings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Review live listings, monitor applicants, and update job details across your organization.
          </p>
        </div>

        <Link href="/dashboard/recruiter/jobs/new">
          <Button
            variant="brand"
            className="h-10 gap-2 rounded-xl px-4 text-xs font-semibold shadow-lg shadow-indigo-600/30"
          >
            <Plus className="h-4 w-4" />
            <span>+ New Job Post</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job title, department or location..."
            className="h-9 w-full rounded-xl border border-white/10 bg-[#161720] pl-9 pr-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#665df5]"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2">
          {["all", "active", "expired"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                statusFilter === st
                  ? "bg-[#665df5] text-white font-semibold shadow-sm"
                  : "bg-white/[0.03] text-zinc-400 border border-white/5 hover:text-white"
              }`}
            >
              {st === "all" ? `All (${jobs.length})` : st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Work Surface: Table Grid (Figma exact columns: lines 3151-3165) */}
      <div className="rounded-2xl border border-white/5 bg-[#0c0d12] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/5 bg-white/[0.01] text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-6 py-4">JOB TITLE & DEPT</th>
                <th className="px-6 py-4">COMPANY & LOCATION</th>
                <th className="px-6 py-4">TYPE</th>
                <th className="px-6 py-4">COMPENSATION</th>
                <th className="px-6 py-4">APPLICANTS</th>
                <th className="px-6 py-4">DEADLINE</th>
                <th className="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-zinc-500">
                    No job postings found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="transition-colors hover:bg-white/[0.01]">
                    {/* JOB TITLE & DEPT */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white leading-tight">{job.title}</div>
                      <div className="text-[11px] text-zinc-400">{job.dept}</div>
                    </td>

                    {/* COMPANY & LOCATION */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-200">{job.company}</div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-zinc-500 shrink-0" />
                        <span>{job.location}</span>
                      </div>
                    </td>

                    {/* TYPE */}
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-mono text-zinc-300 border border-white/5">
                        {job.type}
                      </span>
                    </td>

                    {/* COMPENSATION */}
                    <td className="px-6 py-4 font-mono font-medium text-white">
                      {job.compensation}
                    </td>

                    {/* APPLICANTS */}
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/recruiter/applicants?job=${job.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#665df5]/10 px-2.5 py-1 text-xs font-semibold text-[#a5b4fc] border border-[#665df5]/20 hover:bg-[#665df5]/20 transition-colors"
                      >
                        <Users className="h-3 w-3" />
                        <span>{job.applicants} Candidates</span>
                      </Link>
                    </td>

                    {/* DEADLINE */}
                    <td className="px-6 py-4">
                      <div className="font-mono text-[11px] text-zinc-200">{job.deadline}</div>
                      <div
                        className={`text-[10px] ${
                          job.status === "Expired" ? "text-rose-400" : "text-zinc-500"
                        }`}
                      >
                        {job.postedTime}
                      </div>
                    </td>

                    {/* ACTIONS (Update Button - Figma exact) */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/recruiter/jobs/new?edit=${job.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-xl border-white/10 bg-white/[0.02] text-xs font-medium text-white hover:bg-white/10"
                          >
                            <Edit3 className="mr-1.5 h-3 w-3" />
                            <span>Update</span>
                          </Button>
                        </Link>

                        <button
                          onClick={() => handleDelete(job.id)}
                          title="Delete Listing"
                          className="rounded-lg p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
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
    </div>
  )
}
