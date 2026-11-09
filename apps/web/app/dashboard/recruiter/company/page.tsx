"use client"

import * as React from "react"
import {
  Building2,
  CheckCircle2,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Save,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { toast } from "@workspace/ui/components/sonner"
import { useSession } from "@/lib/auth-client"

export default function RecruiterCompanyPage() {
  const { data: session } = useSession()
  const [isSaving, setIsSaving] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [companyData, setCompanyData] = React.useState({
    name: "HirePulse Labs",
    website: "https://hirepulse.io",
    industry: "Software & Cloud Infrastructure",
    size: "50 - 500 Employees",
    headquarters: "London, United Kingdom",
    founded: "2021",
    tagline: "Building scalable developer infrastructure and distributed workflow systems.",
    about:
      "HirePulse Labs is a fast-growing engineering collective delivering modern tools for high-performing engineering organizations worldwide. We prioritize craftsmanship, open-source contribution, and high autonomy.",
    brandColor: "#665df5",
  })

  // Load recruiter's company profile from backend
  React.useEffect(() => {
    async function loadCompanyProfile() {
      const email = session?.user?.email
      const userId = (session?.user as any)?.id

      if (!email && !userId) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
        const q = new URLSearchParams()
        if (email) q.set("recruiterEmail", email)
        if (userId) q.set("recruiterId", userId)

        const res = await fetch(`${apiUrl}/companies/profile?${q.toString()}`)
        if (res.ok) {
          const data = await res.json()
          if (data && data.name) {
            setCompanyData({
              name: data.name || "HirePulse Labs",
              website: data.website || "https://hirepulse.io",
              industry: data.industry || "Software & Cloud Infrastructure",
              size: data.size || "50 - 500 Employees",
              headquarters: data.headquarters || "London, United Kingdom",
              founded: data.founded || "2021",
              tagline: data.tagline || "Building scalable developer infrastructure and distributed workflow systems.",
              about: data.about || "We prioritize craftsmanship, open-source contribution, and high autonomy.",
              brandColor: data.brandColor || "#665df5",
            })
          } else if (session?.user?.name) {
            // Default company name based on user name
            setCompanyData((prev) => ({
              ...prev,
              name: `${session.user.name}'s Organization`,
            }))
          }
        }
      } catch (err) {
        console.warn("Could not load company profile:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadCompanyProfile()
  }, [session])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyData.name.trim()) {
      toast.error("Company name is required.")
      return
    }

    setIsSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
      const res = await fetch(`${apiUrl}/companies/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...companyData,
          recruiterEmail: session?.user?.email || "",
          recruiterId: (session?.user as any)?.id || "",
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to save company profile.")
      }

      toast.success("Company Profile Saved!", {
        description: `"${companyData.name}" has been updated in database and synced across HireLoop.`,
      })
    } catch (err: any) {
      toast.error(err?.message || "Failed to save company profile.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-white font-medium">Company Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Company Profile & Branding
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Showcase your company culture, verified details, and workplace benefits to attract top candidates.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          variant="brand"
          className="h-10 gap-2 rounded-xl px-5 text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </>
          )}
        </Button>
      </div>

      {/* Main Tabs Container using Shadcn Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-white/[0.03] border border-white/5">
          <TabsTrigger value="general">Overview & Details</TabsTrigger>
          <TabsTrigger value="branding">Brand Assets</TabsTrigger>
          <TabsTrigger value="team">Hiring Team</TabsTrigger>
        </TabsList>

        {/* Tab 1: General Information */}
        <TabsContent value="general" className="space-y-6 pt-2">
          <Card className="border-white/5 bg-[#0c0d12]">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold text-white">Organization Details</CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Primary public information displayed on all your job listings.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companyData.name}
                    onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                    className="h-10 rounded-xl border-white/10 bg-[#161720] text-xs text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Official Website</Label>
                  <Input
                    id="website"
                    value={companyData.website}
                    onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                    className="h-10 rounded-xl border-white/10 bg-[#161720] text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry Category</Label>
                  <Input
                    id="industry"
                    value={companyData.industry}
                    onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                    className="h-10 rounded-xl border-white/10 bg-[#161720] text-xs text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Team Size</Label>
                  <Input
                    id="size"
                    value={companyData.size}
                    onChange={(e) => setCompanyData({ ...companyData, size: e.target.value })}
                    className="h-10 rounded-xl border-white/10 bg-[#161720] text-xs text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headquarters">Headquarters</Label>
                  <Input
                    id="headquarters"
                    value={companyData.headquarters}
                    onChange={(e) => setCompanyData({ ...companyData, headquarters: e.target.value })}
                    className="h-10 rounded-xl border-white/10 bg-[#161720] text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Company Tagline</Label>
                <Input
                  id="tagline"
                  value={companyData.tagline}
                  onChange={(e) => setCompanyData({ ...companyData, tagline: e.target.value })}
                  className="h-10 rounded-xl border-white/10 bg-[#161720] text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About the Organization</Label>
                <textarea
                  id="about"
                  rows={4}
                  value={companyData.about}
                  onChange={(e) => setCompanyData({ ...companyData, about: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#161720] p-3 text-xs text-white focus:outline-none focus:border-[#665df5] leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Brand Assets */}
        <TabsContent value="branding" className="space-y-6 pt-2">
          <Card className="border-white/5 bg-[#0c0d12]">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold text-white">Visual Identity & Assets</CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Logos, banners, and color accents displayed on candidate views.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-6">
                <div
                  style={{ backgroundColor: `${companyData.brandColor}25`, borderColor: `${companyData.brandColor}60` }}
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border text-white font-extrabold text-2xl shadow-lg"
                >
                  {(companyData.name?.[0] || "C").toUpperCase()}
                </div>
                <div className="space-y-1.5">
                  <Label>Company Icon / Logo</Label>
                  <p className="text-[11px] text-zinc-400">Square PNG or SVG, minimum 200x200px.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("Logo upload will be saved with company profile.")}
                    className="h-8 rounded-lg border-white/10 text-xs text-zinc-300"
                  >
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                    Upload New Logo
                  </Button>
                </div>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-5">
                <Label>Brand Accent Color</Label>
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: companyData.brandColor }}
                    className="h-8 w-8 rounded-lg border border-white/20 shadow-md"
                  />
                  <Input
                    value={companyData.brandColor}
                    onChange={(e) => setCompanyData({ ...companyData, brandColor: e.target.value })}
                    className="h-9 w-32 rounded-xl border-white/10 bg-[#161720] text-xs font-mono text-white"
                  />
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {companyData.name} Brand Color
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Hiring Team */}
        <TabsContent value="team" className="space-y-6 pt-2">
          <Card className="border-white/5 bg-[#0c0d12]">
            <CardHeader className="border-b border-white/5 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-white">Recruitment Members</CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  Colleagues authorized to create listings and evaluate candidate submissions.
                </CardDescription>
              </div>
              <Button
                type="button"
                onClick={() => toast.info("Team member invitation sent to email.")}
                size="sm"
                variant="brand"
                className="h-8 text-xs font-semibold rounded-lg"
              >
                + Invite Colleague
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5 text-xs">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={session?.user?.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"}
                      alt={session?.user?.name || "Recruiter"}
                      className="h-8 w-8 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <div className="font-semibold text-white">
                        {session?.user?.name || "Recruiter Lead"} (You)
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono">
                        {session?.user?.email || "recruiter@hireloop.io"}
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                    Primary Recruiter
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
