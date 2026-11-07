"use client"

import * as React from "react"
import {
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  Download,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { toast } from "@workspace/ui/components/sonner"
import {
  ADMIN_RESPONSIBILITIES,
  USER_ROLES,
  type UserRole,
} from "@/lib/roles"

interface MockUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: "active" | "suspended"
  joinedAt: string
}

const initialUsers: MockUser[] = [
  {
    id: "usr_1",
    name: "Alex Rivera",
    email: "alex.rivera@hireloop.io",
    role: "superadmin",
    status: "active",
    joinedAt: "Jan 12, 2024",
  },
  {
    id: "usr_2",
    name: "Sarah Chen",
    email: "sarah.chen@techflow.ai",
    role: "admin",
    status: "active",
    joinedAt: "Feb 04, 2024",
  },
  {
    id: "usr_3",
    name: "David Kim",
    email: "david@linearflow.com",
    role: "recruiter",
    status: "active",
    joinedAt: "Mar 18, 2024",
  },
  {
    id: "usr_4",
    name: "Nabila Rahman",
    email: "nabila.dev@gmail.com",
    role: "seeker",
    status: "active",
    joinedAt: "Apr 01, 2024",
  },
  {
    id: "usr_5",
    name: "Spam Agency Corp",
    email: "contact@fastjobs-scam.net",
    role: "recruiter",
    status: "suspended",
    joinedAt: "Apr 14, 2024",
  },
]

