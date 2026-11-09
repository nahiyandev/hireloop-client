"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import {
  Bookmark,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Filter,
  Flame,
  Globe,
  GraduationCap,
  Layers,
  Laptop,
  Loader2,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
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
  isRemote?: boolean
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

  // URL searchParams bindings
  const queryParam = searchParams.get("q") || ""
  const locParam = searchParams.get("loc") || ""
  const typeParam = searchParams.get("type")
  const workplaceParam = searchParams.get("workplace")
  const expParam = searchParams.get("exp")
  const catParam = searchParams.get("cat")
  const salaryParam = searchParams.get("salary")
  const sortParam = (searchParams.get("sort") as "recent" | "salary") || "recent"
  const pageParam = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1)

  const [searchInput, setSearchInput] = React.useState(queryParam)
  const [liveJobs, setLiveJobs] = React.useState<JobListItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [savedJobs, setSavedJobs] = React.useState<Set<string>>(new Set())
  const [showMobileFilters, setShowMobileFilters] = React.useState(false)

  // Sync search input if queryParam changes externally
  React.useEffect(() => {
    setSearchInput(queryParam)
  }, [queryParam])

  // Multi-select parse helpers
  const selectedTypes = React.useMemo(() => {
    return typeParam ? typeParam.split(",").filter(Boolean) : []
  }, [typeParam])

  const selectedWorkplaces = React.useMemo(() => {
    return workplaceParam ? workplaceParam.split(",").filter(Boolean) : []
  }, [workplaceParam])

  const selectedExperience = React.useMemo(() => {
    return expParam ? expParam.split(",").filter(Boolean) : []
  }, [expParam])

  const selectedCategories = React.useMemo(() => {
    return catParam ? catParam.split(",").filter(Boolean) : []
  }, [catParam])

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

  // Fetch live jobs from backend API
  React.useEffect(() => {
    async function loadServerJobs() {
      setIsLoading(true)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
        const res = await fetch(`${apiUrl}/jobs`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) {
            const mapped: JobListItem[] = data.map((j: any) => {
              const loc = j.location || "Remote"
              const isRem = j.isRemote === true || loc.toLowerCase().includes("remote")
              const expYears = j.experience || (
                j.title?.toLowerCase().includes("senior") ? "5+ Years" :
                j.title?.toLowerCase().includes("lead") ? "6+ Years" :
                j.title?.toLowerCase().includes("junior") ? "1+ Years" : "3+ Years"
              )

              return {
                id: j._id || j.id,
                title: j.title,
                company: j.company,
                location: loc,
                salary: j.compensation || j.salary || "$130k – $160k",
                type: j.type || "Full-time",
                experience: expYears,
                isRemote: isRem,
                initial: (j.company?.[0] || "H").toUpperCase(),
                logoColor: "from-indigo-600 to-purple-600",
                verified: true,
                description: j.responsibilities || j.description || "Exciting tech role.",
                responsibilities: j.responsibilities ? j.responsibilities.split("\n") : [],
                requirements: j.requirements ? j.requirements.split("\n") : [],
                skills: j.skills || ["React", "TypeScript", "Tailwind CSS"],
                benefits: ["Health Insurance", "401k Matching", "Remote Flexibility"],
                companySize: "100 - 250 Employees",
                industry: j.category || "Engineering & Tech",
                website: "https://hireloop.io",
              }
            })
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

  // Dynamic filter counter calculation for sidebar pills
  const filterCounts = React.useMemo(() => {
    return {
      // Types
      fullTime: liveJobs.filter((j) => j.type.toLowerCase().includes("full")).length,
      partTime: liveJobs.filter((j) => j.type.toLowerCase().includes("part")).length,
      contract: liveJobs.filter((j) => j.type.toLowerCase().includes("contract")).length,
      freelance: liveJobs.filter((j) => j.type.toLowerCase().includes("freelance")).length,

      // Workplace
      remote: liveJobs.filter((j) => j.isRemote || j.location.toLowerCase().includes("remote")).length,
      hybrid: liveJobs.filter((j) => j.location.toLowerCase().includes("hybrid")).length,
      onsite: liveJobs.filter((j) => !j.isRemote && !j.location.toLowerCase().includes("remote") && !j.location.toLowerCase().includes("hybrid")).length,

      // Experience
      junior: liveJobs.filter((j) => {
        const t = j.title.toLowerCase()
        const e = (j.experience || "").toLowerCase()
        return t.includes("junior") || t.includes("entry") || t.includes("intern") || e.includes("1+") || e.includes("0-")
      }).length,
      mid: liveJobs.filter((j) => {
        const t = j.title.toLowerCase()
        const e = (j.experience || "").toLowerCase()
        return t.includes("mid") || (!t.includes("senior") && !t.includes("junior") && (e.includes("2+") || e.includes("3+") || e.includes("4+")))
      }).length,
      senior: liveJobs.filter((j) => {
        const t = j.title.toLowerCase()
        const e = (j.experience || "").toLowerCase()
        return t.includes("senior") || t.includes("lead") || t.includes("staff") || e.includes("5+") || e.includes("6+")
      }).length,

      // Categories
      engineering: liveJobs.filter((j) => (j.industry || "").toLowerCase().includes("eng") || (j.industry || "").toLowerCase().includes("tech")).length,
      design: liveJobs.filter((j) => (j.industry || "").toLowerCase().includes("design") || (j.title || "").toLowerCase().includes("designer")).length,
      marketing: liveJobs.filter((j) => (j.industry || "").toLowerCase().includes("market") || (j.title || "").toLowerCase().includes("seo") || (j.title || "").toLowerCase().includes("media")).length,
      support: liveJobs.filter((j) => (j.industry || "").toLowerCase().includes("support") || (j.title || "").toLowerCase().includes("support") || (j.title || "").toLowerCase().includes("customer")).length,
    }
  }, [liveJobs])

  // Filter jobs based on all searchParams
  const filteredJobs = React.useMemo(() => {
    return liveJobs
      .filter((job) => {
        // Keyword Search
        if (queryParam.trim()) {
          const q = queryParam.toLowerCase()
          const matches =
            job.title.toLowerCase().includes(q) ||
            job.company.toLowerCase().includes(q) ||
            job.location.toLowerCase().includes(q) ||
            (job.industry && job.industry.toLowerCase().includes(q))
          if (!matches) return false
        }

        // Location Filter
        if (locParam.trim()) {
          const loc = locParam.toLowerCase()
          if (!job.location.toLowerCase().includes(loc)) return false
        }

        // Job Type (Full-time, Part-time, Contract, Freelance)
        if (selectedTypes.length > 0) {
          const matchesType = selectedTypes.some((t) =>
            job.type.toLowerCase().includes(t.toLowerCase())
          )
          if (!matchesType) return false
        }

        // Workplace Policy (Remote, Hybrid, On-site)
        if (selectedWorkplaces.length > 0) {
          const isJobRemote = job.isRemote || job.location.toLowerCase().includes("remote")
          const isJobHybrid = job.location.toLowerCase().includes("hybrid")
          const isJobOnsite = !isJobRemote && !isJobHybrid

          const matchesWorkplace = selectedWorkplaces.some((w) => {
            if (w === "remote") return isJobRemote
            if (w === "hybrid") return isJobHybrid
            if (w === "onsite") return isJobOnsite
            return false
          })
          if (!matchesWorkplace) return false
        }

        // Experience Level
        if (selectedExperience.length > 0) {
          const title = job.title.toLowerCase()
          const exp = (job.experience || "").toLowerCase()
          const matchesExp = selectedExperience.some((lvl) => {
            if (lvl === "junior") {
              return title.includes("junior") || title.includes("entry") || title.includes("intern") || exp.includes("1+") || exp.includes("0-")
            }
            if (lvl === "mid") {
              return title.includes("mid") || (!title.includes("senior") && !title.includes("junior") && (exp.includes("2+") || exp.includes("3+") || exp.includes("4+")))
            }
            if (lvl === "senior") {
              return title.includes("senior") || title.includes("lead") || title.includes("staff") || exp.includes("5+") || exp.includes("6+")
            }
            return false
          })
          if (!matchesExp) return false
        }

        // Department / Category
        if (selectedCategories.length > 0) {
          const jobCat = (job.industry || "").toLowerCase()
          const jobTitle = job.title.toLowerCase()
          const matchesCategory = selectedCategories.some((c) => {
            if (c === "engineering") return jobCat.includes("eng") || jobCat.includes("tech")
            if (c === "design") return jobCat.includes("design") || jobTitle.includes("designer")
            if (c === "marketing") return jobCat.includes("market") || jobTitle.includes("seo") || jobTitle.includes("media")
            if (c === "support") return jobCat.includes("support") || jobTitle.includes("support") || jobTitle.includes("customer")
            return jobCat.includes(c.toLowerCase())
          })
          if (!matchesCategory) return false
        }

        // Minimum Salary Filter
        if (salaryParam && salaryParam !== "all") {
          const minRequired = parseInt(salaryParam.replace(/[^0-9]/g, ""), 10) * 1000
          let annualAmt = 0
          if (job.salary.toLowerCase().includes("/ hr")) {
            const hrRate = parseInt(job.salary.replace(/[^0-9]/g, ""), 10) || 0
            annualAmt = hrRate * 2000
          } else {
            const nums = job.salary.match(/\d+/g)
            if (nums && nums.length > 0) {
              const maxNum = Math.max(...nums.map(Number))
              annualAmt = maxNum < 1000 ? maxNum * 1000 : maxNum
            }
          }
          if (annualAmt > 0 && annualAmt < minRequired) return false
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
  }, [liveJobs, queryParam, locParam, selectedTypes, selectedWorkplaces, selectedExperience, selectedCategories, salaryParam, sortParam])

  // Pagination with searchParams
  const ITEMS_PER_PAGE = 6
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(pageParam, totalPages)
  const paginatedJobs = React.useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredJobs.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredJobs, safeCurrentPage])

  // Submit search bar
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    updateUrlParams({ q: searchInput.trim() || null, page: null })
  }

  // Toggle helpers for multi-select
  const toggleType = (type: string) => {
    const next = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type]
    updateUrlParams({
      type: next.length > 0 ? next.join(",") : null,
      page: null,
    })
  }

  const toggleWorkplace = (w: string) => {
    const next = selectedWorkplaces.includes(w)
      ? selectedWorkplaces.filter((item) => item !== w)
      : [...selectedWorkplaces, w]
    updateUrlParams({
      workplace: next.length > 0 ? next.join(",") : null,
      page: null,
    })
  }

  const toggleExperience = (exp: string) => {
    const next = selectedExperience.includes(exp)
      ? selectedExperience.filter((item) => item !== exp)
      : [...selectedExperience, exp]
    updateUrlParams({
      exp: next.length > 0 ? next.join(",") : null,
      page: null,
    })
  }

  const toggleCategory = (cat: string) => {
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter((item) => item !== cat)
      : [...selectedCategories, cat]
    updateUrlParams({
      cat: next.length > 0 ? next.join(",") : null,
      page: null,
    })
  }

  const handleSalaryChange = (salVal: string) => {
    updateUrlParams({
      salary: salVal === "all" ? null : salVal,
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

  const handleResetAll = () => {
    setSearchInput("")
    router.push(pathname, { scroll: false })
  }

  // Total active filter count
  const activeFilterCount =
    (queryParam ? 1 : 0) +
    (locParam ? 1 : 0) +
    selectedTypes.length +
    selectedWorkplaces.length +
    selectedExperience.length +
    selectedCategories.length +
    (salaryParam && salaryParam !== "all" ? 1 : 0)

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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
              placeholder="Search by job title, company, skills, keywords..."
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

        {/* Mobile Filter Toggle Button */}
        <div className="flex lg:hidden items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="h-9 gap-2 rounded-xl border-white/10 bg-[#0c0d12] text-xs text-zinc-200"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#818cf8]" />
            <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}</span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showMobileFilters ? "rotate-180" : ""}`} />
          </Button>

          {activeFilterCount > 0 && (
            <button
              onClick={handleResetAll}
              className="text-xs text-[#818cf8] hover:underline font-mono"
            >
              Reset all
            </button>
          )}
        </div>

        {/* Two-Column Grid: Filters Sidebar + Main Job Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Column: Comprehensive Filters Sidebar */}
          <aside
            className={`${
              showMobileFilters ? "block" : "hidden"
            } lg:block lg:col-span-1 rounded-2xl border border-white/10 bg-[#0c0d12] p-6 space-y-6 shadow-xl`}
          >
            {/* Header: Title and Reset Button */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#818cf8]" />
                <h2 className="text-sm font-bold text-white tracking-tight">Job Filters</h2>
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="flex items-center gap-1 text-[11px] font-mono text-[#818cf8] hover:underline"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* 1. Workplace Policy (Remote / Hybrid / On-site) */}
            <div className="space-y-3 border-b border-white/5 pb-5">
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-zinc-400" />
                <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">Workplace</h3>
              </div>
              <div className="space-y-2">
                {[
                  { id: "remote", label: "Remote", count: filterCounts.remote },
                  { id: "hybrid", label: "Hybrid", count: filterCounts.hybrid },
                  { id: "onsite", label: "On-site", count: filterCounts.onsite },
                ].map((item) => {
                  const isChecked = selectedWorkplaces.includes(item.id)
                  return (
                    <label
                      key={item.id}
                      onClick={() => toggleWorkplace(item.id)}
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

            {/* 2. Employment Type */}
            <div className="space-y-3 border-b border-white/5 pb-5">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">Job Type</h3>
              </div>
              <div className="space-y-2">
                {[
                  { id: "Full-time", label: "Full-time", count: filterCounts.fullTime },
                  { id: "Part-time", label: "Part-time", count: filterCounts.partTime },
                  { id: "Contract", label: "Contract", count: filterCounts.contract },
                  { id: "Freelance", label: "Freelance", count: filterCounts.freelance },
                ].map((item) => {
                  const isChecked = selectedTypes.includes(item.id)
                  return (
                    <label
                      key={item.id}
                      onClick={() => toggleType(item.id)}
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

            {/* 3. Experience Level */}
            <div className="space-y-3 border-b border-white/5 pb-5">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-3.5 w-3.5 text-zinc-400" />
                <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">Experience</h3>
              </div>
              <div className="space-y-2">
                {[
                  { id: "junior", label: "Entry / Junior (0-2 yrs)", count: filterCounts.junior },
                  { id: "mid", label: "Mid-Level (3-5 yrs)", count: filterCounts.mid },
                  { id: "senior", label: "Senior Level (5+ yrs)", count: filterCounts.senior },
                ].map((item) => {
                  const isChecked = selectedExperience.includes(item.id)
                  return (
                    <label
                      key={item.id}
                      onClick={() => toggleExperience(item.id)}
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

            {/* 4. Category / Department */}
            <div className="space-y-3 border-b border-white/5 pb-5">
              <div className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-zinc-400" />
                <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">Department</h3>
              </div>
              <div className="space-y-2">
                {[
                  { id: "engineering", label: "Engineering & Tech", count: filterCounts.engineering },
                  { id: "design", label: "Design & Creative", count: filterCounts.design },
                  { id: "marketing", label: "Marketing & Growth", count: filterCounts.marketing },
                  { id: "support", label: "Customer Support", count: filterCounts.support },
                ].map((item) => {
                  const isChecked = selectedCategories.includes(item.id)
                  return (
                    <label
                      key={item.id}
                      onClick={() => toggleCategory(item.id)}
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

            {/* 5. Minimum Salary Threshold */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5 text-zinc-400" />
                <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">Minimum Salary</h3>
              </div>
              <div className="space-y-2">
                {[
                  { id: "all", label: "All Salaries" },
                  { id: "30k", label: "$30k+ / year" },
                  { id: "60k", label: "$60k+ / year" },
                  { id: "100k", label: "$100k+ / year" },
                  { id: "150k", label: "$150k+ / year" },
                ].map((item) => {
                  const isSelected = (!salaryParam && item.id === "all") || salaryParam === item.id
                  return (
                    <label
                      key={item.id}
                      onClick={() => handleSalaryChange(item.id)}
                      className="flex items-center justify-between text-xs text-zinc-300 hover:text-white cursor-pointer select-none transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="minSalary"
                          checked={isSelected}
                          onChange={() => {}}
                          className="h-4 w-4 border-white/20 bg-white/5 text-[#665df5] accent-[#665df5] focus:ring-0"
                        />
                        <span>{item.label}</span>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* Right Column: Main Job Listings */}
          <section className="lg:col-span-3 space-y-4">
            {/* Top Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#0c0d12] border border-white/5 p-4 rounded-2xl">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Found {isLoading ? "..." : filteredJobs.length} Professional Job{filteredJobs.length === 1 ? "" : "s"}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Showing live postings matched with your preferences
                </p>
              </div>

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

            {/* Active Filters Tag Ribbon */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                <span className="text-xs text-zinc-400 font-medium">Active:</span>

                {queryParam && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white">
                    Keyword: &quot;{queryParam}&quot;
                    <button
                      onClick={() => {
                        setSearchInput("")
                        updateUrlParams({ q: null, page: null })
                      }}
                      className="text-zinc-400 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {selectedWorkplaces.map((w) => (
                  <span
                    key={w}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-300 capitalize"
                  >
                    {w}
                    <button onClick={() => toggleWorkplace(w)} className="hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                {selectedTypes.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-200"
                  >
                    {t}
                    <button onClick={() => toggleType(t)} className="text-zinc-400 hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                {selectedExperience.map((exp) => (
                  <span
                    key={exp}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300 capitalize"
                  >
                    {exp === "junior" ? "Junior (0-2y)" : exp === "mid" ? "Mid-Level" : "Senior (5+y)"}
                    <button onClick={() => toggleExperience(exp)} className="hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                {selectedCategories.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs text-purple-300 capitalize"
                  >
                    {c}
                    <button onClick={() => toggleCategory(c)} className="hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                {salaryParam && salaryParam !== "all" && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-300">
                    Min: ${salaryParam}+
                    <button onClick={() => handleSalaryChange("all")} className="hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                <button
                  onClick={handleResetAll}
                  className="text-xs text-[#818cf8] hover:underline font-mono ml-auto"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Job Cards Stack */}
            <div className="space-y-3.5">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center p-16 rounded-2xl border border-white/5 bg-[#0c0d12]">
                  <Loader2 className="h-8 w-8 animate-spin text-[#665df5] mb-3" />
                  <span className="text-xs text-zinc-400">Loading professional opportunities...</span>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#0c0d12] p-16 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-zinc-400">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">No matching opportunities found</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    We could not find any active postings matching your current combination of filters.
                  </p>
                  <Button
                    type="button"
                    onClick={handleResetAll}
                    className="mt-2 h-9 rounded-xl bg-white text-zinc-950 px-5 text-xs font-semibold hover:bg-zinc-100"
                  >
                    Reset All Filters
                  </Button>
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
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#818cf8] transition-colors leading-tight">
                              {job.title}
                            </h3>
                            {job.isRemote && (
                              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                                Remote
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-xs text-zinc-400">
                            <span className="text-zinc-300 font-medium">{job.company}</span>
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

                            {job.industry && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-400 font-medium">
                                <Layers className="h-3 w-3 text-zinc-500" />
                                <span>{job.industry}</span>
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
