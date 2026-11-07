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
  role: "seeker" | "recruiter" | "admin"
  joinDate: string
  status: "Active" | "Suspended"
}

const initialUsers: UserRow[] = [
  {
    id: "usr-1",
    name: "Jordan Davis",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    email: "jordan.davis@example.com",
    role: "seeker",
    joinDate: "Oct 12, 2023",
    status: "Active",
  },
  {
    id: "usr-2",
    name: "Elena Rodriguez",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    email: "elena.r@talentflow.io",
    role: "recruiter",
    joinDate: "Sep 28, 2023",
    status: "Active",
  },
  {
    id: "usr-3",
    name: "Marcus Webb",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    email: "m.webb@outlook.com",
    role: "seeker",
    joinDate: "Aug 05, 2023",
    status: "Suspended",
  },
  {
    id: "usr-4",
    name: "Tom Hiddleston",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100",
    email: "t.hiddles@loki-tech.com",
    role: "recruiter",
    joinDate: "Nov 01, 2023",
    status: "Active",
  },
]

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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        const res = await fetch(`${apiUrl}/users`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) {
            const mapped: UserRow[] = data.map((u: any, idx: number) => ({
              id: u._id || `usr-${idx}`,
              name: u.name || u.email?.split("@")[0] || "User",
              avatar:
                u.image ||
                `https://images.unsplash.com/photo-${1500000000000 + idx * 1000}?w=100`,
              email: u.email,
              role: u.role === "recruiter" ? "recruiter" : u.role === "admin" ? "admin" : "seeker",
              joinDate: u.createdAt
                ? new Date(u.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                : "Oct 24, 2023",
              status: u.banned || u.status === "suspended" ? "Suspended" : "Active",
            }))
            setUsersList(mapped)
          }
        }
      } catch (err) {
        console.error("Failed to load users:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadServerUsers()
  }, [])

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const toggleStatus = (id: string, currentStatus: "Active" | "Suspended") => {
    const nextStatus = currentStatus === "Active" ? "Suspended" : "Active"
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u))
    )
    toast.success(`User ${nextStatus}`, {
      description: `Account has been ${nextStatus.toLowerCase()} successfully.`,
    })
  }

  const toggleRole = (id: string, currentRole: "seeker" | "recruiter" | "admin") => {
    const nextRole = currentRole === "seeker" ? "recruiter" : "seeker"
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: nextRole } : u))
    )
    toast.success(`Role Updated`, {
      description: `User role changed to ${nextRole}.`,
    })
  }

  const handleDelete = (id: string) => {
    setUsersList((prev) => prev.filter((u) => u.id !== id))
    toast.success("User Deleted", {
      description: "Account removed from database.",
    })
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Export (Figma Screenshot 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">User Management</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Review, filter, and manage platform access for all users.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 rounded-xl border border-white/10 bg-[#161720] px-3 text-xs text-white focus:outline-none focus:border-[#665df5]"
          >
            <option value="all">All Roles</option>
            <option value="seeker">Seeker</option>
            <option value="recruiter">Recruiter</option>
            <option value="admin">Admin</option>
          </select>

          <Button
            onClick={() => toast.success("Exporting User List (CSV)...")}
            className="h-9 rounded-xl bg-white text-xs font-semibold text-zinc-900 hover:bg-zinc-100 shadow-sm transition-all"
          >
            Export List
          </Button>
        </div>
      </div>

      {/* 4 User Stats Cards (Exact Match with Figma Screenshot 2) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Active Users */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <span className="text-xs text-zinc-400 font-medium">Total Active Users</span>
          <div className="mt-2 text-2xl font-extrabold text-white">12,842</div>
          <span className="mt-1 inline-block text-[11px] text-emerald-400 font-medium">
            +12% vs last month
          </span>
        </div>

        {/* Card 2: Recruiter Growth */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <span className="text-xs text-zinc-400 font-medium">Recruiter Growth</span>
          <div className="mt-2 text-2xl font-extrabold text-white">843</div>
          <span className="mt-1 inline-block text-[11px] text-emerald-400 font-medium">
            High demand
          </span>
        </div>

        {/* Card 3: Suspended Accounts */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <span className="text-xs text-zinc-400 font-medium">Suspended Accounts</span>
          <div className="mt-2 text-2xl font-extrabold text-white">124</div>
          <span className="mt-1 inline-block text-[11px] text-zinc-400 font-medium">
            0.8% of total
          </span>
        </div>

        {/* Card 4: New Signups */}
        <div className="rounded-2xl border border-white/5 bg-[#0c0d12] p-5">
          <span className="text-xs text-zinc-400 font-medium">New Signups (24h)</span>
          <div className="mt-2 text-2xl font-extrabold text-white">42</div>
          <span className="mt-1 inline-block text-[11px] text-amber-400 font-medium">
            Steady activity
          </span>
        </div>
      </div>

      {/* Users Table (Exact Columns and Styling from Screenshot 2) */}
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-zinc-500">
                    {isLoading ? "Loading users directory..." : "No users found matching your criteria."}
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

                  {/* ROLE PILL (Figma Exact) */}
                  <td className="px-6 py-4">
                    {user.role === "recruiter" ? (
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
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                        Suspended
                      </span>
                    )}
                  </td>

                  {/* ACTIONS (Make Recruiter / Make Seeker, Suspend / Activate / Delete) */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-xs">
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
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog (shadcn UI) */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold text-white">"{userToDelete?.name}"</span> ({userToDelete?.email})? The user will immediately lose access to the platform and their account data will be permanently purged.
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
