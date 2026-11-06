"use client"

import * as React from "react"
import Link from "next/link"
import {
  Bookmark,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  Sparkles,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"

export interface JobItem {
  id: string
  title: string
  company: string
  logo?: string
  location: string
  type: "Full-time" | "Contract" | "Part-time" | "Freelance"
  workplace: "Remote" | "Hybrid" | "On-site"
  salary: string
  category: string
  postedAt: string
  verified?: boolean
  featured?: boolean
  description?: string
}

export function JobCard({ job }: { job: JobItem }) {
  const [saved, setSaved] = React.useState(false)

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5">
      {job.featured && (
        <div className="absolute top-0 right-0">
          <div className="flex items-center gap-1 rounded-bl-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1 text-[10px] font-bold text-white shadow-xs">
            <Sparkles className="h-2.5 w-2.5" />
            <span>FEATURED</span>
          </div>
        </div>
      )}

      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          {/* Company Avatar / Logo */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-muted/50 text-foreground font-bold text-lg shadow-2xs group-hover:border-primary/30 transition-colors">
            {job.logo ? (
              <img src={job.logo} alt={job.company} className="h-full w-full rounded-xl object-cover" />
            ) : (
              <Building2 className="h-6 w-6 text-muted-foreground" />
            )}
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">{job.company}</span>
              {job.verified && (
                <span title="Verified Employer" className="inline-flex items-center">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                </span>
              )}
            </div>

            <Link href={`/jobs/${job.id}`} className="block mt-0.5">
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                {job.title}
              </h3>
            </Link>

            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{job.location}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{job.postedAt}</span>
              </span>
            </div>
          </div>

          {/* Bookmark Button */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSaved((prev) => !prev)}
            className={`rounded-full transition-colors ${
              saved
                ? "text-primary bg-primary/10 hover:bg-primary/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label={saved ? "Remove bookmark" : "Save job"}
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Tags & Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="font-medium text-[11px]">
            {job.type}
          </Badge>
          <Badge
            variant={job.workplace === "Remote" ? "success" : "outline"}
            className="font-medium text-[11px]"
          >
            {job.workplace}
          </Badge>
          <Badge variant="outline" className="font-medium text-[11px]">
            {job.category}
          </Badge>
        </div>

        {/* Footer / Compensation & Apply CTA */}
        <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
          <div className="flex items-center gap-1 font-bold text-foreground text-sm sm:text-base">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            <span>{job.salary}</span>
            <span className="text-xs font-normal text-muted-foreground">/ yr</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/jobs/${job.id}`}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "text-xs font-semibold",
              })}
            >
              Details
            </Link>
            <Link
              href={`/jobs/${job.id}/apply`}
              className={buttonVariants({
                size: "sm",
                className: "text-xs font-semibold shadow-xs",
              })}
            >
              Easy Apply
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}
