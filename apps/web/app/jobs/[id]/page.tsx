"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Award,
  BarChart2,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  CreditCard,
  DollarSign,
  ExternalLink,
  Gift,
  Globe,
  HeartPulse,
  Laptop,
  Layers,
  Loader2,
  MapPin,
  Palmtree,
  PenTool,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Zap,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Footer } from "@/components/footer"
import { toast } from "@workspace/ui/components/sonner"
import { authClient } from "@/lib/auth-client"
import { type JobListItem } from "../page"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = (params?.id as string) || ""

  const { data: session } = authClient.useSession()
  const user = session?.user
  const userRole =
    (user as any)?.role ||
    (user as any)?.selectedRole ||
    (user as any)?.accountType ||
    (user ? "seeker" : null)

  const [job, setJob] = React.useState<JobListItem | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaved, setIsSaved] = React.useState(false)
  const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [hasAlreadyApplied, setHasAlreadyApplied] = React.useState(false)
  const [applyFormData, setApplyFormData] = React.useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    portfolioUrl: "",
    linkedinUrl: "",
    note: "",
  })

  // Prefill with authenticated seeker details
  React.useEffect(() => {
    if (user) {
      setApplyFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
      }))
    }
  }, [user])

  // Check if current user has already applied for this job
  React.useEffect(() => {
    async function checkExistingApplication() {
      if (!user?.email || !jobId) return
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
        const res = await fetch(
          `${apiUrl}/applications?jobId=${encodeURIComponent(jobId)}&email=${encodeURIComponent(user.email)}`
        )
        if (res.ok) {
          const list = await res.json()
          if (Array.isArray(list) && list.length > 0) {
            setHasAlreadyApplied(true)
          }
        }
      } catch {
        // ignore
      }
    }
    checkExistingApplication()
  }, [user, jobId])

  // Check saved state in localStorage
  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("hireloop_saved_jobs") || "[]")
      if (Array.isArray(saved) && saved.includes(jobId)) {
        setIsSaved(true)
      }
    } catch {
      // ignore
    }
  }, [jobId])

  const toggleSaveJob = () => {
    try {
      const saved: string[] = JSON.parse(localStorage.getItem("hireloop_saved_jobs") || "[]")
      let updated: string[] = []
      if (isSaved) {
        updated = saved.filter((id) => id !== jobId)
        setIsSaved(false)
        toast.success("Job Removed from Bookmarks")
      } else {
        updated = [...saved, jobId]
        setIsSaved(true)
        toast.success("Job Bookmarked!")
      }
      localStorage.setItem("hireloop_saved_jobs", JSON.stringify(updated))
    } catch {
      setIsSaved(!isSaved)
    }
  }

  // Fetch real job details from backend
  React.useEffect(() => {
    async function fetchJob() {
      if (!jobId) return
      setIsLoading(true)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
        const res = await fetch(`${apiUrl}/jobs/${jobId}`)
        if (res.ok) {
          const data = await res.json()
          if (data && (data._id || data.id)) {
            setJob({
              id: data._id || data.id,
              title: data.title,
              company: data.company,
              location: data.location || (data.isRemote ? "Remote" : "On-site"),
              salary: data.compensation || "$140k – $180k",
              type: data.type || "Full-time",
              experience: "3+ Years",
              initial: (data.company?.[0] || "C").toUpperCase(),
              logoColor: "from-blue-600 to-indigo-600",
              verified: true,
              description: data.responsibilities || data.description || "Exciting tech role.",
              responsibilities: data.responsibilities ? data.responsibilities.split("\n") : [],
              requirements: data.requirements ? data.requirements.split("\n") : [],
              skills: ["React", "TypeScript", "System Thinking", "Design Systems"],
              benefits: [
                "Full Health & Dental",
                "Competitive 401k",
                "Latest Hardware Stipend",
                "Unlimited PTO",
              ],
              companySize: "100 - 250 Employees",
              industry: data.category || "Technology",
              website: "https://cloudscale.ai",
            })
          }
        }
      } catch (err) {
        console.warn("Could not load job:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchJob()
  }, [jobId])

  const handleApplyClick = () => {
    // 1. Must be authenticated
    if (!user) {
      toast.error("Sign In Required", {
        description: "Please sign in to your Job Seeker account to apply for this job.",
      })
      router.push(`/sign-in?callbackUrl=/jobs/${jobId}`)
      return
    }

    // 2. Strict Role Check: Only Seekers can apply
    if (userRole !== "seeker") {
      toast.error("Seeker Account Required", {
        description: `Only Job Seekers can apply for jobs. Your current account role is "${userRole}".`,
      })
      return
    }

    // 3. Already applied check
    if (hasAlreadyApplied) {
      toast.info("Application Already Submitted", {
        description: "You have already applied for this job. Track its progress in your Seeker Dashboard.",
      })
      return
    }

    setIsApplyModalOpen(true)
  }

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!job) return

    // 1. Authenticated check
    if (!user) {
      toast.error("Please sign in to apply.")
      router.push(`/sign-in?callbackUrl=/jobs/${jobId}`)
      return
    }

    // 2. Role check
    if (userRole !== "seeker") {
      toast.error(`Only Job Seekers can apply. Your account role is "${userRole}".`)
      return
    }

    setIsSubmitting(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
      const res = await fetch(`${apiUrl}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          fullName: applyFormData.fullName.trim() || user.name || "Candidate",
          email: user.email.toLowerCase(),
          phoneNumber: applyFormData.phoneNumber.trim(),
          portfolioUrl: applyFormData.portfolioUrl.trim(),
          linkedinUrl: applyFormData.linkedinUrl.trim(),
          note: applyFormData.note.trim(),
          userId: user.id,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application.")
      }

      setHasAlreadyApplied(true)
      setIsApplyModalOpen(false)
      toast.success("Application Submitted Successfully!", {
        description: `Your application is now linked with Job ID: ${job.id} and your Seeker profile.`,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit application. Please try again."
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#07080b] text-white">
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#665df5]" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col bg-[#07080b] text-white">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-4">
          <h2 className="text-2xl font-bold">Job Listing Not Found</h2>
          <p className="text-sm text-zinc-400">The job you are looking for does not exist or has been removed.</p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 rounded-lg bg-[#665df5] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5548e0]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Browse Jobs
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#07080b] text-white">
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Breadcrumb Ribbon */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Link
            href="/jobs"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to Browse Jobs</span>
          </Link>
          <span>/</span>
          <span className="text-zinc-200">{job.company}</span>
          <span>/</span>
          <span className="text-white font-medium">{job.title}</span>
        </div>

        {/* 1. Header Banner Card (Figma Screenshot 2) */}
        <section className="rounded-2xl border border-white/10 bg-[#0c0d12] p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Square Logo / Badge */}
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${
                job.logoColor || "from-blue-600 to-indigo-600"
              } border border-white/15 text-white font-bold text-2xl shadow-lg`}
            >
              {job.initial}
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                {job.title}
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-zinc-300">{job.company}</span>
                <span className="text-zinc-600">•</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Verified Employer</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSaveJob}
              title={isSaved ? "Remove Bookmark" : "Save Job"}
              className={`rounded-xl border border-white/10 p-2.5 transition-colors ${
                isSaved
                  ? "bg-[#665df5]/15 text-[#818cf8] border-[#665df5]/40"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            </button>
          </div>
        </section>

        {/* 2. Bento Info Grid: 4 Stat Cards (Figma Screenshot 2) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Salary Range */}
          <div className="rounded-2xl border border-white/10 bg-[#0c0d12] p-5 shadow-lg">
            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-2">
              <CreditCard className="h-4 w-4 text-[#818cf8]" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                SALARY RANGE
              </span>
            </div>
            <div className="text-lg font-bold text-white tracking-tight">{job.salary}</div>
          </div>

          {/* Card 2: Location */}
          <div className="rounded-2xl border border-white/10 bg-[#0c0d12] p-5 shadow-lg">
            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-2">
              <MapPin className="h-4 w-4 text-[#818cf8]" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                LOCATION
              </span>
            </div>
            <div className="text-lg font-bold text-white tracking-tight">{job.location}</div>
          </div>

          {/* Card 3: Job Type */}
          <div className="rounded-2xl border border-white/10 bg-[#0c0d12] p-5 shadow-lg">
            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-2">
              <Clock className="h-4 w-4 text-[#818cf8]" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                JOB TYPE
              </span>
            </div>
            <div className="text-lg font-bold text-white tracking-tight">{job.type}</div>
          </div>

          {/* Card 4: Experience */}
          <div className="rounded-2xl border border-white/10 bg-[#0c0d12] p-5 shadow-lg">
            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-2">
              <TrendingUp className="h-4 w-4 text-[#818cf8]" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                EXPERIENCE
              </span>
            </div>
            <div className="text-lg font-bold text-white tracking-tight">{job.experience || "5+ Years"}</div>
          </div>
        </section>

        {/* 3. Main Content Two-Column Layout (Figma Screenshot 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column (65% width): Content Sections */}
          <article className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#0c0d12] p-8 shadow-2xl space-y-8">
            {/* Section: Job Description */}
            <div className="space-y-3">
              <h2 className="text-base font-bold text-white tracking-tight">Job Description</h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                {job.description ||
                  "At CloudScale AI, we are building the next generation of infrastructure monitoring tools. We are looking for a Senior Product Designer who is passionate about translating complex technical workflows into elegant, intuitive interfaces. You will be a key member of our design team, working closely with engineering and product leadership to define the vision for our core platform experience."}
              </p>
            </div>

            <hr className="border-white/5" />

            {/* Section: Responsibilities */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white tracking-tight">Responsibilities</h2>
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-300">
                {(job.responsibilities && job.responsibilities.length > 0
                  ? job.responsibilities
                  : [
                      "Lead the end-to-end design process for major platform features, from discovery to high-fidelity implementation.",
                      "Collaborate with cross-functional partners to understand user needs and translate them into functional design requirements.",
                      "Maintain and evolve our design system, ensuring consistency and accessibility across the entire product suite.",
                      "Conduct user research and usability testing to validate design decisions and iterate based on feedback.",
                    ]
                ).map((resp, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#818cf8] mt-2 shrink-0" />
                    <span className="leading-relaxed">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="border-white/5" />

            {/* Section: Requirements */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white tracking-tight">Requirements</h2>

              {/* Requirement Skills Badges (Figma Screenshot 2) */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: "Figma Expertise", icon: "<>" },
                  { label: "System Thinking", icon: "⚡" },
                  { label: "UI/UX Design", icon: "✏️" },
                  { label: "Basic Frontend", icon: "💻" },
                ].map((sk) => (
                  <span
                    key={sk.label}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-zinc-300"
                  >
                    <span className="font-mono text-[11px] text-[#818cf8]">{sk.icon}</span>
                    <span>{sk.label}</span>
                  </span>
                ))}
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-zinc-300 pt-2">
                {(job.requirements && job.requirements.length > 0
                  ? job.requirements
                  : [
                      "5+ years of experience designing complex B2B SaaS products or data-heavy applications.",
                      "A strong portfolio showcasing your design process and problem-solving skills.",
                    ]
                ).map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#818cf8] mt-2 shrink-0" />
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="border-white/5" />

            {/* Section: Benefits (Figma Screenshot 2) */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white tracking-tight">Benefits</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { title: "Full Health & Dental", icon: HeartPulse },
                  { title: "Competitive 401k", icon: DollarSign },
                  { title: "Latest Hardware Stipend", icon: Laptop },
                  { title: "Unlimited PTO", icon: Palmtree },
                ].map((b) => {
                  const Icon = b.icon
                  return (
                    <div
                      key={b.title}
                      className="flex items-center gap-3.5 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs font-semibold text-white shadow-xs"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-[#818cf8]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span>{b.title}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <hr className="border-white/5" />

            {/* Bottom Apply Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Interested in this role?
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Submit your candidate application directly to {job.company}.
                </p>
                {!user ? (
                  <p className="text-[11px] text-zinc-500 font-mono mt-1">
                    * Sign-in required: Only authenticated Job Seekers can apply.
                  </p>
                ) : userRole !== "seeker" ? (
                  <p className="text-[11px] text-amber-400 font-mono mt-1">
                    * Signed in as <span className="capitalize font-semibold">{userRole}</span>. Recruiters and Admins cannot apply.
                  </p>
                ) : hasAlreadyApplied ? (
                  <p className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    You have already applied for this role.
                  </p>
                ) : (
                  <p className="text-[11px] text-emerald-400/90 font-mono mt-1">
                    ✓ Verified Seeker ({user.email}). Ready to submit!
                  </p>
                )}
              </div>

              {hasAlreadyApplied ? (
                <Button
                  disabled
                  className="h-11 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-xs px-8 cursor-not-allowed"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" />
                  Application Submitted
                </Button>
              ) : (
                <Button
                  onClick={handleApplyClick}
                  disabled={user && userRole !== "seeker"}
                  className={`h-11 rounded-xl font-bold text-xs px-8 shadow-xl transition-all ${
                    user && userRole !== "seeker"
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60"
                      : "bg-white text-zinc-950 hover:bg-zinc-100 shadow-white/10 active:scale-95 cursor-pointer"
                  }`}
                >
                  {!user ? "Sign In to Apply" : userRole !== "seeker" ? "Only Seekers Can Apply" : "Apply Now"}
                </Button>
              )}
            </div>
          </article>

          {/* Right Column (35% width): Company Overview Card (Figma Screenshot 2) */}
          <aside className="lg:col-span-1 rounded-2xl border border-white/10 bg-[#0c0d12] p-6 shadow-2xl space-y-6">
            <h2 className="text-base font-bold text-white tracking-tight">Company Overview</h2>

            {/* Image Banner Container (Computer / Workspace Monitor) */}
            <div className="relative h-44 w-full rounded-xl overflow-hidden border border-white/10 bg-zinc-900 group">
              <img
                src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80"
                alt="Workspace Monitor"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-transparent to-transparent opacity-80" />
            </div>

            {/* Company Metadata Info Rows */}
            <div className="space-y-4 border-t border-white/5 pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  SIZE
                </span>
                <span className="font-semibold text-zinc-200">
                  {job.companySize || "250 - 500 Employees"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  INDUSTRY
                </span>
                <span className="font-semibold text-zinc-200">
                  {job.industry || "SaaS / Artificial Intelligence"}
                </span>
              </div>
            </div>

            {/* Visit Website CTA */}
            <a
              href={job.website || "https://cloudscale.ai"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full h-10 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.08] transition-colors shadow-sm"
            >
              <span>Visit Website</span>
              <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
            </a>
          </aside>
        </div>
      </main>

      {/* Apply Modal Confirmation Dialog */}
      <AlertDialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <AlertDialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-mono text-[#818cf8] border border-indigo-500/20">
                Job ID: {job.id}
              </span>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                Seeker Verified
              </span>
            </div>
            <AlertDialogTitle>Apply for {job.title}</AlertDialogTitle>
            <AlertDialogDescription>
              Submit your candidate application directly to <span className="text-white font-medium">{job.company}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleApplySubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Your Full Name</label>
              <input
                type="text"
                required
                placeholder="Your full name"
                value={applyFormData.fullName}
                onChange={(e) =>
                  setApplyFormData({ ...applyFormData, fullName: e.target.value })
                }
                className="w-full h-9 rounded-xl border border-white/10 bg-[#161720] px-3 text-xs text-white focus:outline-none focus:border-[#665df5]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-300">Email Address</label>
                <span className="text-[10px] text-zinc-500 font-mono">Linked to Seeker Account</span>
              </div>
              <input
                type="email"
                required
                readOnly
                value={user?.email || applyFormData.email}
                className="w-full h-9 rounded-xl border border-white/10 bg-[#161720]/60 px-3 text-xs text-zinc-300 font-mono cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 234-5678"
                value={applyFormData.phoneNumber}
                onChange={(e) =>
                  setApplyFormData({ ...applyFormData, phoneNumber: e.target.value })
                }
                className="w-full h-9 rounded-xl border border-white/10 bg-[#161720] px-3 text-xs text-white focus:outline-none focus:border-[#665df5]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Portfolio URL</label>
              <input
                type="url"
                required
                placeholder="https://portfolio.example.com"
                value={applyFormData.portfolioUrl}
                onChange={(e) =>
                  setApplyFormData({ ...applyFormData, portfolioUrl: e.target.value })
                }
                className="w-full h-9 rounded-xl border border-white/10 bg-[#161720] px-3 text-xs text-white focus:outline-none focus:border-[#665df5]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">LinkedIn URL</label>
              <input
                type="url"
                required
                placeholder="https://linkedin.com/in/username"
                value={applyFormData.linkedinUrl}
                onChange={(e) =>
                  setApplyFormData({ ...applyFormData, linkedinUrl: e.target.value })
                }
                className="w-full h-9 rounded-xl border border-white/10 bg-[#161720] px-3 text-xs text-white focus:outline-none focus:border-[#665df5]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Brief Note for the Hiring Team</label>
              <textarea
                rows={3}
                value={applyFormData.note}
                onChange={(e) =>
                  setApplyFormData({ ...applyFormData, note: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-[#161720] p-3 text-xs text-white focus:outline-none focus:border-[#665df5]"
              />
            </div>

            <AlertDialogFooter className="pt-2">
              <AlertDialogCancel type="button" onClick={() => setIsApplyModalOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-9 px-5 rounded-xl bg-[#665df5] hover:bg-[#5345f0] text-xs font-bold text-white shadow-md shadow-indigo-600/30"
              >
                {isSubmitting ? "Submitting..." : "Send Application"}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* FOOTER */}
      <Footer />
    </div>
  )
}
