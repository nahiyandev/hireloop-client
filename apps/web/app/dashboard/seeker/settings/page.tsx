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
  X,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { toast } from "@workspace/ui/components/sonner"
import { useSession } from "@/lib/auth-client"

interface UserResume {
  fileName: string
  fileSize: string
  uploadedAt: string
}

export default function SeekerSettingsPage() {
  const { data: session } = useSession()
  const user = session?.user
  const userEmail = user?.email || ""
  const userName = user?.name || ""

  const [isSaving, setIsSaving] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const [profile, setProfile] = React.useState({
    name: userName,
    email: userEmail,
    headline: "",
    location: "",
    targetSalary: "",
    searchStatus: "actively_looking",
    remoteOnly: true,
    matchingJobAlerts: true,
    weeklyDigest: true,
    bio: "",
  })

  const [resume, setResume] = React.useState<UserResume | null>(null)

  // Load user profile and resume preferences scoped to current user
  React.useEffect(() => {
    if (!userEmail) return

    try {
      const storageKey = `hireloop_seeker_profile_${userEmail}`
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        setProfile((prev) => ({
          ...prev,
          ...parsed,
          name: parsed.name || userName,
          email: userEmail,
        }))
        if (parsed.resume) {
          setResume(parsed.resume)
        }
      } else {
        setProfile((prev) => ({
          ...prev,
          name: userName,
          email: userEmail,
        }))
      }
    } catch {
      // ignore
    }
  }, [userEmail, userName])

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const newResume: UserResume = {
      fileName: file.name,
      fileSize: `${Math.round(file.size / 1024)} KB`,
      uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }

    setResume(newResume)
    toast.success("Resume Attached", {
      description: `"${file.name}" ready to save with profile.`,
    })
  }

  const handleRemoveResume = () => {
    setResume(null)
    toast.info("Resume Removed")
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      if (userEmail) {
        const payload = { ...profile, resume }
        localStorage.setItem(`hireloop_seeker_profile_${userEmail}`, JSON.stringify(payload))
      }
      await new Promise((r) => setTimeout(r, 400))
      toast.success("Profile Preferences Saved", {
        description: "Your candidate profile and career preferences have been updated.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleResumeUpload}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />

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
            Control your discoverability to hiring companies, resume assets, and salary expectations.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          variant="brand"
          className="h-10 gap-2 rounded-xl px-5 text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-60 cursor-pointer"
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

      {/* Settings Tabs Container */}
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
                Visible to verified companies when reviewing your job applications.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="candidateName">Full Name</Label>
                  <Input
                    id="candidateName"
                    value={profile.name}
                    placeholder="Your Full Name"
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="h-10 rounded-xl border-white/10 bg-[#161720] text-xs text-white placeholder-zinc-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="candidateEmail">Contact Email</Label>
                  <Input
                    id="candidateEmail"
                    value={profile.email}
                    disabled
                    placeholder="your.email@example.com"
                    className="h-10 rounded-xl border-white/10 bg-[#161720] text-xs text-zinc-400 opacity-70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headline">Professional Headline</Label>
                <Input
                  id="headline"
                  value={profile.headline}
                  placeholder="e.g. Senior Frontend Engineer (React, Next.js, TypeScript)"
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  className="h-10 rounded-xl border-white/10 bg-[#161720] text-xs text-white placeholder-zinc-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio & Experience Summary</Label>
                <textarea
                  id="bio"
                  rows={4}
                  value={profile.bio}
                  placeholder="Describe your technical background, accomplishments, and career interests..."
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#161720] p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#665df5] leading-relaxed"
                />
              </div>

              {/* Uploaded Resume Card */}
              <div className="space-y-2 border-t border-white/5 pt-5">
                <Label>Verified Resume Document</Label>
                {resume ? (
                  <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <FileCheck2 className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {resume.fileName}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          Uploaded {resume.uploadedAt} • {resume.fileSize} • Attached
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-8 gap-1.5 rounded-lg border-white/10 text-xs text-zinc-300 hover:text-white cursor-pointer"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>Replace</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={handleRemoveResume}
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-rose-400 cursor-pointer"
                        title="Remove resume"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-between rounded-xl border border-dashed border-white/10 bg-white/[0.01] p-4 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-zinc-400 border border-white/10">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          No resume document uploaded yet
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          Upload PDF or Word format (up to 5MB) to share with employers.
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 gap-1.5 rounded-lg border-white/15 bg-white/5 text-xs text-white hover:bg-white/10 cursor-pointer shrink-0"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Resume</span>
                    </Button>
                  </div>
                )}
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
                Let recruiters know your availability and compensation expectations.
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
                    placeholder="e.g. $120,000 / yr"
                    onChange={(e) => setProfile({ ...profile, targetSalary: e.target.value })}
                    className="h-10 rounded-xl border-white/10 bg-[#161720] text-xs text-white font-mono placeholder-zinc-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="locPref">Preferred Work Location</Label>
                  <Input
                    id="locPref"
                    value={profile.location}
                    placeholder="e.g. Remote, San Francisco, CA"
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="h-10 rounded-xl border-white/10 bg-[#161720] text-xs text-white placeholder-zinc-500"
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
                    Get notified when a verified role matches your preferences.
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
                    Curated weekly summary of top opportunities and hiring trends.
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
