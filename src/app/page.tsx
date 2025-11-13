import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-semibold">
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs uppercase tracking-wide text-primary">
              Lightning
            </span>
            <span>ROSCA Platform</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
            <Link className="hover:text-foreground" href="/dashboard">
              Dashboard
            </Link>
            <Link className="hover:text-foreground" href="/groups">
              Groups
            </Link>
            <Link className="hover:text-foreground" href="/trust-score">
              Trust Score
            </Link>
            <Link className="hover:text-foreground" href="/payments">
              Payments
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-10 px-4 py-16 text-center">
        <div className="space-y-8 rounded-3xl border bg-card p-10 shadow-xl">
          <Badge variant="secondary" className="px-4 py-1 text-sm">
            Lightning-Powered ROSCA Platform
          </Badge>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Pool savings, move sats instantly, and unlock payouts by trust.
          </h1>
          <p className="text-lg text-muted-foreground">
            Join transparent ROSCAs with Bitcoin&apos;s Lightning Network and automate payouts via Mavapay.
            Manage groups, votes, and payouts from a modern fintech dashboard.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/login">Sign in to dashboard</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/register">Create a free account</Link>
            </Button>
          </div>
        </div>
        <div className="grid w-full gap-4 text-left md:grid-cols-3">
          {[
            { label: "Lightning-native contributions", value: "Instant invoices & QR" },
            { label: "Trust scoring (0–1000)", value: "Voting + payout priority" },
            { label: "Mavapay settlement", value: "Swap sats to local currency" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border bg-card/80 p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-1 font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
