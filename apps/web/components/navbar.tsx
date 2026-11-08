"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Briefcase,
  Building2,
  Compass,
  CreditCard,
  LogOut,
  Menu,
  Search,
  User,
  ChevronDown,
} from "lucide-react"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { Avatar } from "@workspace/ui/components/avatar"
import { Input } from "@workspace/ui/components/input"
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetBody,
  SheetFooter,
} from "@workspace/ui/components/sheet"
import { useSession, signOut } from "@/lib/auth-client"

interface NavLinkItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navLinks: NavLinkItem[] = [
  { label: "Browse Jobs", href: "/jobs", icon: Compass },
  { label: "Company", href: "/companies", icon: Building2 },
  { label: "Pricing", href: "/pricing", icon: CreditCard },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session, isPending } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false)

  React.useEffect(() => {
    setMobileMenuOpen(false)
    setUserDropdownOpen(false)
  }, [pathname])

  // Don't render public navbar on dashboard or dedicated checkout flow
  if (pathname?.startsWith("/dashboard") || pathname === "/checkout") {
    return null
  }

  const user = session?.user

  return (
    <>
      <header className="sticky top-0 z-50 w-full pt-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-[#0c0d12]/90 px-5 sm:px-8 shadow-2xl backdrop-blur-xl transition-all">
          {/* Left: Logo from images folder */}
          <Link
            href="/"
            className="flex items-center transition-transform active:scale-95 shrink-0"
          >
            <img
              src="/images/logo.png"
              alt="HireLoop"
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </Link>

          {/* Right Section: Desktop Links + Divider + Auth / CTA */}
          <div className="hidden md:flex items-center gap-7">
            {/* Nav Links */}
            <nav className="flex items-center gap-7">
              {navLinks.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? "text-white font-semibold"
                        : "text-zinc-300 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Vertical Separator */}
            <span className="h-4 w-[1px] bg-white/20" />

            {/* Auth / Action */}
            {isPending ? (
              <div className="h-9 w-28 animate-pulse rounded-xl bg-white/5" />
            ) : user ? (
              /* User Dropdown */
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 pr-2.5 text-sm font-medium text-white transition-all hover:bg-white/10"
                >
                  <Avatar
                    alt={user.name || "User"}
                    fallback={user.name ? user.name[0]?.toUpperCase() : "U"}
                    className="size-7 bg-[#5252ff] text-white"
                  />
                  <span className="max-w-[110px] truncate text-xs font-semibold">
                    {user.name || user.email}
                  </span>
                  <ChevronDown className="h-3 w-3 text-zinc-400" />
                </button>

                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-[#12131a] p-2 text-white shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="border-b border-white/10 px-2 py-2">
                        <p className="truncate text-xs font-semibold">{user.name || "User"}</p>
                        <p className="truncate text-[11px] text-zinc-400">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
                        >
                          <User className="h-3.5 w-3.5 text-zinc-400" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          href="/dashboard/seeker/applications"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
                        >
                          <Briefcase className="h-3.5 w-3.5 text-zinc-400" />
                          <span>My Applications</span>
                        </Link>
                      </div>
                      <div className="border-t border-white/10 pt-1">
                        <button
                          type="button"
                          onClick={async () => {
                            setUserDropdownOpen(false)
                            await signOut()
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Public Links (Screenshot matching: Sign In + Get Started) */
              <div className="flex items-center gap-5">
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-[#818cf8] hover:text-[#a5b4fc] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    variant: "brand",
                    size: "default",
                    className:
                      "h-10 px-5 rounded-xl font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]",
                  })}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Trigger (shadcn Button) */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-9 w-9 rounded-xl border border-white/10 text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (shadcn Sheet) */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} side="right">
        <SheetHeader className="border-white/10 bg-[#0c0d12]">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center"
          >
            <img
              src="/images/logo.png"
              alt="HireLoop"
              className="h-7 w-auto object-contain"
            />
          </Link>
          <SheetClose onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-white" />
        </SheetHeader>

        <SheetBody className="bg-[#0c0d12] text-white space-y-5">
          {/* Search Input (shadcn Input) */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search jobs, skills, or companies..."
              className="pl-8 text-xs border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus-visible:border-[#5252ff]"
            />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl p-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/10 text-white font-semibold"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 text-[#818cf8]" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </SheetBody>

        <SheetFooter className="border-white/10 bg-[#0c0d12] p-4">
          {user ? (
            <div className="space-y-3 w-full">
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5">
                <Avatar
                  alt={user.name || "User"}
                  fallback={user.name ? user.name[0]?.toUpperCase() : "U"}
                  className="size-8 bg-[#5252ff] text-white"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate text-white">{user.name || "User"}</p>
                  <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                </div>
              </div>
              <Button
                variant="destructive"
                className="w-full justify-center gap-2 text-xs h-9"
                onClick={async () => {
                  setMobileMenuOpen(false)
                  await signOut()
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-2 w-full">
              <Link
                href="/sign-up"
                onClick={() => setMobileMenuOpen(false)}
                className={buttonVariants({
                  variant: "brand",
                  className: "w-full justify-center h-10 text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30",
                })}
              >
                Get Started
              </Link>
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full justify-center h-10 border-white/15 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl",
                })}
              >
                Sign In
              </Link>
            </div>
          )}
        </SheetFooter>
      </Sheet>
    </>
  )
}