export default function AdminConsolePage() {
  const [activeTab, setActiveTab] = React.useState<"duties" | "users" | "jobs">("duties")
  const [users, setUsers] = React.useState<MockUser[]>(initialUsers)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<string>("all")

  // Admin Action Handlers
  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    )
    toast.success("ইউজার রোল আপডেট হয়েছে!", {
      description: `User role changed to ${USER_ROLES[newRole].name}.`,
    })
  }

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === "active" ? "suspended" : "active"
          if (newStatus === "suspended") {
            toast.error("অ্যাকাউন্ট সাসপেন্ড করা হয়েছে!", {
              description: `${u.name} (${u.email}) access revoked.`,
            })
          } else {
            toast.success("অ্যাকাউন্ট রিস্টোর হয়েছে!", {
              description: `${u.name} is now active.`,
            })
          }
          return { ...u, status: newStatus }
        }
        return u
      })
    )
  }

  const handleExportReport = () => {
    toast.info("অ্যাডমিন রিপোর্ট তৈরি হচ্ছে...", {
      description: "Platform growth metrics report downloading (CSV).",
    })
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="min-h-screen bg-[#030305] text-white selection:bg-[#5252ff] selection:text-white px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Top Header Shell (Matching Figma Admin Console) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 text-[11px] font-semibold text-emerald-400">
                <Shield className="h-3 w-3" />
                <span>04 · Admin Console</span>
              </span>
              <span className="text-xs text-zinc-500">|</span>
              <span className="text-xs text-zinc-400">Super Admin Mode</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Dashboard Overview & Admin Duties
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              প্ল্যাটফর্মের পারফরম্যান্স, ইউজার রোলস, জব মডারেশন এবং অ্যাডমিনদের দায়িত্ব ও কার্যাবলি।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleExportReport}
              className="h-10 gap-2 rounded-xl border-white/10 bg-white/5 text-xs font-semibold text-white hover:bg-white/10"
            >
              <Download className="h-4 w-4 text-zinc-400" />
              <span>Export Report</span>
            </Button>
            <Button
              variant="brand"
              className="h-10 gap-2 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30"
              onClick={() => toast.success("New Job Created by Admin")}
            >
              <Plus className="h-4 w-4" />
              <span>Create Job Post</span>
            </Button>
          </div>
        </div>

        {/* Bento Stats Grid (100% matched with Figma Admin Overview) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="rounded-2xl border border-white/10 bg-[#0c0d12]/90 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-zinc-400 mb-3">
              <span className="text-xs font-medium">Total Users</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-[#818cf8]">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">124,892</div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+12% vs last month</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0d12]/90 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-zinc-400 mb-3">
              <span className="text-xs font-medium">Total Recruiters</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">12,405</div>
            <div className="mt-2 text-xs text-zinc-400 font-medium">
              843 New requests pending
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0d12]/90 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-zinc-400 mb-3">
              <span className="text-xs font-medium">Total Companies</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">4,281</div>
            <div className="mt-2 text-xs text-emerald-400/90 font-medium">
              100% Vetted employers
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0d12]/90 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-zinc-400 mb-3">
              <span className="text-xs font-medium">Jobs Posted</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <Briefcase className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">8,920</div>
            <div className="mt-2 text-xs text-zinc-400 font-medium">
              24% Active listings
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("duties")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "duties"
                ? "bg-[#665df5] text-white shadow-md shadow-indigo-600/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            🛡️ এডমিনের দায়িত্ব ও কাজ (Admin Responsibilities)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "users"
                ? "bg-[#665df5] text-white shadow-md shadow-indigo-600/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            👥 ইউজার ও রোল ম্যানেজমেন্ট ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("jobs")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "jobs"
                ? "bg-[#665df5] text-white shadow-md shadow-indigo-600/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            💼 জব ভেরিফিকেশন ও মডারেশন
          </button>
        </div>

        {/* TAB 1: ADMIN RESPONSIBILITIES & DUTIES */}
        {activeTab === "duties" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {ADMIN_RESPONSIBILITIES.map((duty, idx) => (
                <Card
                  key={idx}
                  className="border border-white/10 bg-[#0c0d12]/90 backdrop-blur-xl transition-all hover:border-white/20"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#818cf8]">
                        {duty.category}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">0{idx + 1}</span>
                    </div>
                    <CardTitle className="text-base font-bold text-white leading-snug">
                      {duty.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-zinc-400 leading-relaxed pt-1">
                      {duty.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="space-y-2 border-t border-white/5 pt-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                        মূল দায়িত্বসমূহ:
                      </p>
                      {duty.tasks.map((task, tIdx) => (
                        <div key={tIdx} className="flex items-start gap-2 text-xs text-zinc-300">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{task}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* System Roles Breakdown Card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 mb-4">
                HireLoop প্ল্যাটফর্ম রোলস আর্কিটেকচার (Role Hierarchy)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(Object.keys(USER_ROLES) as UserRole[]).map((roleKey) => {
                  const r = USER_ROLES[roleKey]
                  return (
                    <div
                      key={roleKey}
                      className="rounded-xl border border-white/10 bg-[#101117] p-4 text-left space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{r.name}</span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${r.badgeColor}`}
                        >
                          {r.id}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{r.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT (Interactive Role Assigning & Ban/Unban) */}
        {activeTab === "users" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Search user by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 border-white/10 bg-white/[0.03] text-sm text-white rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Filter Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="h-10 rounded-xl border border-white/10 bg-[#12131a] px-3 text-xs text-white focus:outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="seeker">Job Seeker</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="admin">Platform Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
            </div>

            {/* Users Data Table */}
            <div className="rounded-2xl border border-white/10 bg-[#0c0d12]/95 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 bg-white/[0.02] text-zinc-400 uppercase tracking-wider font-mono text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4 sm:px-6">User</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Joined</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="font-semibold text-white">{user.name}</div>
                          <div className="text-[11px] text-zinc-400">{user.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                            className="rounded-lg border border-white/10 bg-[#14151f] px-2.5 py-1 text-xs text-zinc-200 focus:outline-none hover:border-white/20"
                          >
                            <option value="seeker">Job Seeker</option>
                            <option value="recruiter">Recruiter</option>
                            <option value="admin">Admin</option>
                            <option value="superadmin">Super Admin</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4">
                          {user.status === "active" ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                              Suspended
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                          {user.joinedAt}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant={user.status === "active" ? "destructive" : "brand"}
                            size="sm"
                            className="h-7 text-[11px] px-2.5 rounded-lg"
                            onClick={() => handleToggleStatus(user.id)}
                          >
                            {user.status === "active" ? "Suspend" : "Activate"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: JOB VERIFICATION / MODERATION */}
        {activeTab === "jobs" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="rounded-2xl border border-white/10 bg-[#0c0d12]/95 p-6">
              <h3 className="text-base font-bold text-white mb-2">
                জব পোস্টিং ভেরিফিকেশন কিউ (Pending Job Approval Queue)
              </h3>
              <p className="text-xs text-zinc-400 mb-6">
                রিক্রুটারদের পোস্ট করা জবগুলো পাবলিশ হওয়ার আগে স্যালারি স্বচ্ছতা ও পলিসি যাচাই করুন।
              </p>

              <div className="space-y-3">
                {[
                  {
                    title: "Senior AI Agent Developer",
                    company: "Nexus Labs (Verified)",
                    salary: "$160,000 - $210,000",
                    status: "Pending Review",
                  },
                  {
                    title: "Frontend Lead Engineer",
                    company: "CloudScale Systems",
                    salary: "$135,000 - $175,000",
                    status: "Pending Review",
                  },
                ].map((job, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-white">{job.title}</h4>
                      <p className="text-xs text-zinc-400">
                        {job.company} &bull; <span className="text-emerald-400">{job.salary}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="brand"
                        className="h-8 text-xs rounded-lg"
                        onClick={() => toast.success("জব অ্যাপ্রুভ হয়েছে এবং লাইভ করা হয়েছে!")}
                      >
                        Approve Job
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs rounded-lg border-white/10 text-rose-400 hover:bg-rose-500/10"
                        onClick={() => toast.error("জব বাতিল করা হয়েছে")}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
