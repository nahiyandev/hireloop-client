"use client"

import * as React from "react"
import Link from "next/link"
import {
  Clock,
  Eye,
  FolderKanban,
  Mail,
  Plus,
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/components/sonner"

interface JobListing {
  id: string
  ref: string
  title: string
  company: string
  companyInitial: string
  category: "Design" | "Engineering" | "Marketing" | "Product"
  type: "Full-time" | "Contract" | "Remote" | "Hybrid"
  datePosted: string
  status: "Active" | "Closed"
}

const initialJobs: JobListing[] = [
  {
    id: "job-1",
    ref: "Ref: HL-90210",
    title: "Senior Product Designer",
    company: "Nexus Lab",
    companyInitial: "N",
    category: "Design",
    type: "Full-time",
    datePosted: "Oct 24, 2023",
    status: "Active",
  },
  {
    id: "job-2",
    ref: "Ref: HL-88231",
    title: "Full-stack Engineer",
    company: "Quantum",
    companyInitial: "Q",
    category: "Engineering",
    type: "Contract",
    datePosted: "Oct 22, 2023",
    status: "Active",
  },
  {
    id: "job-3",
    ref: "Ref: HL-11022",
    title: "Marketing Director",
    company: "Vanguard",
    companyInitial: "V",
    category: "Marketing",
    type: "Full-time",
    datePosted: "Oct 15, 2023",
    status: "Closed",
  },
  {
    id: "job-4",
    ref: "Ref: HL-99032",
    title: "Backend Architect",
    company: "CloudScale",
    companyInitial: "C",
    category: "Engineering",
    type: "Remote",
    datePosted: "Oct 20, 2023",
    status: "Active",
  },
  {
    id: "job-5",
    ref: "Ref: HL-44112",
    title: "UX Research Lead",
    company: "Humanize",
    companyInitial: "H",
    category: "Design",
    type: "Hybrid",
    datePosted: "Oct 19, 2023",
    status: "Active",
  },
]

export default function AdminJobsPage() {
  const [jobs, setJobs] = React.useState<JobListing[]>([])
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  const [tabFilter, setTabFilter] = React.useState<"all" | "Active" | "Closed">("all")
  const [isLoading, setIsLoading] = React.useState(true)

  // Load server jobs
  React.useEffect(() => {
    async function loadJobs() {
      setIsLoading(true)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        const res = await fetch(`${apiUrl}/jobs`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) {
            const mapped: JobListing[] = data.map((j: any, idx: number) => ({
              id: j._id || j.id || `job-live-${idx}`,
              ref: `Ref: HL-${String(idx + 1000).slice(-5)}`,
              title: j.title,
              company: j.company,
              companyInitial: (j.company?.[0] || "J").toUpperCase(),
              category: (["Design", "Engineering", "Marketing", "Product"].includes(j.category)
                ? j.category
                : "Engineering") as JobListing["category"],
              type: (["Full-time", "Contract", "Remote", "Hybrid"].includes(j.type)
                ? j.type
                : "Full-time") as JobListing["type"],
              datePosted: j.createdAt
                ? new Date(j.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                : "Recently",
              status: j.status === "Closed" || j.status === "Expired" ? "Closed" : "Active",
            }))
            setJobs(mapped)
          }
        }
      } catch (err) {
        console.error("Failed to load jobs:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadJobs()
  }, [])

  const filteredJobs = jobs.filter((j) => {
    const matchesStatus =
      tabFilter !== "all"
        ? j.status === tabFilter
        : selectedStatus === "all" || j.status === selectedStatus
    const matchesCat =
      selectedCategory === "all" || j.category === selectedCategory
    return matchesStatus && matchesCat
  })

  const activeCount = jobs.filter((j) => j.status === "Active").length
  const closedCount = jobs.filter((j) => j.status === "Closed").length

  const handleDelete = async (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id))
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      await fetch(`${apiUrl}/jobs/${id}`, { method: "DELETE" })
    } catch {}
    toast.success("Job Post Removed", {
      description: "Listing deleted from the platform directory.",
    })
  }

  const handleView = (job: JobListing) => {
    toast.info(`Inspecting ${job.title}`, {
      description: `Viewing detailed application metrics for ${job.company}.`,
    })
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Create Button (Figma Screenshot 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Manage Jobs</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Oversee all active listings and historical job posts across the platform.
          </p>
        </div>

        <Link href="/dashboard/recruiter/jobs/new">
          <Button className="h-9 gap-2 rounded-xl bg-white text-xs font-semibold text-zinc-900 hover:bg-zinc-100 shadow-sm transition-all">
            <Plus className="h-4 w-4" />
            <span>Create Job</span>
          </Button>
        </Link>
      </div>

      {/* Filter Ribbon (Status dropdown, Category dropdown, and Status Pills) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value)
              setTabFilter("all")
            }}
            className="h-9 rounded-xl border border-white/10 bg-[#161720] px-3 text-xs text-white focus:outline-none focus:border-[#665df5]"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 rounded-xl border border-white/10 bg-[#161720] px-3 text-xs text-white focus:outline-none focus:border-[#665df5]"
          >
            <option value="all">All Categories</option>
            <option value="Design">Design</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        {/* Status Count Pills (Active 128 / Closed 45) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTabFilter(tabFilter === "Active" ? "all" : "Active")}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
              tabFilter === "Active"
                ? "bg-white/[0.12] text-white border border-white/20"
                : "bg-white/[0.03] text-zinc-400 border border-white/5 hover:text-white"
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setTabFilter(tabFilter === "Closed" ? "all" : "Closed")}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
              tabFilter === "Closed"
                ? "bg-white/[0.12] text-white border border-white/20"
                : "bg-white/[0.03] text-zinc-400 border border-white/5 hover:text-white"
            }`}
          >
            Closed ({closedCount})
          </button>
        </div>
      </div>

      {/* Jobs Table (Exact columns and styling from Screenshot 3) */}
      <div className="rounded-2xl border border-white/5 bg-[#0c0d12] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/5 bg-white/[0.01] text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-6 py-4">TITLE</th>
                <th className="px-6 py-4">COMPANY</th>
                <th className="px-6 py-4">CATEGORY</th>
                <th className="px-6 py-4">TYPE</th>
                <th className="px-6 py-4">DATE POSTED</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-zinc-500">
                    {isLoading ? "Loading jobs directory..." : "No job listings found matching your criteria."}
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                <tr key={job.id} className="transition-colors hover:bg-white/[0.01]">
                  {/* TITLE & Ref */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{job.title}</div>
                    <div className="text-[10px] text-zinc-400 font-mono">{job.ref}</div>
                  </td>

                  {/* COMPANY with square avatar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 border border-white/10 font-bold text-xs text-white">
                        {job.companyInitial}
                      </div>
                      <span className="font-medium text-white">{job.company}</span>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="px-6 py-4 text-zinc-300">{job.category}</td>

                  {/* TYPE */}
                  <td className="px-6 py-4 text-zinc-300">{job.type}</td>

                  {/* DATE POSTED */}
                  <td className="px-6 py-4 font-mono text-[11px] text-zinc-400">
                    {job.datePosted}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    {job.status === "Active" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                        Closed
                      </span>
                    )}
                  </td>

                  {/* ACTIONS (Eye View + Trash Delete) */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(job)}
                        title="View Job"
                        className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        title="Delete Listing"
                        className="rounded-lg p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3 Bottom Stat Cards (Exact match from Screenshot 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stat 1: Engagement Rate */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <TrendingUp className="h-4 w-4 text-[#818cf8]" />
            <span>Engagement Rate</span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white">82.4%</div>
          <span className="mt-1 inline-block text-[11px] text-emerald-400 font-medium">
            +5.2% from last month
          </span>
        </div>

        {/* Stat 2: Avg. Time to Fill */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <Clock className="h-4 w-4 text-[#818cf8]" />
            <span>Avg. Time to Fill</span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white">14 Days</div>
          <span className="mt-1 inline-block text-[11px] text-zinc-400 font-medium">
            Stable performance
          </span>
        </div>

        {/* Stat 3: Total Applications */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <Mail className="h-4 w-4 text-[#818cf8]" />
            <span>Total Applications</span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white">12,840</div>
          <span className="mt-1 inline-block text-[11px] text-rose-400 font-medium">
            -2.1% across tech sectors
          </span>
        </div>
      </div>
    </div>
  )
}
