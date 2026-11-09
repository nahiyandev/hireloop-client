# 🚀 HireLoop — Modern AI-Driven Hiring Platform (Client)

HireLoop is a full-featured, modern talent acquisition and recruitment platform designed for Job Seekers, Recruiters, and Admins. Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, and Better-Auth.

---

## 🌟 Key Features

### 1. 🌐 Public Site & Job Portal
- **Browse Jobs (`/jobs`)**:
  - Full URL synchronization using Next.js `useSearchParams()` (`?q=`, `?loc=`, `?type=`, `?workplace=`, `?exp=`, `?cat=`, `?salary=`, `?sort=`, `?page=`).
  - **Comprehensive Multi-Dimensional Filter Suite**:
    - **Workplace Policy**: Remote, Hybrid, On-site with live match counters.
    - **Employment Type**: Full-time, Part-time, Contract, Freelance.
    - **Experience Level**: Entry/Junior (0-2 yrs), Mid-Level (3-5 yrs), Senior Level (5+ yrs).
    - **Department / Category**: Engineering & Tech, Design & Creative, Marketing & Growth, Customer Support.
    - **Minimum Compensation**: Filter by $30k+, $60k+, $100k+, $150k+ salary floors.
  - **Active Filter Ribbon**: Removable chips/pills for each applied filter with one-click "Clear all".
  - **Mobile Responsive Drawer**: Expandable collapsible filter panel for mobile devices.
  - Search by keywords, company name, skills, or location with instant debounce-friendly sync.
  - Dynamic salary and recency sorting.
  - Live data fetched directly from MongoDB via backend REST API.
  - Responsive pagination retaining all active filter params in the URL.
- **Job Details (`/jobs/[id]`)**:
  - Comprehensive job specifications, responsibilities, requirements, and company overview.
  - **Strict Job Seeker Application Verification**:
    - Unauthenticated visitors are guided to sign in (`/sign-in?callbackUrl=...`).
    - Recruiter and Administrator accounts are blocked with role notifications (only `seeker` accounts can apply).
    - Prevents duplicate applications with real-time "Application Submitted" status.
    - Locks candidate email to authenticated account and directly links `userId` and `jobId` in MongoDB.
  - Integrated candidate application modal with portfolio URL, LinkedIn profile, contact details, and custom cover note.
  - Persistent bookmarking (Saved Jobs) with localStorage synchronization.
- **Pricing & Checkout (`/pricing`, `/checkout`)**:
  - Multi-tier subscription plans (Free, Growth, Pro).
  - Multi-currency Stripe checkout simulation (BDT / USD).

### 2. 🛡️ Role-Based Dashboards (`/dashboard`)
Protected routes with strict role-based authorization:
- **Navigation & Top App Bar (`DashboardNavbar`)**:
  - Unified header with sleek breadcrumb navigation (`HireLoop / [Portal] / [Page Name]`), responsive sidebar trigger.
  - Resolved sidebar duplicate logo for a clean, minimalist header aesthetic.
  - Interactive quick search bar with instant query execution.
  - Quick platform shortcuts (`Browse Jobs`, `Pricing`, `Post Job` / `Admin Governance`).
  - Active role pill (`Super Admin`, `Admin`, `Recruiter`, `Seeker`) with glowing pulse indicator, real-time notification feed, and user profile dropdown with sign-out.
- **👨‍💻 Job Seeker (`/dashboard/seeker`)**:
  - **100% User-Scoped Real Data (Zero Dummy Data)**:
    - Applications pipeline strictly queried for the authenticated seeker's `email` and `userId`. A new seeker with 0 applications receives a clean empty state with a direct CTA to browse jobs instead of seeing other users' or mock applications.
    - Dynamic Profile Readiness percentage calculated on-the-fly from the user's real account setup, applications submitted, saved jobs, and career preferences.
    - User-scoped saved/bookmarked jobs (`/dashboard/seeker/saved`) preventing data leakage across different user sessions.
    - Dynamic profile settings (`/dashboard/seeker/settings`) initialized from authenticated user session with real resume document attachment.
  - Overview of job applications and statuses (Applied, Reviewing, Interviewing, Offer).
  - Saved/Bookmarked opportunities management with real-time database synchronization.
  - Profile and application history tracking.
- **💼 Recruiter (`/dashboard/recruiter`)**:
  - Post and manage job listings (`/dashboard/recruiter/jobs/new`, `/dashboard/recruiter/jobs`).
  - Quick action to view live job postings (`<Eye>` View Job preview link).
  - Applicant pipeline tracking and stage progression (`/dashboard/recruiter/applicants`).
  - Company branding and profile setup (`/dashboard/recruiter/company`).
- **👑 Administrator & Super Admin (`/dashboard/admin`)**:
  - **Super Admin Approval Workflow**:
    - New administrator registrations start in **Pending** status.
    - Pending admins are blocked from the Admin Console and directed to a dedicated status screen (`/dashboard/pending-approval`).
    - **Strict Super Admin Promotion & Approval Guard**: Only verified **Super Admins** can see and execute the **[👑 Super Admin]** promotion button and **[Approve Admin]** / **[Reject]** actions. Regular administrators are strictly restricted from granting Super Admin authority.
  - Platform-wide overview, user analytics, and revenue metrics.
  - Global user management (`/dashboard/admin/users`) with dynamic role assignment (Seeker, Recruiter, Admin, Super Admin).
  - Global job moderation and deletion (`/dashboard/admin/jobs`).
  - Company verification and payments log.

### 3. 🔐 Authentication & Session
- Powered by **Better-Auth** with MongoDB adapter.
- Secure email/password authentication and role persistence.

### 4. ⚡ 100% Dynamic Data Architecture (Zero Dummy Data)
- **All mock arrays completely eliminated**: Landing page, job portal, admin console, recruiter dashboard, and seeker portal are connected directly to live MongoDB collections.
- **Dynamic Stats & Counters**: User counts, company aggregation, revenue tallies, and filter breakdown counts are computed on-the-fly from live database collections.
- **Live State Mutations**: Real-time role changing (`PUT /users/:id/role`), user deletion (`DELETE /users/:id`), applicant stage tracking (`PATCH /applications/:id/status`), and payment recording (`POST /payments/upgrade`).
- **Resilient Fallback**: Production API defaults to `https://hireloop-server-green-phi.vercel.app` with localized environment support in `apps/web/.env.local`.

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
