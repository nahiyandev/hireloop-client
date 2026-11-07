import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

function getBaseURL() {
  if (typeof window !== "undefined") {
    // In browser, always use current origin so requests go to /api/auth on the same domain with NO CORS issues
    return window.location.origin
  }
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return "http://localhost:3000"
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [adminClient()],
})

export const { signIn, signUp, signOut, useSession } = authClient
