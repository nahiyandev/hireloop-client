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
import { Loader2 } from "lucide-react"
import { useSession } from "@/lib/auth-client"

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

export default function SeekerSavedJobsPage() {
  const { data: session } = useSession()
  const userEmail = session?.user?.email
  const storageKey = userEmail ? `hireloop_saved_jobs_${userEmail}` : "hireloop_saved_jobs"

  const [savedJobs, setSavedJobs] = React.useState<SavedJob[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [sortBy, setSortBy] = React.useState<"recent" | "oldest">("recent")

  // Load bookmarked jobs from localStorage and fetch from server
  React.useEffect(() => {
    async function loadSavedJobs() {
      setIsLoading(true)
      try {
        const savedIds: string[] = JSON.parse(localStorage.getItem(storageKey) || "[]")
        if (!Array.isArray(savedIds) || savedIds.length === 0) {
          setSavedJobs([])
          return
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
        const res = await fetch(`${apiUrl}/jobs`)
        if (res.ok) {
          const allJobs = await res.json()
          if (Array.isArray(allJobs)) {
            const mapped: SavedJob[] = allJobs
              .filter((j: any) => savedIds.includes(j._id || j.id))
              .map((j: any) => ({
                id: j._id || j.id,
                title: j.title || "Job Listing",
                company: j.company || "Company",
                logo: j.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100",
                location: j.location || (j.isRemote ? "Remote" : "On-site"),
                salary: j.compensation || "Competitive",
                type: j.type || "Full-time",
                savedTime: "Bookmarked recently",
                deadline: "Rolling Deadline",
                isRemote: !!j.isRemote || (j.location && j.location.toLowerCase().includes("remote")),
              }))
            setSavedJobs(mapped)
          }
        }
      } catch (err) {
        console.warn("Could not load saved jobs:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadSavedJobs()
  }, [storageKey])

  const handleRemoveBookmark = (id: string, title: string) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== id))
    try {
      const savedIds: string[] = JSON.parse(localStorage.getItem(storageKey) || "[]")
      const updated = savedIds.filter((item) => item !== id)
      localStorage.setItem(storageKey, JSON.stringify(updated))
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
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#665df5]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-[#818cf8]">
              <Bookmark className="h-6 w-6" />
            </div>
            <div className="max-w-sm space-y-1">
              <h3 className="text-sm font-bold text-white tracking-tight">No saved opportunities yet</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {search
                  ? "No bookmarked positions match your search query. Try searching for a different company or job title."
                  : "Keep track of dream roles by bookmarking opportunities while browsing. Saved jobs will appear right here."}
              </p>
            </div>
            <Link href="/jobs">
              <Button className="h-8 rounded-xl bg-white text-xs font-semibold text-zinc-900 hover:bg-zinc-100 shadow-sm mt-1">
                <Search className="h-3.5 w-3.5 mr-1.5" />
                Browse Available Jobs
              </Button>
            </Link>
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
                    <Link href={`/jobs/${job.id}`}>
                      <h3 className="text-sm font-bold text-white hover:text-[#818cf8] transition-colors cursor-pointer">
                        {job.title}
                      </h3>
                    </Link>
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

                <Link href={`/jobs/${job.id}`}>
                  <Button
                    variant="brand"
                    size="sm"
                    className="h-10 rounded-xl px-4 text-xs font-semibold shadow-md shadow-indigo-600/25"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
