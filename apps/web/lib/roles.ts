/**
 * HireLoop Role-Based Access Control (RBAC) System
 * Matched with Figma 04 · Admin Console specifications
 */

export type UserRole = "seeker" | "recruiter" | "admin" | "superadmin"

export interface RoleConfig {
  id: UserRole
  name: string
  label: string
  description: string
  badgeColor: string
}

export const USER_ROLES: Record<UserRole, RoleConfig> = {
  seeker: {
    id: "seeker",
    name: "Job Seeker",
    label: "Candidate",
    description: "Search, bookmark, and 1-click apply to verified tech jobs. Manage resumes and track applications.",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  recruiter: {
    id: "recruiter",
    name: "Recruiter",
    label: "Employer / Recruiter",
    description: "Post new job openings, manage company profile, review applicant pipelines, and schedule interviews.",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  admin: {
    id: "admin",
    name: "Platform Admin",
    label: "Admin",
    description: "Oversee active job listings, verify employer accounts, moderate content, and manage user roles.",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  superadmin: {
    id: "superadmin",
    name: "Super Admin",
    label: "Super Admin",
    description: "Full system authority. Manage billing, audit logs, system-wide configuration, and admin access.",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
}

/**
 * এডমিন ইউজারের দায়িত্ব ও কার্যাবলি (Admin Responsibilities & Tasks)
 */
export interface AdminDuty {
  category: string
  title: string
  description: string
  icon: string
  tasks: string[]
}

export const ADMIN_RESPONSIBILITIES: AdminDuty[] = [
  {
    category: "User & Role Management",
    title: "ইউজার ও রোল ম্যানেজমেন্ট (User Control)",
    description: "প্ল্যাটফর্মের সকল ইউজার (Job Seeker ও Recruiter) তদারকি ও রোল অ্যাসাইন করা।",
    icon: "Users",
    tasks: [
      "নতুন ইউজারদের তথ্য ও অ্যাক্টিভিটি রিভিউ করা",
      "ইউজারের রোল পরিবর্তন (Seeker ↔ Recruiter ↔ Admin) করা",
      "স্প্যাম বা ফেক অ্যাক্টিভিটি দেখলে অ্যাকাউন্ট সাসপেন্ড বা ব্যান (Suspend / Ban) করা",
      "ইউজার ডাটা এক্সপোর্ট এবং অডিট হিস্টোরি চেক করা",
    ],
  },
  {
    category: "Job Post Moderation",
    title: "জব পোস্টিং ও মডারেশন (Job Approval)",
    description: "রিক্রুটারদের পোস্ট করা সার্কুলার যাচাই ও স্বচ্ছতা নিশ্চিত করা।",
    icon: "Briefcase",
    tasks: [
      "পোস্ট করা জবের স্যালারি রেঞ্জ ও পলিসি ভায়োলেশন যাচাই করা",
      "ফেক বা ঘোস্ট জব বাতিল (Reject / Delete) করা",
      "মানসম্মত ও ভেরিফায়েড জব অনুমোদন (Approve / Publish) করা",
      "জব স্ট্যাটাস নিয়ন্ত্রণ (Active, Expired, Closed)",
    ],
  },
  {
    category: "Company Verification",
    title: "কোম্পানি ভেরিফিকেশন (Employer Trust)",
    description: "প্ল্যাটফর্মের শতভাগ বিশ্বস্ততা রক্ষায় নিয়োগকারী প্রতিষ্ঠান ভেরিফাই করা।",
    icon: "Building2",
    tasks: [
      "কোম্পানির অফিসিয়াল ডকুমেন্ট ও ওয়ার্ক ইমেইল ডোমেন যাচাই করা",
      "ভেরিফায়েড কোম্পানি ব্যাজ ('Verified Employer') প্রদান করা",
      "কোম্পানির বিরুদ্ধে কোনো প্রার্থীর অভিযোগ এলে তদন্ত ও অ্যাকশন নেওয়া",
    ],
  },
  {
    category: "Analytics & Platform Health",
    title: "প্ল্যাটফর্ম অ্যানালিটিক্স ও মনিটরিং (Metrics & Growth)",
    description: "HireLoop-এর রিয়েল-টাইম পারফরম্যান্স ও ট্রানজাকশন মনিটরিং।",
    icon: "BarChart3",
    tasks: [
      "মোট ইউজার, রিক্রুটার ও জব পোস্টিং গ্রোথ ট্র্যাক করা",
      "সাসপেন্ডেড অ্যাকাউন্ট ও স্প্যাম রেশিও মনিটর করা (0.8% টার্গেট)",
      "সাবস্ক্রিপশন ও রেভিনিউ রিপোর্ট এক্সপোর্ট (CSV / PDF) করা",
    ],
  },
  {
    category: "Security & System Policies",
    title: "সিকিউরিটি ও প্ল্যাটফর্ম পলিসি (Security & Audit)",
    description: "প্ল্যাটফর্মের ডাটা প্রাইভেসি ও কমপ্লায়েন্স রক্ষা করা।",
    icon: "ShieldAlert",
    tasks: [
      "অ্যাডমিন অডিট লগ (Audit Trail) মনিটরিং করা",
      "সিস্টেম পলিসি, টার্মস ও প্রাইভেসি গাইডলাইন আপডেট করা",
      "সন্দেহজনক লগইন বা সিকিউরিটি থ্রেট প্রতিরোধ করা",
    ],
  },
]

/**
 * Role Check Helpers
 */
export function isAdmin(role?: string | null): boolean {
  return role === "admin" || role === "superadmin"
}

export function isRecruiter(role?: string | null): boolean {
  return role === "recruiter" || isAdmin(role)
}

export function isSeeker(role?: string | null): boolean {
  return role === "seeker" || !role
}
