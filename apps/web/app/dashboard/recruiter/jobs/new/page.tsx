"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Eye,
  Globe,
  Loader2,
  MapPin,
  Plus,
  Send,
  Sparkles,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { toast } from "@workspace/ui/components/sonner"
import { useSession } from "@/lib/auth-client"

export default function PostNewJobPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isPublishing, setIsPublishing] = React.useState(false)

  // Form State (Matching Figma exact post job specifications)
  const [formData, setFormData] = React.useState({
    title: "Senior Full-Stack Engineer",
    company: "HirePulse Network",
    category: "Engineering & Tech",
    jobType: "Full-time",
    isRemote: true,
    location: "Remote (New York, USA)",
    deadline: "2025-05-30",
    minSalary: "25",
    maxSalary: "40",
    salaryFrequency: "per hour",
    responsibilities:
      "Showcase your commitment to delivering exceptional user interfaces and digital experiences. You will collaborate directly with systems designers and backend engineers to craft responsive, micro-interaction rich products.",
    requirements:
      "• 3+ years of experience with React, TypeScript, and modern state architectures\n• Solid understanding of DOM performance and component-driven designs\n• Experience partnering closely with product teams and UI/UX designers",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.company || !formData.location) {
      toast.error("Please fill in all required fields", {
        description: "Title, Company name, and Location are mandatory.",
      })
      return
    }

    setIsPublishing(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
      const res = await fetch(`${apiUrl}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          company: formData.company,
          category: formData.category,
          type: formData.jobType,
          isRemote: formData.isRemote,
          location: formData.location,
          deadline: formData.deadline,
          compensation: formattedSalary,
          responsibilities: formData.responsibilities,
          requirements: formData.requirements,
          status: "Active",
          postedTime: "Just now",
          // Recruiter identity — used for filtering applicants
          recruiterId: (session?.user as any)?.id || session?.user?.email || "",
          recruiterEmail: session?.user?.email || "",
          postedBy: session?.user?.email || "",
        }),
      })

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`)
      }

      toast.success("Job Post Published!", {
        description: `"${formData.title}" is saved in database and accepting candidate applications.`,
      })
      router.push("/dashboard/recruiter/jobs")
    } catch (err) {
      console.error("Job submit error:", err)
      toast.error("Failed to publish job post", {
        description: "Could not connect to the backend server. Please verify the server is running.",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  const formattedSalary = formData.minSalary && formData.maxSalary
    ? `$${formData.minSalary} – $${formData.maxSalary} / ${formData.salaryFrequency === "per hour" ? "hr" : "yr"}`
    : "Competitive Compensation"

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Page Meta Ribbon (Figma Exact) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
            <Link
              href="/dashboard/recruiter/jobs"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Job Listings</span>
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Create New Listing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Post a New Job
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Fill in the position specifications to attract qualified talent across our network.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/recruiter/jobs">
            <Button
              variant="outline"
              className="h-9 rounded-xl border-white/10 bg-white/[0.02] text-xs text-zinc-300 hover:text-white"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Layout (Form 60% + Live Preview 40%) - Figma Exact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Configuration Panels (60% ~ col-span-7) */}
        <form onSubmit={handlePublish} className="lg:col-span-7 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-6 space-y-5">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#665df5]/20 text-[#a5b4fc] text-[11px] font-mono">
                  1
                </span>
                <span>Basic Information</span>
              </h2>
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Job Title <span className="text-rose-400">*</span>
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Engineer"
                required
                className="h-10 rounded-xl border-white/10 bg-white/[0.02] text-xs text-white placeholder:text-zinc-600 focus:border-[#665df5]"
              />
            </div>

            {/* Company Name & Job Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Company Name <span className="text-rose-400">*</span>
                </label>
                <Input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. HirePulse Labs"
                  required
                  className="h-10 rounded-xl border-white/10 bg-white/[0.02] text-xs text-white placeholder:text-zinc-600 focus:border-[#665df5]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Job Category <span className="text-rose-400">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="h-10 w-full rounded-xl border border-white/10 bg-[#161720] px-3 text-xs text-white focus:outline-none focus:border-[#665df5]"
                >
                  <option value="Engineering & Tech">Engineering & Tech</option>
                  <option value="Design & Creative">Design & Creative</option>
                  <option value="Product & Strategy">Product & Strategy</option>
                  <option value="Marketing & Sales">Marketing & Sales</option>
                  <option value="Finance & Operations">Finance & Operations</option>
                </select>
              </div>
            </div>

            {/* Job Type (Full-time, Part-time, Contract, Internship) */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-2">
                Job Type <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Full-time", "Part-time", "Contract", "Internship"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, jobType: type }))}
                    className={`h-9 rounded-xl border text-xs font-medium transition-all ${
                      formData.jobType === type
                        ? "border-[#665df5] bg-[#665df5]/15 text-[#a5b4fc]"
                        : "border-white/5 bg-white/[0.02] text-zinc-400 hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Location, Compensation & Timeline */}
          <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-6 space-y-5">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#665df5]/20 text-[#a5b4fc] text-[11px] font-mono">
                  2
                </span>
                <span>Location, Compensation & Timeline</span>
              </h2>
            </div>

            {/* Remote Work Allowed Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
              <div>
                <div className="text-xs font-semibold text-white">Remote Work Allowed (isRemote)</div>
                <div className="text-[11px] text-zinc-400">
                  Enable worldwide or distributed candidate applications
                </div>
              </div>
              <input
                type="checkbox"
                name="isRemote"
                checked={formData.isRemote}
                onChange={handleChange}
                className="h-4 w-4 rounded border-white/10 bg-[#161720] text-[#665df5] focus:ring-[#665df5]"
              />
            </div>

            {/* Job Location & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Job Location (location) <span className="text-rose-400">*</span>
                </label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Remote (New York, USA)"
                  required
                  className="h-10 rounded-xl border-white/10 bg-white/[0.02] text-xs text-white placeholder:text-zinc-600 focus:border-[#665df5]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Application Deadline (deadline)
                </label>
                <Input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="h-10 rounded-xl border-white/10 bg-[#161720] text-xs text-white focus:border-[#665df5]"
                />
              </div>
            </div>

            {/* Salary Range (minSalary, maxSalary, frequency) */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Salary Range (minSalary & maxSalary)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Input
                    name="minSalary"
                    value={formData.minSalary}
                    onChange={handleChange}
                    placeholder="Min (e.g. 25)"
                    className="h-10 rounded-xl border-white/10 bg-white/[0.02] text-xs text-white placeholder:text-zinc-600 focus:border-[#665df5]"
                  />
                </div>
                <div>
                  <Input
                    name="maxSalary"
                    value={formData.maxSalary}
                    onChange={handleChange}
                    placeholder="Max (e.g. 40)"
                    className="h-10 rounded-xl border-white/10 bg-white/[0.02] text-xs text-white placeholder:text-zinc-600 focus:border-[#665df5]"
                  />
                </div>
                <div>
                  <select
                    name="salaryFrequency"
                    value={formData.salaryFrequency}
                    onChange={handleChange}
                    className="h-10 w-full rounded-xl border border-white/10 bg-[#161720] px-3 text-xs text-white focus:outline-none focus:border-[#665df5]"
                  >
                    <option value="per hour">per hour</option>
                    <option value="per year">per year</option>
                    <option value="per month">per month</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Responsibilities & Requirements */}
          <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-6 space-y-5">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#665df5]/20 text-[#a5b4fc] text-[11px] font-mono">
                  3
                </span>
                <span>Responsibilities & Requirements</span>
              </h2>
            </div>

            {/* Key Responsibilities */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Key Responsibilities <span className="text-rose-400">*</span>
              </label>
              <textarea
                name="responsibilities"
                rows={4}
                value={formData.responsibilities}
                onChange={handleChange}
                placeholder="Outline the core responsibilities for this role..."
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#665df5] leading-relaxed"
              />
            </div>

            {/* Qualifications & Requirements */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Qualifications & Requirements <span className="text-rose-400">*</span>
              </label>
              <textarea
                name="requirements"
                rows={4}
                value={formData.requirements}
                onChange={handleChange}
                placeholder="List skills, technologies, and years of experience..."
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#665df5] leading-relaxed font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Bottom Form Actions (Publish Job Button at Bottom) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-white/5 bg-[#0c0d12] p-5 shadow-xl">
            <div className="text-xs text-zinc-400">
              Ready to post? Candidate applications will be routed directly to your pipeline.
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Link href="/dashboard/recruiter/jobs">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl border-white/10 bg-white/[0.02] px-4 text-xs font-medium text-zinc-300 hover:text-white"
                >
                  Save Draft
                </Button>
              </Link>

              <Button
                type="submit"
                variant="brand"
                disabled={isPublishing}
                className="h-11 gap-2 rounded-xl px-6 text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Publishing Listing...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Publish Job Listing</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Right Column: Live Candidate Preview (40% ~ col-span-5) - Figma Exact */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <Eye className="h-3.5 w-3.5 text-[#818cf8]" />
              <span>Live Candidate Preview (40%)</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Sync
            </span>
          </div>

          {/* Preview Card Styled to Match Public Job Details in Figma */}
          <div className="rounded-2xl border border-white/10 bg-[#0c0d12] p-6 shadow-2xl space-y-6">
            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="rounded-full bg-[#665df5]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#a5b4fc] border border-[#665df5]/30">
                  {formData.category}
                </span>
                <span className="rounded-full bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-mono text-zinc-300 border border-white/5">
                  {formData.jobType}
                </span>
                {formData.isRemote && (
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                    Remote
                  </span>
                )}
              </div>

              <h3 className="text-xl font-extrabold text-white tracking-tight leading-snug">
                {formData.title || "Job Title Preview"}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                <span className="font-semibold text-zinc-200 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                  {formData.company || "Company Name"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                  {formData.location || "Location"}
                </span>
              </div>
            </div>

            {/* Compensation & Deadline Ribbon */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                  Compensation
                </span>
                <div className="text-sm font-bold text-white font-mono">{formattedSalary}</div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                  Deadline
                </span>
                <div className="text-xs text-zinc-300 font-mono">
                  {formData.deadline || "Open Until Filled"}
                </div>
              </div>
            </div>

            {/* Responsibilities */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono mb-2">
                Role Overview
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {formData.responsibilities || "Position responsibilities will appear here."}
              </p>
            </div>

            {/* Requirements */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono mb-2">
                Key Qualifications
              </h4>
              <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
                {formData.requirements || "Key requirements will appear here."}
              </pre>
            </div>

            {/* Preview Apply CTA */}
            <div className="border-t border-white/5 pt-4">
              <Button
                disabled
                className="w-full h-11 rounded-xl bg-[#665df5] text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 opacity-80 cursor-not-allowed"
              >
                Apply for this Position (Preview)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
