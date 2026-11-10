"use client"

import * as React from "react"
import {
  Bell,
  CheckCircle2,
  Database,
  Globe,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
  Save,
  Server,
  Shield,
  Sliders,
  Smartphone,
  UserCheck,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { toast } from "@workspace/ui/components/sonner"

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = React.useState(false)

  // General Settings
  const [generalConfig, setGeneralConfig] = React.useState({
    platformName: "HireLoop Enterprise",
    supportEmail: "support@hireloop.io",
    systemNotice: "Welcome to HireLoop 2.0 release.",
    maintenanceMode: false,
    allowNewRegistrations: true,
    requireEmailVerification: true,
  })

  // Security & Auth Settings
  const [securityConfig, setSecurityConfig] = React.useState({
    enforce2FA: false,
    sessionExpiryDays: "30",
    maxLoginAttempts: "5",
    adminIpWhitelist: "127.0.0.1, ::1",
  })

  // Notification Alerts
  const [notificationConfig, setNotificationConfig] = React.useState({
    recruiterApplicationAlerts: true,
    suspiciousLoginAlerts: true,
    weeklyPlatformMetrics: true,
    webhookDispatches: false,
  })

  // Load platform settings from MongoDB
  React.useEffect(() => {
    async function loadSettings() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
        const res = await fetch(`${apiUrl}/settings`)
        if (res.ok) {
          const data = await res.json()
          if (data) {
            setGeneralConfig({
              platformName: data.platformName || "HireLoop Enterprise",
              supportEmail: data.supportEmail || "support@hireloop.io",
              systemNotice: data.systemNotice || "Welcome to HireLoop 2.0 release.",
              maintenanceMode: Boolean(data.maintenanceMode),
              allowNewRegistrations: data.allowNewRegistrations !== undefined ? Boolean(data.allowNewRegistrations) : true,
              requireEmailVerification: data.requireEmailVerification !== undefined ? Boolean(data.requireEmailVerification) : true,
            })
            setSecurityConfig({
              enforce2FA: Boolean(data.enforce2FA),
              sessionExpiryDays: String(data.sessionExpiryDays || "30"),
              maxLoginAttempts: String(data.maxLoginAttempts || "5"),
              adminIpWhitelist: data.adminIpWhitelist || "127.0.0.1, ::1",
            })
            setNotificationConfig({
              recruiterApplicationAlerts: data.recruiterApplicationAlerts !== undefined ? Boolean(data.recruiterApplicationAlerts) : true,
              suspiciousLoginAlerts: data.suspiciousLoginAlerts !== undefined ? Boolean(data.suspiciousLoginAlerts) : true,
              weeklyPlatformMetrics: data.weeklyPlatformMetrics !== undefined ? Boolean(data.weeklyPlatformMetrics) : true,
              webhookDispatches: Boolean(data.webhookDispatches),
            })
          }
        }
      } catch (err) {
        console.warn("Could not load remote settings:", err)
      }
    }
    loadSettings()
  }, [])

  const saveAllSettings = async () => {
    setIsSaving(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
      const payload = {
        ...generalConfig,
        ...securityConfig,
        ...notificationConfig,
      }
      const res = await fetch(`${apiUrl}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed to save settings")
      return true
    } catch (err: any) {
      toast.error(err?.message || "Failed to save settings.")
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await saveAllSettings()
    if (ok) {
      toast.success("Platform Settings Saved", {
        description: "Global platform configuration successfully synced to database.",
      })
    }
  }

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await saveAllSettings()
    if (ok) {
      toast.success("Security Rules Applied", {
        description: "Authentication and session policies have been saved to database.",
      })
    }
  }

  const handleSaveNotifications = async () => {
    const ok = await saveAllSettings()
    if (ok) {
      toast.success("Notification Preferences Saved", {
        description: "Automated alert rules have been saved to database.",
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Platform Settings</h1>
        <p className="mt-1 text-xs text-zinc-400">
          Manage system controls, authentication policies, automated alerts, and deployment parameters.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-white/[0.03] border border-white/5 p-1 rounded-2xl flex flex-wrap gap-1">
          <TabsTrigger
            value="general"
            className="rounded-xl px-4 py-2 text-xs font-medium text-zinc-400 data-[state=active]:bg-[#665df5] data-[state=active]:text-white transition-all"
          >
            <Sliders className="mr-2 h-3.5 w-3.5 inline" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-xl px-4 py-2 text-xs font-medium text-zinc-400 data-[state=active]:bg-[#665df5] data-[state=active]:text-white transition-all"
          >
            <Shield className="mr-2 h-3.5 w-3.5 inline" />
            Security & Auth
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-xl px-4 py-2 text-xs font-medium text-zinc-400 data-[state=active]:bg-[#665df5] data-[state=active]:text-white transition-all"
          >
            <Bell className="mr-2 h-3.5 w-3.5 inline" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="rounded-xl px-4 py-2 text-xs font-medium text-zinc-400 data-[state=active]:bg-[#665df5] data-[state=active]:text-white transition-all"
          >
            <Server className="mr-2 h-3.5 w-3.5 inline" />
            Infrastructure & Health
          </TabsTrigger>
        </TabsList>

        {/* 1. GENERAL TAB */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card className="border border-white/5 bg-[#0c0d12] shadow-2xl rounded-2xl">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-base font-bold text-white">Platform Information</CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Primary naming, contact information, and public status controls.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSaveGeneral} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-300">Platform Title</Label>
                    <Input
                      value={generalConfig.platformName}
                      onChange={(e) =>
                        setGeneralConfig({ ...generalConfig, platformName: e.target.value })
                      }
                      className="border-white/10 bg-[#161720] text-xs text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-300">Support Contact Email</Label>
                    <Input
                      value={generalConfig.supportEmail}
                      onChange={(e) =>
                        setGeneralConfig({ ...generalConfig, supportEmail: e.target.value })
                      }
                      className="border-white/10 bg-[#161720] text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-zinc-300">Global Announcement Notice</Label>
                  <Input
                    value={generalConfig.systemNotice}
                    onChange={(e) =>
                      setGeneralConfig({ ...generalConfig, systemNotice: e.target.value })
                    }
                    className="border-white/10 bg-[#161720] text-xs text-white"
                  />
                </div>

                <div className="border-t border-white/5 pt-6 space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                    System Access Toggles
                  </h3>

                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <div>
                      <div className="text-xs font-medium text-white">Allow New Registrations</div>
                      <div className="text-[11px] text-zinc-400">
                        Enable candidate and recruiter onboarding registration flows.
                      </div>
                    </div>
                    <Switch
                      checked={generalConfig.allowNewRegistrations}
                      onCheckedChange={(checked) =>
                        setGeneralConfig({ ...generalConfig, allowNewRegistrations: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <div>
                      <div className="text-xs font-medium text-white">Maintenance Mode</div>
                      <div className="text-[11px] text-zinc-400">
                        Restrict non-admin access and display platform maintenance notice.
                      </div>
                    </div>
                    <Switch
                      checked={generalConfig.maintenanceMode}
                      onCheckedChange={(checked) =>
                        setGeneralConfig({ ...generalConfig, maintenanceMode: checked })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    variant="brand"
                    className="h-9 px-5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30"
                  >
                    <Save className="mr-2 h-3.5 w-3.5" />
                    {isSaving ? "Saving..." : "Save General Settings"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. SECURITY & AUTH TAB */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card className="border border-white/5 bg-[#0c0d12] shadow-2xl rounded-2xl">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-base font-bold text-white">Security & Access Policies</CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Better Auth authentication restrictions, session lifetimes, and brute-force protection.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSaveSecurity} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-300">Session Expiration (Days)</Label>
                    <Input
                      type="number"
                      value={securityConfig.sessionExpiryDays}
                      onChange={(e) =>
                        setSecurityConfig({ ...securityConfig, sessionExpiryDays: e.target.value })
                      }
                      className="border-white/10 bg-[#161720] text-xs text-white font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-300">Max Failed Login Attempts</Label>
                    <Input
                      type="number"
                      value={securityConfig.maxLoginAttempts}
                      onChange={(e) =>
                        setSecurityConfig({ ...securityConfig, maxLoginAttempts: e.target.value })
                      }
                      className="border-white/10 bg-[#161720] text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div>
                    <div className="text-xs font-medium text-white">Enforce 2-Factor Authentication</div>
                    <div className="text-[11px] text-zinc-400">
                      Mandate TOTP two-factor authentication for all recruiter and admin accounts.
                    </div>
                  </div>
                  <Switch
                    checked={securityConfig.enforce2FA}
                    onCheckedChange={(checked) =>
                      setSecurityConfig({ ...securityConfig, enforce2FA: checked })
                    }
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    variant="brand"
                    className="h-9 px-5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30"
                  >
                    <Save className="mr-2 h-3.5 w-3.5" />
                    Save Security Rules
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card className="border border-white/5 bg-[#0c0d12] shadow-2xl rounded-2xl">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-base font-bold text-white">System Notifications</CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Configure administrative event logging, webhook dispatches, and executive reports.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div>
                  <div className="text-xs font-medium text-white">New Recruiter Organization Alerts</div>
                  <div className="text-[11px] text-zinc-400">
                    Send high-priority notifications when an employer registers for verification.
                  </div>
                </div>
                <Switch
                  checked={notificationConfig.recruiterApplicationAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationConfig({ ...notificationConfig, recruiterApplicationAlerts: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div>
                  <div className="text-xs font-medium text-white">Weekly Performance Digest</div>
                  <div className="text-[11px] text-zinc-400">
                    Automated weekly platform metrics sent directly to system administrators.
                  </div>
                </div>
                <Switch
                  checked={notificationConfig.weeklyPlatformMetrics}
                  onCheckedChange={(checked) =>
                    setNotificationConfig({ ...notificationConfig, weeklyPlatformMetrics: checked })
                  }
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveNotifications}
                  disabled={isSaving}
                  variant="brand"
                  className="h-9 px-5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 disabled:opacity-60"
                >
                  <Save className="mr-2 h-3.5 w-3.5" />
                  {isSaving ? "Saving..." : "Save Notifications"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. INFRASTRUCTURE & HEALTH TAB */}
        <TabsContent value="system" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
              <span className="text-xs text-zinc-400 font-medium">Database Cluster</span>
              <div className="mt-2 text-xl font-bold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                MongoDB Atlas
              </div>
              <span className="mt-1 inline-block text-[11px] text-emerald-400 font-medium font-mono">
                hireloopdb (Healthy)
              </span>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
              <span className="text-xs text-zinc-400 font-medium">Authentication Engine</span>
              <div className="mt-2 text-xl font-bold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Better Auth
              </div>
              <span className="mt-1 inline-block text-[11px] text-zinc-400 font-medium font-mono">
                v1.7.18 (Secure)
              </span>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
              <span className="text-xs text-zinc-400 font-medium">Deployment Target</span>
              <div className="mt-2 text-xl font-bold text-white flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#818cf8]" />
                Vercel Serverless
              </div>
              <span className="mt-1 inline-block text-[11px] text-[#818cf8] font-medium font-mono">
                Next.js 16 + Express API
              </span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
