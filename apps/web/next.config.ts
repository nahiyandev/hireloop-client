import type { NextConfig } from "next"
import path from "path"
import dotenv from "dotenv"

// Automatically load the root .env file created by the user
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") })
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  env: {
    NEXT_PUBLIC_BETTER_AUTH_URL:
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
      process.env.BETTER_AUTH_URL ||
      "http://localhost:3000",
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5000",
  },
}

export default nextConfig
