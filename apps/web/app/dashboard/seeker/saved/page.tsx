"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  Filter,
  MapPin,
  Search,
  Trash2,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent } from "@workspace/ui/components/card"
import { toast } from "@workspace/ui/components/sonner"
import { figmaPublicJobs } from "@/app/jobs/page"

interface SavedJob {
  id: string
  title: string
  company: string
  logo: string
  location: string
  salary: string
  type: string
  savedTime: string
  deadline: string
  isRemote: boolean
}

// Exact Saved Jobs items from Figma 02 · Job Seeker
const initialSavedJobs: SavedJob[] = [
  {
    id: "sav-1",
    title: "Senior Full-Stack Engineer (React & Go)",
    company: "Stripe",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100",
    location: "Remote (USA/EU)",
    salary: "$140k – $170k / yr",
    type: "Full-time",
    savedTime: "Saved 2 hours ago",
    deadline: "May 30, 2025",
    isRemote: true,
  },
  {
    id: "sav-2",
    title: "Design Systems Engineer",
    company: "Spotify",
    logo: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100",
    location: "Stockholm, Sweden (Hybrid)",
    salary: "€95k – €115k / yr",
    type: "Full-time",
    savedTime: "Saved yesterday",
    deadline: "Jun 14, 2025",
    isRemote: false,
  },
  {
    id: "sav-3",
    title: "DevOps & Cloud Specialist",
    company: "HirePulse Labs",
    logo: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=100",
    location: "Berlin, Germany",
    salary: "€95k – €120k / yr",
    type: "Contract",
    savedTime: "Saved 3 days ago",
    deadline: "Jun 30, 2025",
    isRemote: true,
  },
  {
    id: "sav-4",
    title: "Product Marketing Lead",
    company: "Vercel",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100",
    location: "Remote (Global)",
    salary: "$120k – $145k / yr",
    type: "Full-time",
    savedTime: "Saved 5 days ago",
    deadline: "Jul 15, 2025",
    isRemote: true,
  },
]

export default function SeekerSavedJobsPage() {
  const [savedJobs, setSavedJobs] = React.useState<SavedJob[]>(initialSavedJobs)
  const [search, setSearch] = React.useState("")
  const [sortBy, setSortBy] = React.useState<"recent" | "oldest">("recent")

  // Load bookmarked jobs from localStorage
  React.useEffect(() => {
    try {
      const savedIds: string[] = JSON.parse(localStorage.getItem("hireloop_saved_jobs") || "[]")
      if (Array.isArray(savedIds) && savedIds.length > 0) {
        const bookmarked: SavedJob[] = figmaPublicJobs
          .filter((j) => savedIds.includes(j.id))
          .map((j) => ({
            id: j.id,
            title: j.title,
            company: j.company,
            logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100",
            location: j.location,
            salary: j.salary,
            type: j.type,
            savedTime: "Bookmarked recently",
            deadline: "Rolling Deadline",
            isRemote: j.location.toLowerCase().includes("remote"),
          }))

        if (bookmarked.length > 0) {
          const remaining = initialSavedJobs.filter((init) => !savedIds.includes(init.id))
          setSavedJobs([...bookmarked, ...remaining])
        }
      }
    } catch {
      // ignore
    }
  }, [])

  const handleRemoveBookmark = (id: string, title: string) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== id))
    try {
      const savedIds: string[] = JSON.parse(localStorage.getItem("hireloop_saved_jobs") || "[]")
      const updated = savedIds.filter((item) => item !== id)
      localStorage.setItem("hireloop_saved_jobs", JSON.stringify(updated))
    } catch {
      // ignore
    }
    toast.success("Bookmark Removed", {
      description: `"${title}" has been removed from your saved list.`,
    })
  }

  const handleApply = (title: string) => {
    toast.info("Opening Application", {
      description: `Directing to candidate application flow for ${title}.`,
    })
  }

  const filtered = savedJobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Top Header (Figma Exact: 02 · Job Seeker) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-white font-medium">Saved Jobs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Saved Opportunities
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Manage and track your bookmarked opportunities before application deadlines expire.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/jobs">
            <Button
              variant="brand"
              className="h-10 gap-2 rounded-xl px-4 text-xs font-semibold shadow-lg shadow-indigo-600/30"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Browse More Roles</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Ribbon & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-zinc-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookmarked positions or companies..."
            className="h-9 w-full rounded-xl border-white/10 bg-[#161720] pl-9 pr-3 text-xs text-white placeholder:text-zinc-500 focus:border-[#665df5]"
          />
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-400">
            Total Saved: <strong className="text-white">{savedJobs.length}</strong>
          </span>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "recent" | "oldest")}
            className="h-9 rounded-xl border border-white/10 bg-[#161720] px-3 text-xs text-white focus:outline-none focus:border-[#665df5]"
          >
            <option value="recent">Recently Saved</option>
            <option value="oldest">Oldest Saved</option>
          </select>
        </div>
      </div>

      {/* Saved Jobs List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-12 text-center text-xs text-zinc-500">
            No saved jobs found matching your search.
          </div>
        ) : (
          filtered.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5 transition-all hover:border-white/15 hover:bg-[#12131a]/60 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
            >
              {/* Left Details */}
              <div className="flex items-start gap-4">
                <img
                  src={job.logo}
                  alt={job.company}
                  className="h-12 w-12 rounded-xl object-cover border border-white/10 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-white hover:text-[#818cf8] transition-colors cursor-pointer">
                      {job.title}
                    </h3>
                    <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-zinc-400 border border-white/5">
                      {job.type}
                    </span>
                    {job.isRemote && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                        Remote
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                    <span className="font-semibold text-zinc-200">{job.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-zinc-500" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-zinc-200">{job.salary}</span>
                  </div>

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-zinc-500 font-mono">
                    <span className="text-[#818cf8] flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {job.savedTime}
                    </span>
                    <span>•</span>
                    <span>Expires {job.deadline}</span>
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <button
                  onClick={() => handleRemoveBookmark(job.id, job.title)}
                  title="Remove Bookmark"
                  className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-zinc-400 hover:text-rose-400 hover:border-rose-500/20 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <Button
                  onClick={() => handleApply(job.title)}
                  variant="brand"
                  size="sm"
                  className="h-10 rounded-xl px-4 text-xs font-semibold shadow-md shadow-indigo-600/25"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
