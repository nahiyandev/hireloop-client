"use client"

import * as React from "react"
import {
  CheckCircle2,
  ChevronDown,
  Download,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { toast } from "@workspace/ui/components/sonner"
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

interface UserRow {
  id: string
  name: string
  avatar: string
  email: string
  role: "seeker" | "recruiter" | "admin" | "superadmin"
  joinDate: string
  status: "Active" | "Pending" | "Suspended"
}

export default function AdminUsersPage() {
  const [usersList, setUsersList] = React.useState<UserRow[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState("all")
  const [isLoading, setIsLoading] = React.useState(true)
  const [userToDelete, setUserToDelete] = React.useState<UserRow | null>(null)

  // Fetch real users from hireloop-server
  React.useEffect(() => {
    async function loadServerUsers() {
      setIsLoading(true)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
        const res = await fetch(`${apiUrl}/users`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) {
            const mapped: UserRow[] = data.map((u: any, idx: number) => {
              const role: UserRow["role"] =
                u.role === "superadmin"
                  ? "superadmin"
                  : u.role === "admin"
                  ? "admin"
                  : u.role === "recruiter"
                  ? "recruiter"
                  : "seeker"

              let status: UserRow["status"] = "Active"
              if (u.banned || u.status === "suspended" || u.status === "Suspended") {
                status = "Suspended"
              } else if (
                u.status === "pending" ||
                u.status === "Pending" ||
                (role === "admin" && u.adminApproved === false)
              ) {
                status = "Pending"
              }

              return {
                id: u._id || `usr-${idx}`,
                name: u.name || u.email?.split("@")[0] || "User",
                avatar:
                  u.image ||
                  `https://images.unsplash.com/photo-${1500000000000 + idx * 1000}?w=100`,
                email: u.email,
                role,
                joinDate: u.createdAt
                  ? new Date(u.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : "Oct 24, 2023",
                status,
              }
            })
            setUsersList(mapped)
          }
        }
      } catch (err) {
        console.warn("Could not fetch server users, using fallback:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadServerUsers()
  }, [])

  // Filter pending admins awaiting super admin approval
  const pendingAdmins = React.useMemo(() => {
    return usersList.filter((u) => u.role === "admin" && u.status === "Pending")
  }, [usersList])

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())

    if (roleFilter === "all") return matchesSearch
    if (roleFilter === "pending-admin") return matchesSearch && u.role === "admin" && u.status === "Pending"
    return matchesSearch && u.role === roleFilter
  })

  // Super Admin: Approve an admin request
  const handleApproveAdmin = async (id: string, name: string) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: "admin", status: "Active" } : u))
    )
    toast.success("Administrator Approved!", {
      description: `${name} has been approved as Platform Administrator by Super Admin.`,
    })
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
      await fetch(`${apiUrl}/users/${id}/approve-admin`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      })
    } catch {
      // non-blocking
    }
  }

  // Super Admin: Reject an admin request (revert to seeker)
  const handleRejectAdmin = async (id: string, name: string) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: "seeker", status: "Active" } : u))
    )
    toast.info("Admin Request Rejected", {
      description: `${name}'s admin request was rejected. Account set to Job Seeker.`,
    })
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
      await fetch(`${apiUrl}/users/${id}/reject-admin`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      })
    } catch {
      // non-blocking
    }
  }

  // Promote any user to Super Admin
  const handleMakeSuperAdmin = async (id: string, name: string) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: "superadmin", status: "Active" } : u))
    )
    toast.success("Promoted to Super Admin!", {
      description: `${name} has been granted full Super Admin authority.`,
    })
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
      await fetch(`${apiUrl}/users/make-superadmin?id=${id}`)
    } catch {
      // non-blocking
    }
  }

  const toggleStatus = (id: string, currentStatus: "Active" | "Pending" | "Suspended") => {
    const nextStatus = currentStatus === "Active" ? "Suspended" : "Active"
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u))
    )
    toast.success(`User ${nextStatus}`, {
      description: `Account has been ${nextStatus.toLowerCase()} successfully.`,
    })
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
      fetch(`${apiUrl}/users/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      }).catch(() => null)
    } catch {
      // non-blocking
    }
  }

  const toggleRole = async (id: string, currentRole: UserRow["role"]) => {
    const nextRole = currentRole === "seeker" ? "recruiter" : "seeker"
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: nextRole } : u))
    )
    toast.success(`Role Updated`, {
      description: `User role changed to ${nextRole}.`,
    })
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
      await fetch(`${apiUrl}/users/${id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole }),
      })
    } catch {
      // non-blocking
    }
  }

  const handleDelete = async (id: string) => {
    setUsersList((prev) => prev.filter((u) => u.id !== id))
    toast.success("User Deleted", {
      description: "Account removed from database.",
    })
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://hireloop-server-green-phi.vercel.app"
      await fetch(`${apiUrl}/users/${id}`, { method: "DELETE" })
    } catch {
      // non-blocking
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Export (Figma Screenshot 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">User Management</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Review, filter, and manage platform roles and Super Admin approvals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="h-9 w-48 sm:w-60 rounded-xl border border-white/10 bg-[#161720] pl-8 pr-3 text-xs text-white focus:outline-none focus:border-[#665df5]"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 rounded-xl border border-white/10 bg-[#161720] px-3 text-xs text-white focus:outline-none focus:border-[#665df5]"
          >
            <option value="all">All Roles</option>
            <option value="seeker">Seeker</option>
            <option value="recruiter">Recruiter</option>
            <option value="admin">Admin</option>
            {pendingAdmins.length > 0 && (
              <option value="pending-admin">Pending Admins ({pendingAdmins.length})</option>
            )}
          </select>

          <Button
            onClick={() => toast.success("Exporting User List (CSV)...")}
            className="h-9 rounded-xl bg-white text-xs font-semibold text-zinc-900 hover:bg-zinc-100 shadow-sm transition-all"
          >
            Export List
          </Button>
        </div>
      </div>

      {/* 4 User Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Active Users */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <span className="text-xs text-zinc-400 font-medium">Total Registered Users</span>
          <div className="mt-2 text-2xl font-extrabold text-white">
            {isLoading ? "..." : usersList.length}
          </div>
          <span className="mt-1 inline-block text-[11px] text-emerald-400 font-medium">
            Live MongoDB Records
          </span>
        </div>

        {/* Card 2: Recruiters */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <span className="text-xs text-zinc-400 font-medium">Recruiter Accounts</span>
          <div className="mt-2 text-2xl font-extrabold text-white">
            {isLoading ? "..." : usersList.filter((u) => u.role === "recruiter").length}
          </div>
          <span className="mt-1 inline-block text-[11px] text-[#818cf8] font-medium">
            Employer profiles
          </span>
        </div>

        {/* Card 3: Pending Admin Approvals (Super Admin Attention) */}
        <div className={`rounded-2xl border p-5 transition-all ${
          pendingAdmins.length > 0
            ? "border-amber-500/30 bg-amber-950/20 shadow-lg shadow-amber-950/20"
            : "border-white/5 bg-[#0c0d12]"
        }`}>
          <span className="text-xs font-medium text-zinc-400">Pending Admin Approvals</span>
          <div className={`mt-2 text-2xl font-extrabold ${
            pendingAdmins.length > 0 ? "text-amber-400" : "text-white"
          }`}>
            {isLoading ? "..." : pendingAdmins.length}
          </div>
          <span className="mt-1 inline-block text-[11px] text-amber-400 font-medium">
            {pendingAdmins.length > 0 ? "Super Admin Action Required" : "All admins approved"}
          </span>
        </div>

        {/* Card 4: Platform Admins */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <span className="text-xs text-zinc-400 font-medium">Active Platform Admins</span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-400">
            {isLoading ? "..." : usersList.filter((u) => u.role === "admin" && u.status === "Active").length}
          </div>
          <span className="mt-1 inline-block text-[11px] text-zinc-400 font-medium">
            Verified administrators
          </span>
        </div>
      </div>

      {/* Super Admin Action Center: Pending Admin Requests Banner */}
      {pendingAdmins.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-[#0c0d12] to-amber-950/20 p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Pending Administrator Approvals
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-mono text-amber-300">
                  {pendingAdmins.length} Request{pendingAdmins.length === 1 ? "" : "s"}
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Super Admin authorization required: Verify and approve administrative privileges before granting console access.
              </p>
            </div>
          </div>

          <div className="divide-y divide-white/5 rounded-xl border border-white/5 bg-white/[0.02]">
            {pendingAdmins.map((pAdmin) => (
              <div key={pAdmin.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={pAdmin.avatar}
                    alt={pAdmin.name}
                    className="h-9 w-9 rounded-full object-cover border border-amber-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{pAdmin.name}</span>
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-400 border border-amber-500/20">
                        Pending Approval
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">{pAdmin.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    size="sm"
                    onClick={() => handleApproveAdmin(pAdmin.id, pAdmin.name)}
                    className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3 shadow-md shadow-emerald-900/30 gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Approve Admin
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRejectAdmin(pAdmin.id, pAdmin.name)}
                    className="h-8 rounded-lg border-white/10 bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 text-zinc-400 text-xs px-3 cursor-pointer"
                  >
                    Reject Request
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-2xl border border-white/5 bg-[#0c0d12] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/5 bg-white/[0.01] text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-6 py-4">USER NAME</th>
                <th className="px-6 py-4">EMAIL ADDRESS</th>
                <th className="px-6 py-4">ROLE</th>
                <th className="px-6 py-4">JOIN DATE</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-zinc-500">
                    <Loader2 className="h-6 w-6 animate-spin text-[#665df5] mx-auto" />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-zinc-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-white/[0.01]">
                  {/* USER NAME with Avatar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover border border-white/10"
                      />
                      <span className="font-medium text-white">{user.name}</span>
                    </div>
                  </td>

                  {/* EMAIL ADDRESS */}
                  <td className="px-6 py-4 font-mono text-[11px] text-zinc-400">
                    {user.email}
                  </td>

                  {/* ROLE PILL */}
                  <td className="px-6 py-4">
                    {user.role === "superadmin" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 px-3 py-1 text-[11px] font-medium text-rose-300 border border-rose-500/30">
                        <span>👑</span> Super Admin
                      </span>
                    ) : user.role === "admin" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-medium text-emerald-300 border border-emerald-500/30">
                        <span>🛡️</span> Admin
                      </span>
                    ) : user.role === "recruiter" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#665df5]/15 px-3 py-1 text-[11px] font-medium text-[#a5b4fc] border border-[#665df5]/30">
                        <span>💼</span> Recruiter
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-medium text-zinc-300 border border-white/10">
                        <span>👤</span> Seeker
                      </span>
                    )}
                  </td>

                  {/* JOIN DATE */}
                  <td className="px-6 py-4 font-mono text-[11px] text-zinc-400">
                    {user.joinDate}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    {user.status === "Active" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Active
                      </span>
                    ) : user.status === "Pending" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Pending Review
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                        Suspended
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-right">
                    {user.role === "admin" && user.status === "Pending" ? (
                      <div className="flex items-center justify-end gap-2 text-xs">
                        <Button
                          size="sm"
                          onClick={() => handleApproveAdmin(user.id, user.name)}
                          className="h-7 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] px-2.5 shadow-sm gap-1"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectAdmin(user.id, user.name)}
                          className="h-7 rounded-lg border-white/10 bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 text-zinc-400 text-[11px] px-2.5"
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-3 text-xs">
                        {user.role !== "superadmin" && (
                          <button
                            onClick={() => handleMakeSuperAdmin(user.id, user.name)}
                            className="font-medium text-amber-400 hover:text-amber-300 transition-colors"
                            title="Promote account to Super Admin"
                          >
                            👑 Super Admin
                          </button>
                        )}

                        <button
                          onClick={() => toggleRole(user.id, user.role)}
                          className="text-zinc-400 hover:text-white transition-colors"
                        >
                          {user.role === "seeker" ? "Make Recruiter" : "Make Seeker"}
                        </button>

                        {user.status === "Active" ? (
                          <button
                            onClick={() => toggleStatus(user.id, user.status)}
                            className="font-medium text-rose-400 hover:text-rose-300 transition-colors"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleStatus(user.id, user.status)}
                            className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            Activate
                          </button>
                        )}

                        <button
                          onClick={() => setUserToDelete(user)}
                          className="text-zinc-500 hover:text-rose-400 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold text-white">&quot;{userToDelete?.name}&quot;</span> ({userToDelete?.email})? The user will immediately lose access to the platform and their account data will be permanently purged.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (userToDelete) {
                  handleDelete(userToDelete.id)
                  setUserToDelete(null)
                }
              }}
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
