import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#030305] text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Logo + Body Text */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <img
                src="/images/logo.png"
                alt="HireLoop"
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm text-zinc-400 leading-relaxed">
              The AI-native career platform. Built for people who take their work seriously.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Product</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors">
                  Job discovery
                </Link>
              </li>
              <li>
                <Link href="/worker-ai" className="hover:text-white transition-colors">
                  Worker AI
                </Link>
              </li>
              <li>
                <Link href="/salaries" className="hover:text-white transition-colors">
                  Salary data
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigations */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Navigations</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Help center
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-white transition-colors">
                  Career library
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Resources</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/brand" className="hover:text-white transition-colors">
                  Brand Guideline
                </Link>
              </li>
              <li>
                <Link href="/newsroom" className="hover:text-white transition-colors">
                  Newsroom
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row text-xs text-zinc-500">
          <p>Copyright 2024 &mdash; Programming Hero</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
              Terms & Policy
            </Link>
            <span>&bull;</span>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
              Privacy Guideline
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
