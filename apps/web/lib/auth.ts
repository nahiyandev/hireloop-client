import { betterAuth } from "better-auth"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { admin } from "better-auth/plugins"
import path from "path"
import dotenv from "dotenv"

// Load root .env file created by user
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") })
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const dbName = process.env.MONGODB_DB_NAME || "hireloopdb"

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
  var _mongoClient: MongoClient | undefined
}

let client: MongoClient

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri)
  }
  client = global._mongoClient
} else {
  client = new MongoClient(uri)
}

const db = client.db(dbName)

const serverBaseUrl =
  process.env.BETTER_AUTH_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  "http://localhost:3000"

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: serverBaseUrl,
  trustedOrigins: [
    "http://localhost:3000",
    "https://*.vercel.app",
    "https://hireloop-eight.vercel.app",
    serverBaseUrl,
  ].filter(Boolean),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
  user: {
    additionalFields: {
      selectedRole: {
        type: "string",
        defaultValue: "seeker",
        input: true,
      },
      accountType: {
        type: "string",
        defaultValue: "seeker",
        input: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const role =
            (user as any).selectedRole ||
            ((user as any).accountType === "employer"
              ? "recruiter"
              : (user as any).accountType) ||
            "seeker"
          return {
            data: {
              ...user,
              role: role,
              selectedRole: role,
            },
          }
        },
      },
    },
  },
  plugins: [admin()],
  database: mongodbAdapter(db, {
    client,
  }),
})
