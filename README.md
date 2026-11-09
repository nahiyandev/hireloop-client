# 🚀 HireLoop — Modern AI-Driven Hiring Platform (Client)

HireLoop is a full-featured, modern talent acquisition and recruitment platform designed for Job Seekers, Recruiters, and Admins. Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, and Better-Auth.

---

## 🌟 Key Features

### 1. 🌐 Public Site & Job Portal
- **Browse Jobs (`/jobs`)**:
  - Full URL synchronization using Next.js `useSearchParams()` (`?q=`, `?loc=`, `?type=`, `?sort=`, `?page=`).
  - Search by keywords, company name, or location.
  - Multi-select filters for job types (Full-time, Contract, Freelance).
  - Dynamic salary and recency sorting.
  - Live data fetched directly from MongoDB via backend REST API.
  - Dynamic client-side and server-side responsive pagination.
- **Job Details (`/jobs/[id]`)**:
  - Comprehensive job specifications, responsibilities, requirements, and company overview.
  - Integrated candidate application modal with portfolio URL, LinkedIn profile, contact details, and custom cover note.
  - Persistent bookmarking (Saved Jobs) with localStorage synchronization.
- **Pricing & Checkout (`/pricing`, `/checkout`)**:
  - Multi-tier subscription plans (Free, Growth, Pro).
  - Multi-currency Stripe checkout simulation (BDT / USD).

### 2. 🛡️ Role-Based Dashboards (`/dashboard`)
Protected routes with strict role-based authorization:
- **👨‍💻 Job Seeker (`/dashboard/seeker`)**:
  - Overview of job applications and statuses (Applied, Reviewing, Interviewing, Offer).
  - Saved/Bookmarked opportunities management (`/dashboard/seeker/saved`) with real-time database synchronization.
  - Profile and application history tracking.
- **💼 Recruiter (`/dashboard/recruiter`)**:
  - Post and manage job listings (`/dashboard/recruiter/jobs/new`, `/dashboard/recruiter/jobs`).
  - Quick action to view live job postings (`<Eye>` View Job preview link).
  - Applicant pipeline tracking and stage progression (`/dashboard/recruiter/applicants`).
  - Company branding and profile setup (`/dashboard/recruiter/company`).
- **👑 Administrator (`/dashboard/admin`)**:
  - Platform-wide overview, user analytics, and revenue metrics.
  - Global user management (`/dashboard/admin/users`) with dynamic role assignment (Seeker, Recruiter, Admin).
  - Global job moderation and deletion (`/dashboard/admin/jobs`).
  - Company verification and payments log.

### 3. 🔐 Authentication & Session
- Powered by **Better-Auth** with MongoDB adapter.
- Secure email/password authentication and role persistence.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (Turbopack, App Router)
- **UI Library**: React 19, Tailwind CSS v4, Radix UI primitives (`@workspace/ui`)
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Monorepo**: Turborepo
- **Authentication**: Better-Auth (`@better-auth/mongo-adapter`)
- **Backend API**: Node.js / Express 5 (`hireloop-server`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.9.0
- npm or pnpm

### Environment Variables
Create a `.env` file in `apps/web/`:
```env
NEXT_PUBLIC_API_URL=https://hireloop-server-green-phi.vercel.app
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
```

### Installation & Development
```bash
# Install dependencies
npm install

# Run type check
npm run typecheck

# Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
hireloop-client/
├── apps/
│   └── web/
│       ├── app/
│       │   ├── (auth)/             # Authentication pages (sign-in, sign-up)
│       │   ├── checkout/           # Stripe payment simulation
│       │   ├── dashboard/          # Role-based dashboards (admin, recruiter, seeker)
│       │   ├── jobs/               # Public job browse & details
│       │   ├── pricing/            # Subscription plans
│       │   └── page.tsx            # Landing page
│       ├── components/             # App-specific UI components & layouts
│       └── lib/                    # Auth client & helpers
└── packages/
    ├── ui/                         # Shared UI component library
    ├── eslint-config/              # Shared ESLint configuration
    └── typescript-config/          # Shared TypeScript configuration
```
