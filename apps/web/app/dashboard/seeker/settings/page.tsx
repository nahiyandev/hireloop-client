"use client"

import * as React from "react"
import {
  Bell,
  Briefcase,
  CheckCircle2,
  FileCheck2,
  FileText,
  Globe,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Save,
  Sparkles,
  Upload,
  User,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { toast } from "@workspace/ui/components/sonner"
import { useSession } from "@/lib/auth-client"

export default function SeekerSettingsPage() {
  const { data: session } = useSession()
  const [isSaving, setIsSaving] = React.useState(false)

  const [profile, setProfile] = React.useState({
    name: session?.user?.name || "Alex Rivera",
    email: session?.user?.email || "alex.rivera@example.com",
    headline: "Senior Frontend Engineer (React, Next.js, TypeScript)",
    location: "San Francisco, CA (Remote)",
    targetSalary: "$150,000 / yr",
    searchStatus: "actively_looking",
    remoteOnly: true,
    matchingJobAlerts: true,
    weeklyDigest: true,
    bio: "Passionate engineer specializing in high-performance React architectures, TypeScript, micro-frontends, and accessible design systems. 6+ years shipping production web applications.",
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 600))
      toast.success("Profile Preferences Saved", {
        description: "Your candidate profile and job alerts have been updated.",
      })
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
            <span className="text-white font-medium">Candidate Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Profile & Career Preferences
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Control your discoverability to top recruiters, resume assets, and salary expectations.
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

      {/* Settings Tabs Container using Shadcn Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-white/[0.03] border border-white/5">
          <TabsTrigger value="profile">Profile & Resume</TabsTrigger>
          <TabsTrigger value="preferences">Job Search Preferences</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Discovery</TabsTrigger>
        </TabsList>

        {/* Tab 1: Profile & Resume */}
        <TabsContent value="profile" className="space-y-6 pt-2">
          <Card className="border-white/5 bg-[#0c0d12]">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold text-white">Public Candidate Profile</CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Visible to verified companies when applying or matching.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="candidateName">Full Name</Label>
                  <Input
                    id="candidateName"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="h-10 rounded-xl border-white/10 bg-[#161720] text-xs text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="candidateEmail">Contact Email</Label>
                  <Input
                    id="candidateEmail"
                    value={profile.email}
                    disabled
                    className="h-10 rounded-xl border-white/10 bg-[#161720] text-xs text-zinc-400 opacity-70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headline">Professional Headline</Label>
                <Input
                  id="headline"
                  value={profile.headline}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  className="h-10 rounded-xl border-white/10 bg-[#161720] text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio & Experience Summary</Label>
                <textarea
                  id="bio"
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#161720] p-3 text-xs text-white focus:outline-none focus:border-[#665df5] leading-relaxed"
                />
              </div>

              {/* Uploaded Resume Card */}
              <div className="space-y-2 border-t border-white/5 pt-5">
                <Label>Verified Resume Document</Label>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        Alex_Rivera_Senior_Frontend_Resume.pdf
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        Uploaded Oct 14, 2024 • 240 KB • Verified
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("Opening resume file...")}
                    className="h-8 gap-1.5 rounded-lg border-white/10 text-xs text-zinc-300"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Replace PDF</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Job Search Preferences */}
        <TabsContent value="preferences" className="space-y-6 pt-2">
          <Card className="border-white/5 bg-[#0c0d12]">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold text-white">Job Search Status & Target</CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Let recruiters know your availability and compensation requirements.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Search Status Radio Cards */}
              <div className="space-y-2">
                <Label>Current Search Status</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: "actively_looking",
                      title: "Actively Looking",
                      desc: "Ready to interview and start new positions",
                    },
                    {
                      id: "open_to_offers",
                      title: "Open to Offers",
                      desc: "Casually browsing high-leverage roles",
                    },
                    {
                      id: "not_looking",
                      title: "Not Looking",
                      desc: "Currently satisfied in existing role",
                    },
                  ].map((st) => (
                    <div
                      key={st.id}
                      onClick={() => setProfile({ ...profile, searchStatus: st.id })}
                      className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                        profile.searchStatus === st.id
                          ? "border-[#665df5] bg-[#665df5]/10 text-white"
                          : "border-white/5 bg-white/[0.02] text-zinc-400 hover:border-white/15"
                      }`}
                    >
                      <div className="text-xs font-semibold text-white">{st.title}</div>
                      <div className="mt-1 text-[11px] text-zinc-400 leading-snug">{st.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Compensation & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary">Minimum Desired Salary</Label>
                  <Input
                    id="salary"
                    value={profile.targetSalary}
                    onChange={(e) => setProfile({ ...profile, targetSalary: e.target.value })}
                    className="h-10 rounded-xl border-white/10 bg-[#161720] text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="locPref">Preferred Work Location</Label>
                  <Input
                    id="locPref"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="h-10 rounded-xl border-white/10 bg-[#161720] text-xs text-white"
                  />
                </div>
              </div>

              {/* Remote Only Switch */}
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-white">Remote Roles Only</div>
                  <div className="text-[11px] text-zinc-400">
                    Only receive match recommendations offering worldwide or remote distribution.
                  </div>
                </div>
                <Switch
                  checked={profile.remoteOnly}
                  onCheckedChange={(checked) => setProfile({ ...profile, remoteOnly: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Alerts */}
        <TabsContent value="alerts" className="space-y-6 pt-2">
          <Card className="border-white/5 bg-[#0c0d12]">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold text-white">Notification Preferences</CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Choose when HireLoop contacts you about relevant opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-white">
                    Instant Job Match Alerts
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Get an email as soon as a verified role matches your skills and target salary.
                  </div>
                </div>
                <Switch
                  checked={profile.matchingJobAlerts}
                  onCheckedChange={(checked) =>
                    setProfile({ ...profile, matchingJobAlerts: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-white">Weekly Career Digest</div>
                  <div className="text-[11px] text-zinc-400">
                    Curated weekly summary of top compensation roles and hiring velocity.
                  </div>
                </div>
                <Switch
                  checked={profile.weeklyDigest}
                  onCheckedChange={(checked) =>
                    setProfile({ ...profile, weeklyDigest: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
