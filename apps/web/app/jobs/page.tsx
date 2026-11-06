"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  Briefcase,
  ChevronDown,
  Compass,
  Crosshair,
  Filter,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react"
import { JobCard, type JobItem } from "@/components/job-card"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Footer } from "@/components/footer"

const allJobs: JobItem[] = [
  {
    id: "1",
    title: "Senior Product Designer",
    company: "TechFlow Systems",
    location: "San Francisco, CA (Remote)",
    type: "Full-time",
    workplace: "Remote",
    salary: "140k - 180k",
    category: "Design",
    postedAt: "2 hours ago",
    verified: true,
    featured: true,
    description:
      "Lead the end-to-end design process for major platform features, from discovery to high-fidelity prototyping and design systems.",
  },
  {
    id: "2",
    title: "AI Research Engineer",
    company: "CloudScale AI",
    location: "Boston, MA (Hybrid)",
    type: "Full-time",
    workplace: "Hybrid",
    salary: "175k - 220k",
    category: "AI & ML",
    postedAt: "5 hours ago",
    verified: true,
    featured: true,
    description:
      "Train, fine-tune, and deploy multimodal foundational models to production with low-latency inference pipelines.",
  },
  {
    id: "3",
    title: "Design Systems Lead",
    company: "LinearFlow Labs",
    location: "New York, NY (Remote)",
    type: "Full-time",
    workplace: "Remote",
    salary: "150k - 190k",
    category: "Design",
    postedAt: "1 day ago",
    verified: true,
    description:
      "Maintain, document, and evolve our cross-platform design token ecosystem used by 40+ product engineers.",
  },
  {
    id: "4",
    title: "DevOps & Infrastructure Lead",
    company: "HealthAI Corp",
    location: "Austin, TX (Remote)",
    type: "Contract",
    workplace: "Remote",
    salary: "130k - 165k",
    category: "DevOps",
    postedAt: "1 day ago",
    verified: true,
    description:
      "Architect resilient Kubernetes clusters, automated CI/CD workflows, and HIPAA-compliant cloud infrastructure.",
  },
  {
    id: "5",
    title: "Lead Full-Stack Engineer (Next.js & AI)",
    company: "Nexus Labs",
    location: "San Francisco, CA (Hybrid)",
    type: "Full-time",
    workplace: "Hybrid",
    salary: "160k - 205k",
    category: "Engineering",
    postedAt: "2 days ago",
    verified: true,
    description:
      "Build real-time collaborative workspaces with Next.js 16, React 19, Server Components, and vector search embeddings.",
  },
  {
    id: "6",
    title: "Product Marketing Manager",
    company: "Veloce Technologies",
    location: "Chicago, IL (On-site)",
    type: "Full-time",
    workplace: "On-site",
    salary: "115k - 145k",
    category: "Marketing",
    postedAt: "3 days ago",
    verified: false,
    description:
      "Drive go-to-market campaigns, positioning, customer research, and developer relations for our enterprise developer API.",
  },
  {
    id: "7",
    title: "Frontend Systems Engineer",
    company: "StripeX Ventures",
    location: "Remote (Global)",
    type: "Contract",
    workplace: "Remote",
    salary: "120k - 150k",
    category: "Engineering",
    postedAt: "3 days ago",
    verified: true,
    description:
      "Build high-performance fintech checkout flows, payment state machines, and micro-interactions with Tailwind and TypeScript.",
  },
  {
    id: "8",
    title: "Senior Security & Compliance Engineer",
    company: "TrustVault",
    location: "Seattle, WA (Remote)",
    type: "Full-time",
    workplace: "Remote",
    salary: "165k - 195k",
    category: "Security",
    postedAt: "4 days ago",
    verified: true,
    description:
      "Lead SOC2 Type II audits, zero-trust cloud network architecture, identity federation, and threat modeling.",
  },
]

