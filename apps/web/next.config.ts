import type { NextConfig } from "next"
import path from "path"
import dotenv from "dotenv"

// Automatically load the root .env file created by the user
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") })
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  env: {
    NEXT_PUBLIC_BETTER_AUTH_URL:
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
      process.env.BETTER_AUTH_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""),
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      (isProd ? "https://hireloop-server-green-phi.vercel.app" : "http://localhost:5000"),
  },
}

export default nextConfig
