"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
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
  MapPin,
  Search,
  Sparkles,
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

// Exact Figma Public Jobs (Screenshot 1 & Screenshot 2)
export const figmaPublicJobs: JobListItem[] = [
  {
    id: "job-p1",
    title: "Senior Product Designer",
    company: "CloudScale AI",
    location: "Remote (US)",
    salary: "$140k – $180k",
    type: "Full-time",
    experience: "5+ Years",
    initial: "C",
    logoColor: "from-blue-600 to-indigo-600",
    tag: { type: "easy-apply", label: "Easy Apply" },
    verified: true,
    description:
      "At CloudScale AI, we are building the next generation of infrastructure monitoring tools. We are looking for a Senior Product Designer who is passionate about translating complex technical workflows into elegant, intuitive interfaces. You will be a key member of our design team, working closely with engineering and product leadership to define the vision for our core platform experience.",
    responsibilities: [
      "Lead the end-to-end design process for major platform features, from discovery to high-fidelity implementation.",
      "Collaborate with cross-functional partners to understand user needs and translate them into functional design requirements.",
      "Maintain and evolve our design system, ensuring consistency and accessibility across the entire product suite.",
      "Conduct user research and usability testing to validate design decisions and iterate based on feedback.",
    ],
    requirements: [
      "5+ years of experience designing complex B2B SaaS products or data-heavy applications.",
      "A strong portfolio showcasing your design process and problem-solving skills.",
    ],
    skills: ["Figma Expertise", "System Thinking", "UI/UX Design", "Basic Frontend"],
    benefits: [
      "Full Health & Dental",
      "Competitive 401k",
      "Latest Hardware Stipend",
      "Unlimited PTO",
    ],
    companySize: "250 - 500 Employees",
    industry: "SaaS / Artificial Intelligence",
    website: "https://cloudscale.ai",
  },
  {
    id: "job-p2",
    title: "Lead Frontend Engineer",
    company: "FinGrid Solutions",
    location: "New York, NY",
    salary: "$165k – $210k",
    type: "Hybrid",
    experience: "6+ Years",
    initial: "F",
    logoColor: "from-emerald-600 to-teal-600",
    verified: true,
    description:
      "FinGrid Solutions is transforming institutional fintech architectures with high-throughput real-time dashboards and payment state machines. We need a Lead Frontend Engineer to guide our React/TypeScript product teams.",
    responsibilities: [
      "Architect ultra-responsive low latency web applications for institutional finance.",
      "Partner with product managers and backend systems teams to design robust API contracts.",
      "Mentor senior and mid-level software engineers on modern frontend best practices.",
    ],
    requirements: [
      "6+ years of specialized frontend engineering with TypeScript and modern state architectures.",
      "Deep understanding of browser performance profiling and memory optimization.",
    ],
    skills: ["React", "TypeScript", "Next.js", "Performance Optimization"],
    benefits: [
      "Full Health & Dental",
      "Competitive 401k",
      "Annual Performance Bonus",
      "Commuter Stipend",
    ],
    companySize: "500+ Employees",
    industry: "Fintech & Capital Markets",
    website: "https://fingrid.io",
  },
  {
    id: "job-p3",
    title: "UX Researcher",
    company: "CreativeStudio",
    location: "Austin, TX",
    salary: "$110k – $145k",
    type: "Contract",
    experience: "3+ Years",
    initial: "C",
    logoColor: "from-purple-600 to-pink-600",
    verified: true,
    description:
      "CreativeStudio delivers world-class creative brand systems and interactive products. We are seeking a dedicated UX Researcher to lead qualitative and quantitative discovery studies across our client portfolio.",
    responsibilities: [
      "Design and execute generative and evaluative user research protocols.",
      "Translate research findings into actionable product insights and journey maps.",
      "Facilitate synthesis workshops with design and engineering teams.",
    ],
    requirements: [
      "3+ years in UX Research with proven experience in mixed-method research methodologies.",
      "Strong storytelling and presentation capabilities.",
    ],
    skills: ["User Interviews", "Usability Testing", "Journey Mapping", "Quantitative Analysis"],
    benefits: [
      "Flexible Remote Setup",
      "Competitive Hourly Rate",
      "Hardware Allowance",
      "Wellness Stipend",
    ],
    companySize: "50 - 100 Employees",
    industry: "Design & Digital Products",
    website: "https://creativestudio.com",
  },
  {
    id: "job-p4",
    title: "Machine Learning Engineer",
    company: "HealthAI Corp",
    location: "Boston, MA (Remote)",
    salary: "$180k – $250k",
    type: "Full-time",
    experience: "4+ Years",
    initial: "H",
    logoColor: "from-amber-600 to-orange-600",
    tag: { type: "hot-job", label: "Hot Job" },
    verified: true,
    description:
      "HealthAI Corp develops diagnostic AI systems assisting medical practitioners worldwide. We are looking for an ML Engineer to fine-tune clinical foundational models and deploy low-latency HIPAA-compliant inference pipelines.",
    responsibilities: [
      "Train, fine-tune, and evaluate deep neural networks on specialized clinical datasets.",
      "Optimize inference models for edge deployment and cloud GPU clusters.",
      "Collaborate with clinical domain specialists to ensure diagnostic precision.",
    ],
    requirements: [
      "Master's or Ph.D. in Computer Science, Machine Learning, or related field.",
      "Strong proficiency in PyTorch, Python, and CUDA optimization.",
    ],
    skills: ["PyTorch", "Python", "LLMs", "Distributed Training"],
    benefits: [
      "Comprehensive Medical & Dental",
      "Stock Options & Equity",
      "Generous Parental Leave",
      "Conference Travel Budget",
    ],
    companySize: "100 - 250 Employees",
    industry: "Healthcare & AI Technology",
    website: "https://healthai.corp",
  },
]

