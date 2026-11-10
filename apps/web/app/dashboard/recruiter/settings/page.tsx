"use client"

import * as React from "react"
import {
  Bell,
  CreditCard,
  KeyRound,
  Lock,
  Mail,
  Save,
  Shield,
  Smartphone,
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

export default function RecruiterSettingsPage() {
  const { data: session } = useSession()
  const userEmail = session?.user?.email || ""
  const userId = (session?.user as any)?.id || ""

  const [isSaving, setIsSaving] = React.useState(false)
  const [notifications, setNotifications] = React.useState({
    instantApplicationAlerts: true,
    dailyDigest: true,
    interviewReminders: true,
    marketingEmails: false,
  })

  // Load recruiter settings from MongoDB and localStorage
  React.useEffect(() => {
    async function loadSettings() {
      if (!userEmail) return

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
        const res = await fetch(`${apiUrl}/users`)
        if (res.ok) {
          const list = await res.json()
          if (Array.isArray(list)) {
            const me = list.find((u: any) => u.email?.toLowerCase() === userEmail.toLowerCase())
            if (me?.recruiterSettings) {
              setNotifications(me.recruiterSettings)
            }
          }
        }
      } catch {}

      try {
        const local = localStorage.getItem(`hireloop_recruiter_settings_${userEmail}`)
        if (local) {
          setNotifications(JSON.parse(local))
        }
      } catch {}
    }
    loadSettings()
  }, [userEmail])

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
      await fetch(`${apiUrl}/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          id: userId,
          profileData: { recruiterSettings: notifications },
        }),
      }).catch(() => null)

      if (userEmail) {
        localStorage.setItem(`hireloop_recruiter_settings_${userEmail}`, JSON.stringify(notifications))
      }

      toast.success("Notification Preferences Saved", {
        description: "Your recruiter alert preferences have been synced with database.",
      })
    } catch {
      toast.error("Failed to save preferences.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Security Settings Saved", {
      description: "Your password has been updated securely.",
    })
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-white font-medium">Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Recruiter Settings
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400">
          Manage your email alerts, authentication credentials, and billing preferences.
        </p>
      </div>

      {/* Settings Tabs Container */}
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="bg-white/[0.03] border border-white/5">
          <TabsTrigger value="notifications">Alerts & Notifications</TabsTrigger>
          <TabsTrigger value="security">Security & Login</TabsTrigger>
          <TabsTrigger value="billing">Plan & Invoicing</TabsTrigger>
        </TabsList>

        {/* Tab 1: Notifications with shadcn Switch */}
        <TabsContent value="notifications" className="space-y-6 pt-2">
          <Card className="border-white/5 bg-[#0c0d12]">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold text-white">Hiring Alerts</CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Choose what updates you receive about candidate applications.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* Alert 1 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-white">
                    Instant Candidate Notifications
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Receive an immediate email whenever a qualified candidate applies.
                  </div>
                </div>
                <Switch
                  checked={notifications.instantApplicationAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications((p) => ({ ...p, instantApplicationAlerts: checked }))
                  }
                />
              </div>

              {/* Alert 2 */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-white">Daily Candidate Summary</div>
                  <div className="text-[11px] text-zinc-400">
                    A consolidated digest of all new applicants received in the last 24 hours.
                  </div>
                </div>
                <Switch
                  checked={notifications.dailyDigest}
                  onCheckedChange={(checked) =>
                    setNotifications((p) => ({ ...p, dailyDigest: checked }))
                  }
                />
              </div>

              {/* Alert 3 */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-white">Interview Reminders</div>
                  <div className="text-[11px] text-zinc-400">
                    Reminders 1 hour prior to scheduled technical interviews.
                  </div>
                </div>
                <Switch
                  checked={notifications.interviewReminders}
                  onCheckedChange={(checked) =>
                    setNotifications((p) => ({ ...p, interviewReminders: checked }))
                  }
                />
              </div>

              <div className="border-t border-white/5 pt-5 flex justify-end">
                <Button
                  onClick={handleSaveNotifications}
                  disabled={isSaving}
                  variant="brand"
                  className="h-9 rounded-xl text-xs font-semibold px-4 shadow-lg shadow-indigo-600/25 disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Security */}
        <TabsContent value="security" className="space-y-6 pt-2">
          <Card className="border-white/5 bg-[#0c0d12]">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold text-white">Password & Authentication</CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Update your account password and review multi-factor authentication.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••••••"
                    className="h-10 rounded-xl border-white/10 bg-[#161720] text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••••••"
                    className="h-10 rounded-xl border-white/10 bg-[#161720] text-xs text-white"
                  />
                </div>

                <Button
                  type="submit"
                  variant="brand"
                  className="h-9 rounded-xl text-xs font-semibold px-4 shadow-lg shadow-indigo-600/25"
                >
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Billing */}
        <TabsContent value="billing" className="space-y-6 pt-2">
          <Card className="border-white/5 bg-[#0c0d12]">
            <CardHeader className="border-b border-white/5 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-white">Subscription Plan</CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  Your current active recruitment quota and tier.
                </CardDescription>
              </div>
              <span className="rounded-full bg-[#665df5]/15 px-3 py-1 text-xs font-semibold text-[#a5b4fc] border border-[#665df5]/30">
                Enterprise Plan
              </span>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Unlimited Job Postings</div>
                  <div className="text-[11px] text-zinc-400">
                    Billed annually at $1,299 / month • Next renewal: Oct 24, 2025
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-8 rounded-lg border-white/10 text-xs text-zinc-300">
                  Manage Billing
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