export default function BrowseJobsPage() {
  const searchParams = useSearchParams()
  const initialKeyword = searchParams.get("q") || ""
  const initialLocation = searchParams.get("loc") || ""

  const [keyword, setKeyword] = React.useState(initialKeyword)
  const [location, setLocation] = React.useState(initialLocation)
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([])
  const [selectedWorkplace, setSelectedWorkplace] = React.useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All")
  const [sortBy, setSortBy] = React.useState<"recent" | "salary">("recent")
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false)

  // Toggle filter helper
  const toggleFilter = (list: string[], setList: (v: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item))
    } else {
      setList([...list, item])
    }
  }

  // Filtered jobs
  const filteredJobs = React.useMemo(() => {
    return allJobs
      .filter((job) => {
        // Keyword filter
        if (keyword.trim()) {
          const q = keyword.toLowerCase()
          const matches =
            job.title.toLowerCase().includes(q) ||
            job.company.toLowerCase().includes(q) ||
            job.category.toLowerCase().includes(q) ||
            (job.description && job.description.toLowerCase().includes(q))
          if (!matches) return false
        }

        // Location filter
        if (location.trim()) {
          const loc = location.toLowerCase()
          if (!job.location.toLowerCase().includes(loc)) return false
        }

        // Job type
        if (selectedTypes.length > 0 && !selectedTypes.includes(job.type)) {
          return false
        }

        // Workplace
        if (selectedWorkplace.length > 0 && !selectedWorkplace.includes(job.workplace)) {
          return false
        }

        // Category
        if (selectedCategory !== "All" && job.category !== selectedCategory) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === "salary") {
          const salA = parseInt(a.salary.replace(/[^0-9]/g, "")) || 0
          const salB = parseInt(b.salary.replace(/[^0-9]/g, "")) || 0
          return salB - salA
        }
        return 0
      })
  }, [keyword, location, selectedTypes, selectedWorkplace, selectedCategory, sortBy])

  const categories = ["All", "Design", "Engineering", "AI & ML", "DevOps", "Marketing", "Security"]

  return (
    <div className="flex min-h-screen flex-col bg-[#07080b] text-white selection:bg-[#5252ff] selection:text-white">
      {/* Top Banner / Search Section */}
      <section className="relative border-b border-white/5 bg-[#090a0f] pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#818cf8]">
                <Compass className="h-3.5 w-3.5" />
                <span>Job Marketplace</span>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Browse Vetted Tech Opportunities
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">
              Showing active opportunities with verified compensation
            </p>
          </div>

          {/* Search Bar matching Figma */}
          <div className="rounded-2xl border border-white/10 bg-[#101117] p-2 shadow-xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex flex-1 items-center px-3 py-1.5">
                <Search className="h-4 w-4 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search by job title, skills or company..."
                  className="w-full bg-transparent pl-3 pr-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                />
              </div>

              <div className="hidden sm:block h-6 w-[1px] bg-white/10 shrink-0" />

              <div className="relative flex flex-1 items-center px-3 py-1.5">
                <Crosshair className="h-4 w-4 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location or Remote"
                  className="w-full bg-transparent pl-3 pr-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                />
              </div>

              <Button
                variant="brand"
                className="h-10 px-6 rounded-xl font-semibold text-xs shadow-md shadow-indigo-600/30"
                onClick={() => {}}
              >
                Search
              </Button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#5252ff] text-white shadow-xs"
                    : "border border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area: Sidebar Filters + Jobs Grid */}
      <section className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 md:hidden">
          <p className="text-sm font-semibold text-white">
            {filteredJobs.length} Jobs Available
          </p>
          <Button
            variant="outline"
            size="sm"
            className="border-white/15 text-xs text-white"
            onClick={() => setMobileFilterOpen((prev) => !prev)}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
            <span>Filters</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ASIDE: SIDEBAR FILTERS (Matching Figma "Aside - Sidebar Filters") */}
          <aside className={`md:block ${mobileFilterOpen ? "block" : "hidden"}`}>
            <div className="sticky top-24 space-y-6 rounded-2xl border border-white/10 bg-[#0e0f15] p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                  <Filter className="h-4 w-4 text-[#818cf8]" />
                  <span>Filters & Sort</span>
                </h3>
                {(selectedTypes.length > 0 || selectedWorkplace.length > 0 || selectedCategory !== "All") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTypes([])
                      setSelectedWorkplace([])
                      setSelectedCategory("All")
                      setKeyword("")
                      setLocation("")
                    }}
                    className="text-[11px] font-semibold text-rose-400 hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Filter Group: Job Type */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Job Type
                </h4>
                <div className="space-y-2">
                  {["Full-time", "Contract", "Part-time", "Freelance"].map((type) => {
                    const checked = selectedTypes.includes(type)
                    return (
                      <label
                        key={type}
                        className="flex cursor-pointer items-center justify-between text-xs text-zinc-300 hover:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleFilter(selectedTypes, setSelectedTypes, type)}
                            className="rounded border-white/20 bg-white/5 accent-[#5252ff]"
                          />
                          <span>{type}</span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Filter Group: Workplace */}
              <div className="border-t border-white/10 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Workplace
                </h4>
                <div className="space-y-2">
                  {["Remote", "Hybrid", "On-site"].map((w) => {
                    const checked = selectedWorkplace.includes(w)
                    return (
                      <label
                        key={w}
                        className="flex cursor-pointer items-center justify-between text-xs text-zinc-300 hover:text-white"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleFilter(selectedWorkplace, setSelectedWorkplace, w)}
                            className="rounded border-white/20 bg-white/5 accent-[#5252ff]"
                          />
                          <span>{w}</span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN JOBS GRID (Matching Figma "Section - Main Job Listing") */}
          <main className="md:col-span-3 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Found {filteredJobs.length} Professional Jobs
              </h2>

              {/* Sort by dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "recent" | "salary")}
                  className="rounded-lg border border-white/10 bg-[#101117] px-2.5 py-1 text-xs text-white focus:outline-none"
                >
                  <option value="recent">Most Recent</option>
                  <option value="salary">Highest Salary</option>
                </select>
              </div>
            </div>

            {/* Jobs List */}
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-zinc-400 mb-4">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-white">No jobs matched your criteria</h3>
                <p className="mt-1 text-xs text-zinc-400 max-w-sm">
                  Try adjusting your keywords, workplace, or reset filters to explore more opportunities.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 border-white/15 text-xs text-white"
                  onClick={() => {
                    setSelectedTypes([])
                    setSelectedWorkplace([])
                    setSelectedCategory("All")
                    setKeyword("")
                    setLocation("")
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </main>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  )
}