function BrowseJobsContent() {
  const searchParams = useSearchParams()
  const initialKeyword = searchParams.get("q") || ""
  const [keyword, setKeyword] = React.useState(initialKeyword)
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>(["Full-time"])
  const [sortBy, setSortBy] = React.useState<"recent" | "salary">("recent")
  const [savedJobs, setSavedJobs] = React.useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = React.useState(1)
  const [liveJobs, setLiveJobs] = React.useState<JobListItem[]>([])

  // Fetch live jobs from backend
  React.useEffect(() => {
    async function loadServerJobs() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        const res = await fetch(`${apiUrl}/jobs`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
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
            // Merge with Figma demo jobs deduping by title
            const seen = new Set(mapped.map((m) => m.title.toLowerCase()))
            const remainingDemos = figmaPublicJobs.filter(
              (f) => !seen.has(f.title.toLowerCase())
            )
            setLiveJobs([...mapped, ...remainingDemos])
          }
        }
      } catch {
        // Fallback to Figma exact demo list
      }
    }
    loadServerJobs()
  }, [])

  const displayList = liveJobs.length > 0 ? liveJobs : figmaPublicJobs

  // Filter jobs
  const filteredJobs = React.useMemo(() => {
    return displayList
      .filter((job) => {
        if (keyword.trim()) {
          const q = keyword.toLowerCase()
          const matches =
            job.title.toLowerCase().includes(q) ||
            job.company.toLowerCase().includes(q) ||
            job.location.toLowerCase().includes(q)
          if (!matches) return false
        }

        if (selectedTypes.length > 0) {
          const matchesType = selectedTypes.some(
            (t) => job.type.toLowerCase().includes(t.toLowerCase())
          )
          if (!matchesType) return false
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
  }, [displayList, keyword, selectedTypes, sortBy])

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
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
        {/* Search Ribbon Card (Figma Screenshot 1) */}
        <div className="rounded-2xl border border-white/10 bg-[#0c0d12] p-2.5 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 px-3">
            <Search className="h-4 w-4 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by job title, keywords..."
              className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            />
          </div>

          <Button
            onClick={() => toast.info(`Searching for "${keyword}"...`)}
            className="h-10 rounded-xl bg-white text-zinc-950 px-6 font-semibold text-xs hover:bg-zinc-100 shadow-md transition-all shrink-0"
          >
            Search Jobs
          </Button>
        </div>

        {/* Two-Column Grid: Filters Sidebar + Main Job Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Column: Filters (Figma Screenshot 1) */}
          <aside className="lg:col-span-1 rounded-2xl border border-white/10 bg-[#0c0d12] p-6 space-y-6">
            <h2 className="text-base font-bold text-white tracking-tight">Filters</h2>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-zinc-300">Job Type</h3>

              <div className="space-y-2.5">
                {[
                  { label: "Full-time", count: "1.2k" },
                  { label: "Contract", count: "432" },
                  { label: "Freelance", count: "156" },
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
                Found {filteredJobs.length > 0 ? "1,248" : "0"} Professional Jobs
              </h2>

              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "recent" | "salary")}
                  className="rounded-xl border border-white/10 bg-[#161720] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#665df5]"
                >
                  <option value="recent">Most Recent</option>
                  <option value="salary">Highest Salary</option>
                </select>
              </div>
            </div>

            {/* Job Cards Stack (Figma Screenshot 1) */}
            <div className="space-y-3.5">
              {filteredJobs.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#0c0d12] p-12 text-center text-xs text-zinc-500">
                  No professional positions found matching your criteria. Try adjusting keywords or filters.
                </div>
              ) : (
                filteredJobs.map((job) => {
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

            {/* Pagination Controls (Figma Screenshot 1) */}
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={() => setCurrentPage(1)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                  currentPage === 1
                    ? "bg-white text-zinc-950 shadow-md"
                    : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
                }`}
              >
                1
              </button>

              <button
                onClick={() => setCurrentPage(2)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all ${
                  currentPage === 2
                    ? "bg-white text-zinc-950 font-bold"
                    : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
                }`}
              >
                2
              </button>

              <button
                onClick={() => setCurrentPage(3)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all ${
                  currentPage === 3
                    ? "bg-white text-zinc-950 font-bold"
                    : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
                }`}
              >
                3
              </button>

              <span className="px-1 text-xs text-zinc-500">...</span>

              <button
                onClick={() => setCurrentPage(42)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all ${
                  currentPage === 42
                    ? "bg-white text-zinc-950 font-bold"
                    : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
                }`}
              >
                42
              </button>

              <button
                onClick={() => setCurrentPage((p) => Math.min(42, p + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
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
