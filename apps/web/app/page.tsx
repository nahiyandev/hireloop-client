"use client"

import * as React from "react"
import Link from "next/link"
import {
  Briefcase,
  Building2,
  Check,
  Crosshair,
  FileCheck,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  ArrowRight,
  Zap,
} from "lucide-react"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { JobCard, type JobItem } from "@/components/job-card"
import { Footer } from "@/components/footer"
import { Loader2 } from "lucide-react"

const stats = [
  {
    icon: Briefcase,
    value: "50K",
    label: "Active Jobs",
  },
  {
    icon: Building2,
    value: "12K",
    label: "Companies",
  },
  {
    icon: Users,
    value: "2M",
    label: "Job Seekers",
  },
  {
    icon: Star,
    value: "97%",
    label: "Satisfication Rate",
  },
]

export default function HomePage() {
  const [keyword, setKeyword] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [featuredJobs, setFeaturedJobs] = React.useState<JobItem[]>([])
  const [totalJobCount, setTotalJobCount] = React.useState<number>(0)
  const [totalCompanyCount, setTotalCompanyCount] = React.useState<number>(0)
  const [totalUserCount, setTotalUserCount] = React.useState<number>(0)
  const [isLoadingJobs, setIsLoadingJobs] = React.useState(true)

  React.useEffect(() => {
    async function loadLandingData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
        const [jobsRes, compsRes, usersRes] = await Promise.all([
          fetch(`${apiUrl}/jobs`).catch(() => null),
          fetch(`${apiUrl}/companies`).catch(() => null),
          fetch(`${apiUrl}/users`).catch(() => null),
        ])

        if (jobsRes && jobsRes.ok) {
          const data = await jobsRes.json()
          if (Array.isArray(data)) {
            setTotalJobCount(data.length)
            const mapped: JobItem[] = data.slice(0, 4).map((j: any) => ({
              id: j._id || j.id,
              title: j.title || "Software Engineer",
              company: j.company || "Tech Company",
              location: j.location || "Remote",
              type: j.type || "Full-time",
              workplace: j.isRemote ? "Remote" : "On-site",
              salary: j.compensation || "$130k - $160k",
              category: j.category || "Engineering",
              postedAt: "Recently posted",
              verified: true,
              featured: true,
            }))
            setFeaturedJobs(mapped)
          }
        }

        if (compsRes && compsRes.ok) {
          const comps = await compsRes.json()
          if (Array.isArray(comps)) {
            setTotalCompanyCount(comps.length)
          }
        }

        if (usersRes && usersRes.ok) {
          const users = await usersRes.json()
          if (Array.isArray(users)) {
            setTotalUserCount(users.length)
          }
        }
      } catch (err) {
        console.warn("Could not load landing page data:", err)
      } finally {
        setIsLoadingJobs(false)
      }
    }
    loadLandingData()
  }, [])

  const dynamicStats = [
    {
      icon: Briefcase,
      value: totalJobCount > 0 ? `${totalJobCount}` : "50K+",
      label: "Live Open Roles",
    },
    {
      icon: Building2,
      value: totalCompanyCount > 0 ? `${totalCompanyCount}` : "12K+",
      label: "Verified Employers",
    },
    {
      icon: Users,
      value: totalUserCount > 0 ? `${totalUserCount}` : "2M+",
      label: "Active Job Seekers",
    },
    {
      icon: Star,
      value: "99.2%",
      label: "Employer Satisfaction",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[#030305] text-white selection:bg-[#5252ff] selection:text-white">
      {/* HERO SECTION (100% matched with Figma Homepage) */}
      <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24">
        {/* Centered Headline & Search */}
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center px-4 sm:px-6 lg:px-8">
          {/* Top Pill Badge with horizontal side lines */}
          <div className="flex items-center justify-center gap-3">
            <span className="hidden sm:inline-block h-px w-14 bg-gradient-to-r from-transparent to-white/20" />
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#121316]/90 px-4 py-1.5 shadow-md backdrop-blur-md">
              <span className="text-sm">💼</span>
              <span className="tracking-wider uppercase font-mono text-[11px] text-zinc-300 font-semibold">
                {totalJobCount > 0 ? `${totalJobCount} ACTIVE TECH ROLES AVAILABLE` : "50,000+ NEW JOBS THIS MONTH"}
              </span>
            </div>
            <span className="hidden sm:inline-block h-px w-14 bg-gradient-to-l from-transparent to-white/20" />
          </div>

          {/* Main Headline */}
          <h1 className="mt-7 text-4xl font-extrabold tracking-tight sm:text-6xl md:text-[68px] text-white leading-[1.1]">
            Find Your Dream Job Today
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
            HireLoop connects top talent with world-class companies. Browse thousands of
            curated opportunities and land your next role &mdash; faster.
          </p>

          {/* Dual Search Bar Container */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              window.location.href = `/jobs?q=${encodeURIComponent(keyword)}&loc=${encodeURIComponent(location)}`
            }}
            className="mt-8 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#101117]/90 p-2 shadow-2xl backdrop-blur-xl transition-all hover:border-white/20 focus-within:border-[#5252ff]/80"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Job Title / Skill input */}
              <div className="relative flex flex-1 items-center px-3 py-1.5">
                <Search className="h-4 w-4 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Job title, skill or company"
                  className="w-full bg-transparent pl-3 pr-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                />
              </div>

              {/* Vertical divider */}
              <div className="hidden sm:block h-6 w-0.0625rem bg-white/15 shrink-0" />

              {/* Location input */}
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

              {/* Search Button */}
              <button
                type="submit"
                className="flex h-10 w-full sm:w-11 shrink-0 items-center justify-center rounded-xl bg-[#5252ff] hover:bg-[#4343e8] text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
                aria-label="Search jobs"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Trending Positions */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-zinc-500 font-medium">Trending Positions:</span>
            {["Full-Stack Engineer", "Product Designer", "AI Engineering", "DevOps Engineer"].map((tag) => (
              <Link
                key={tag}
                href={`/jobs?q=${encodeURIComponent(tag)}`}
                className="rounded-full border border-white/10 bg-[#121316] px-3.5 py-1 text-xs text-zinc-300 hover:border-[#665df5]/40 hover:text-white transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* FULL PAGE / EXPANSIVE GLOBE & 4 STATS CARDS */}
        <div className="relative mt-8 sm:mt-12 w-full max-w-[1640px] mx-auto flex flex-col items-center px-4 sm:px-6 lg:px-10 xl:px-14">
          <div className="relative w-full flex justify-center overflow-hidden">
            <img
              src="/images/figma_exact_globe.png"
              alt="Assisting over 15,000 job seekers find their dream positions."
              className="w-full max-w-6xl xl:max-w-7xl object-contain drop-shadow-[0_20px_50px_rgba(82,82,255,0.25)]"
            />
          </div>

          {/* 4 STATS CARDS (Positioned cleanly below text with ample clearance) */}
          <div className="relative mt-2 sm:mt-4 md:mt-6 w-full grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 z-10">
            {dynamicStats.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0c0d12]/95 p-6 sm:p-8 text-left shadow-2xl backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:scale-[1.02]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-zinc-300 mb-8 sm:mb-10">
                    <Icon className="h-5 w-5 text-white/90" />
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-mono">
                      {item.value}
                    </div>
                    <div className="mt-2 text-xs sm:text-sm font-medium text-zinc-400">
                      {item.label}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FEATURED JOBS SECTION */}
      <section className="relative border-t border-white/5 bg-[#090a0f] py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#818cf8]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Curated Opportunities</span>
              </div>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Featured Tech Roles
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Hand-picked roles offering top-tier compensation, verified culture, and flexible work.
              </p>
            </div>

            <Link
              href="/jobs"
              className="group flex items-center gap-2 text-sm font-semibold text-[#818cf8] hover:text-[#a5b4fc] transition-colors"
            >
              <span>View all {totalJobCount > 0 ? `${totalJobCount} jobs` : "jobs"}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Job Cards Grid */}
          {isLoadingJobs ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-7 w-7 animate-spin text-[#665df5]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BENTO VALUE PROPS (Matching Figma Seeker & Recruiter Modules) */}
      <section className="border-t border-white/5 py-20 px-4 sm:px-6 lg:px-8 bg-[#07080b]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Why Tech Professionals Choose HireLoop
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400">
              A modern hiring engine built without spam or recruiter black holes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-[#818cf8] border border-indigo-500/20 mb-5">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">One-Click Easy Apply</h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Save your profile and resume once. Apply to hundreds of verified jobs with a single click without repetitive forms.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-5">
                <FileCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">AI-Tailored Resumes</h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Our built-in AI adapts your experience highlights to match exact job requirements, guaranteeing higher recruiter response rates.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">100% Vetted Employers</h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                No ghost jobs or fake agencies. Every company on HireLoop is verified with active hiring budgets and transparent salaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-gradient-to-b from-[#07080b] to-[#040407] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(102,93,245,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative mx-auto max-w-5xl rounded-3xl border border-white/10 bg-[#0d0e15] p-8 sm:p-14 text-center shadow-2xl backdrop-blur-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-mono font-semibold text-[#818cf8] mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>JOIN THE MODERN HIRING NETWORK</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
            Ready to find your next great opportunity?
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Whether you&apos;re a software engineer looking for high-impact roles or an employer hiring top tech talent &mdash; HireLoop gets you there faster.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/jobs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-zinc-950 hover:bg-zinc-100 shadow-xl shadow-white/10 transition-all hover:scale-105 active:scale-95"
            >
              <Search className="h-4 w-4" />
              <span>Browse Open Roles</span>
            </Link>

            <Link
              href="/dashboard/recruiter/jobs/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
            >
              <Briefcase className="h-4 w-4 text-[#818cf8]" />
              <span>Post a Job as Employer</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  )
}
