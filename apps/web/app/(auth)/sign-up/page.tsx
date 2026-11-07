"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Briefcase, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, User, UserCheck } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { toast } from "@workspace/ui/components/sonner"
import { signUp, signIn } from "@/lib/auth-client"

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [formData, setFormData] = React.useState({
    role: "seeker" as "seeker" | "recruiter" | "admin",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleRoleChange = (role: "seeker" | "recruiter" | "admin") => {
    setFormData((prev) => ({ ...prev, role }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password Mismatch", {
        description: "Passwords do not match. Please re-enter them.",
      })
      return
    }

    if (formData.password.length < 8) {
      toast.error("Weak Password", {
        description: "Password must be at least 8 characters long.",
      })
      return
    }

    setIsLoading(true)
    try {
      const res = await (signUp.email as any)({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        selectedRole: formData.role,
        accountType: formData.role,
      })

      if (res.error) {
        toast.error("Sign Up Failed", {
          description: res.error.message || "Failed to create account. Please check your info.",
        })
        return
      }

      toast.success("Account Created!", {
        description: `Welcome to HireLoop, ${formData.name}! (${formData.role.toUpperCase()})`,
      })

      const targetPath =
        formData.role === "admin"
          ? "/admin"
          : formData.role === "recruiter"
          ? "/dashboard"
          : "/jobs"
      router.push(targetPath)
      router.refresh()
    } catch (err: any) {
      toast.error("Registration Error", {
        description: err?.message || "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      const targetPath =
        formData.role === "admin"
          ? "/admin"
          : formData.role === "recruiter"
          ? "/dashboard"
          : "/jobs"
      await signIn.social({
        provider: "google",
        callbackURL: targetPath,
      })
    } catch (err: any) {
      toast.error("Google Sign Up Error", {
        description: err?.message || "Could not sign up with Google.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border border-white/10 bg-[#0c0d12]/90 shadow-2xl backdrop-blur-xl">
      <CardHeader className="space-y-1.5 text-center pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          Create your account
        </CardTitle>
        <CardDescription className="text-xs text-zinc-400">
          Get started with HireLoop to find or post world-class tech jobs
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Role Selector: Seeker | Recruiter | Admin */}
        <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-white/10 bg-white/2 p-1">
          <button
            type="button"
            onClick={() => handleRoleChange("seeker")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 px-1 text-xs font-semibold transition-all ${
              formData.role === "seeker"
                ? "bg-[#665df5] text-white shadow-md shadow-indigo-600/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <UserCheck className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Seeker</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("recruiter")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 px-1 text-xs font-semibold transition-all ${
              formData.role === "recruiter"
                ? "bg-[#665df5] text-white shadow-md shadow-indigo-600/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Briefcase className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Recruiter</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("admin")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 px-1 text-xs font-semibold transition-all ${
              formData.role === "admin"
                ? "bg-[#665df5] text-white shadow-md shadow-indigo-600/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Admin</span>
          </button>
        </div>

        {/* Social Auth (Google) */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignUp}
          className="w-full justify-center gap-3 h-11 border-white/10 bg-white/3 hover:bg-white/10 text-white font-medium text-sm rounded-xl transition-all"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-1.9.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.4 7.5 23 12 23z"
            />
          </svg>
          <span>Sign up with Google</span>
        </Button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-white/10" />
          <span className="absolute bg-[#0c0d12] px-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            or register with email
          </span>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-300"
            >
              Full name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Sterling"
                className="h-11 pl-10 border-white/10 bg-white/2 text-white placeholder:text-zinc-500 rounded-xl focus:border-[#665df5] focus:ring-[#665df5]/20 text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-300"
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="h-11 pl-10 border-white/10 bg-white/2 text-white placeholder:text-zinc-500 rounded-xl focus:border-[#665df5] focus:ring-[#665df5]/20 text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-300"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className="h-11 pl-10 pr-10 border-white/10 bg-white/2 text-white placeholder:text-zinc-500 rounded-xl focus:border-[#665df5] focus:ring-[#665df5]/20 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-300"
            >
              Confirm password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="h-11 pl-10 pr-10 border-white/10 bg-white/2 text-white placeholder:text-zinc-500 rounded-xl focus:border-[#665df5] focus:ring-[#665df5]/20 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start space-x-2 pt-1">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              required
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-[#665df5] accent-[#665df5] focus:ring-0 focus:ring-offset-0"
            />
            <label
              htmlFor="agreeToTerms"
              className="text-xs font-normal text-zinc-400 cursor-pointer select-none leading-relaxed"
            >
              I agree to the{" "}
              <Link href="/terms" className="text-zinc-300 underline hover:text-white">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-zinc-300 underline hover:text-white">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="brand"
            disabled={isLoading}
            className="w-full justify-center gap-2 h-11 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] mt-3 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Toggle to Sign In */}
        <div className="pt-2 text-center text-xs text-zinc-400">
          <span>Already have an account? </span>
          <Link
            href="/sign-in"
            className="font-semibold text-[#818cf8] hover:text-[#a5b4fc] transition-colors hover:underline"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
