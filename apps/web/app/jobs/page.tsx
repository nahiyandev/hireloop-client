"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import {
  Bookmark,
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Flame,
  Globe,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  X,
  Zap,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Footer } from "@/components/footer"
import { toast } from "@workspace/ui/components/sonner"

export interface JobListItem {
  id: string
  title: string
  company: string
  location: string
  salary: string
  type: string
  experience?: string
  tag?: {
    type: "easy-apply" | "hot-job" | "senior"
    label: string
  }
  initial: string
  logoColor?: string
  description?: string
  responsibilities?: string[]
  requirements?: string[]
  skills?: string[]
  benefits?: string[]
  companySize?: string
  industry?: string
  website?: string
  verified?: boolean
}

export const figmaPublicJobs: JobListItem[] = []

function BrowseJobsContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const queryParam = searchParams.get("q") || ""
  const locParam = searchParams.get("loc") || ""
  const typeParam = searchParams.get("type")
  const sortParam = (searchParams.get("sort") as "recent" | "salary") || "recent"
  const pageParam = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1)

  const [searchInput, setSearchInput] = React.useState(queryParam)
  const [liveJobs, setLiveJobs] = React.useState<JobListItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [savedJobs, setSavedJobs] = React.useState<Set<string>>(new Set())

  // Keep search input in sync if URL queryParam changes externally
  React.useEffect(() => {
    setSearchInput(queryParam)
  }, [queryParam])

  // Selected types derived from searchParams or default to ["Full-time"]
  const selectedTypes = React.useMemo(() => {
    if (typeParam !== null && typeParam !== undefined) {
      return typeParam ? typeParam.split(",").filter(Boolean) : []
    }
    return ["Full-time"]
  }, [typeParam])

  // Helper to sync state changes to searchParams in URL
  const updateUrlParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === "" ||
          (key === "page" && value === "1") ||
          (key === "sort" && value === "recent")
        ) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
      const queryString = params.toString()
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  // Fetch live jobs from backend
  React.useEffect(() => {
    async function loadServerJobs() {
      setIsLoading(true)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
        const res = await fetch(`${apiUrl}/jobs`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) {
            const mapped: JobListItem[] = data.map((j: any) => ({
              id: j._id || j.id,
              title: j.title,
              company: j.company,
              location: j.location || "Remote",
              salary: j.compensation || "$130k – $160k",
              type: j.type || "Full-time",
              experience: "3+ Years",
              initial: (j.company?.[0] || "H").toUpperCase(),
              logoColor: "from-indigo-600 to-purple-600",
              verified: true,
              description: j.responsibilities || j.description || "Exciting tech role.",
              responsibilities: j.responsibilities ? j.responsibilities.split("\n") : [],
              requirements: j.requirements ? j.requirements.split("\n") : [],
              skills: ["React", "TypeScript", "Design Systems"],
              benefits: ["Health Insurance", "401k Matching", "Remote Flexibility"],
              companySize: "100 - 250 Employees",
              industry: j.category || "Technology",
              website: "https://hireloop.io",
            }))
            setLiveJobs(mapped)
          }
        }
      } catch (err) {
        console.warn("Could not load server jobs:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadServerJobs()
  }, [])

  // Filter jobs based on searchParams
  const filteredJobs = React.useMemo(() => {
    return liveJobs
      .filter((job) => {
        if (queryParam.trim()) {
          const q = queryParam.toLowerCase()
          const matches =
            job.title.toLowerCase().includes(q) ||
            job.company.toLowerCase().includes(q) ||
            job.location.toLowerCase().includes(q)
          if (!matches) return false
        }

        if (locParam.trim()) {
          const loc = locParam.toLowerCase()
          if (!job.location.toLowerCase().includes(loc)) return false
        }

        if (selectedTypes.length > 0) {
          const matchesType = selectedTypes.some((t) =>
            job.type.toLowerCase().includes(t.toLowerCase())
          )
          if (!matchesType) return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortParam === "salary") {
          const salA = parseInt(a.salary.replace(/[^0-9]/g, "")) || 0
          const salB = parseInt(b.salary.replace(/[^0-9]/g, "")) || 0
          return salB - salA
        }
        return 0
      })
  }, [liveJobs, queryParam, locParam, selectedTypes, sortParam])

  // Pagination with searchParams
  const ITEMS_PER_PAGE = 6
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(pageParam, totalPages)
  const paginatedJobs = React.useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredJobs.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredJobs, safeCurrentPage])

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    updateUrlParams({ q: searchInput.trim() || null, page: null })
  }

  const toggleType = (type: string) => {
    const nextTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type]
    updateUrlParams({
      type: nextTypes.length > 0 ? nextTypes.join(",") : "",
      page: null,
    })
  }

  const handleSortChange = (newSort: "recent" | "salary") => {
    updateUrlParams({
      sort: newSort === "recent" ? null : newSort,
      page: null,
    })
  }

  const handlePageChange = (newPage: number) => {
    updateUrlParams({
      page: newPage > 1 ? String(newPage) : null,
    })
  }

  // Load saved bookmarks from localStorage
  React.useEffect(() => {
    try {
      const saved: string[] = JSON.parse(localStorage.getItem("hireloop_saved_jobs") || "[]")
      if (Array.isArray(saved)) {
        setSavedJobs(new Set(saved))
      }
    } catch {
      // ignore
    }
  }, [])

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setSavedJobs((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        toast.info("Bookmark Removed")
      } else {
        next.add(id)
        toast.success("Job Saved to Bookmarks")
      }
      try {
        localStorage.setItem("hireloop_saved_jobs", JSON.stringify(Array.from(next)))
      } catch {
        // ignore
      }
      return next
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#07080b] text-white">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search Ribbon Card (Driven by searchParams) */}
        <form
          onSubmit={handleSearchSubmit}
          className="rounded-2xl border border-white/10 bg-[#0c0d12] p-2.5 shadow-2xl flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 flex-1 px-3">
            <Search className="h-4 w-4 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by job title, company, keywords..."
              className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("")
                  updateUrlParams({ q: null, page: null })
                }}
                className="text-zinc-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <Button
            type="submit"
            className="h-10 rounded-xl bg-white text-zinc-950 px-6 font-semibold text-xs hover:bg-zinc-100 shadow-md transition-all shrink-0"
          >
            Search Jobs
          </Button>
        </form>

        {/* Two-Column Grid: Filters Sidebar + Main Job Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Column: Filters (Figma Screenshot 1) */}
          <aside className="lg:col-span-1 rounded-2xl border border-white/10 bg-[#0c0d12] p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight">Filters</h2>
              {(queryParam || locParam || typeParam !== null) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("")
                    router.push(pathname)
                  }}
                  className="text-[11px] font-mono text-[#818cf8] hover:underline"
                >
                  Reset all
                </button>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-zinc-300">Job Type</h3>

              <div className="space-y-2.5">
                {[
                  { label: "Full-time", count: liveJobs.filter((j) => j.type.toLowerCase().includes("full")).length },
                  { label: "Contract", count: liveJobs.filter((j) => j.type.toLowerCase().includes("contract")).length },
                  { label: "Freelance", count: liveJobs.filter((j) => j.type.toLowerCase().includes("freelance")).length },
                ].map((item) => {
                  const isChecked = selectedTypes.includes(item.label)
                  return (
                    <label
                      key={item.label}
                      onClick={() => toggleType(item.label)}
                      className="flex items-center justify-between text-xs text-zinc-300 hover:text-white cursor-pointer select-none transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#665df5] accent-[#665df5] focus:ring-0"
                        />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500">{item.count}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* Right Column: Main Job Listings */}
          <section className="lg:col-span-3 space-y-5">
            {/* Top Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Found {isLoading ? "..." : filteredJobs.length} Professional Job{filteredJobs.length === 1 ? "" : "s"}
              </h2>

              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span>Sort by:</span>
                <select
                  value={sortParam}
                  onChange={(e) => handleSortChange(e.target.value as "recent" | "salary")}
                  className="rounded-xl border border-white/10 bg-[#161720] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#665df5]"
                >
                  <option value="recent">Most Recent</option>
                  <option value="salary">Highest Salary</option>
                </select>
              </div>
            </div>

            {/* Job Cards Stack (Figma Screenshot 1) */}
            <div className="space-y-3.5">
              {isLoading ? (
                <div className="flex items-center justify-center p-16">
                  <Loader2 className="h-8 w-8 animate-spin text-[#665df5]" />
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#0c0d12] p-12 text-center text-xs text-zinc-500">
                  No professional positions found matching your criteria. Try adjusting keywords or filters.
                </div>
              ) : (
                paginatedJobs.map((job) => {
                  const isSaved = savedJobs.has(job.id)
                  return (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.id}`}
                      className="block group rounded-2xl border border-white/10 bg-[#0c0d12] p-6 hover:border-white/20 transition-all shadow-lg hover:shadow-2xl"
                    >
                      <div className="flex items-start gap-4">
                        {/* Company Logo Icon */}
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${
                            job.logoColor || "from-indigo-600 to-purple-600"
                          } border border-white/15 text-white font-bold text-lg shadow-md`}
                        >
                          {job.initial}
                        </div>

                        {/* Middle Job Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#818cf8] transition-colors leading-tight">
                            {job.title}
                          </h3>
                          <div className="mt-1 text-xs text-zinc-400">
                            <span>{job.company}</span>
                            <span className="mx-1.5">•</span>
                            <span>{job.location}</span>
                          </div>

                          {/* Badges / Meta Pills */}
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            {/* Salary */}
                            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-mono text-zinc-300">
                              <DollarSign className="h-3 w-3 text-zinc-400" />
                              <span>{job.salary}</span>
                            </span>

                            {/* Type */}
                            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-300">
                              <Clock className="h-3 w-3 text-zinc-400" />
                              <span>{job.type}</span>
                            </span>

                            {/* Tag: Easy Apply / Hot Job / Senior */}
                            {job.tag?.type === "easy-apply" && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400">
                                <Zap className="h-3 w-3 fill-current" />
                                <span>{job.tag.label}</span>
                              </span>
                            )}

                            {job.tag?.type === "hot-job" && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-400">
                                <Flame className="h-3 w-3 fill-current" />
                                <span>{job.tag.label}</span>
                              </span>
                            )}

                            {job.experience && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-400 font-medium">
                                <span>⭐</span>
                                <span>{job.experience}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bookmark Button (Right) */}
                        <button
                          onClick={(e) => toggleSave(e, job.id)}
                          title={isSaved ? "Remove Bookmark" : "Save Job"}
                          className={`rounded-xl p-2.5 transition-colors ${
                            isSaved
                              ? "text-[#818cf8] bg-[#665df5]/15"
                              : "text-zinc-500 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>

            {/* Pagination Controls Driven by searchParams */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-6">
                <button
                  disabled={safeCurrentPage <= 1}
                  onClick={() => handlePageChange(safeCurrentPage - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - safeCurrentPage) <= 1)
                  .map((page, idx, arr) => {
                    const prev = arr[idx - 1]
                    const showEllipsis = prev && page - prev > 1
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <span className="px-1 text-xs text-zinc-500">...</span>}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all ${
                            safeCurrentPage === page
                              ? "bg-white text-zinc-950 font-bold shadow-md"
                              : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    )
                  })}

                <button
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => handlePageChange(safeCurrentPage + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  )
}

export default function BrowseJobsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#07080b] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#665df5] border-t-transparent" />
        </div>
      }
    >
      <BrowseJobsContent />
    </React.Suspense>
  )
}
