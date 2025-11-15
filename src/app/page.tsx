import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Bolt,
  Shield,
  Users,
  TrendingUp,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3 font-semibold text-black">
            <Image
              src="/save-circle-logo.png"
              alt="Save Circle logo"
              width={48}
              height={48}
              priority
              className="h-12 w-12 object-contain"
            />
            <span className="text-lg">Save Circle</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-black">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src="https://cdn.sp-assets.net/videos/hero-v8-desktop.mp4" type="video/mp4" />
          </video>
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40 z-10" />
          
          <div className="container mx-auto px-4 py-20 relative z-20">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                Lightning-Powered ROSCA Platform
              </Badge>
              <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white">
                Savings you control,{" "}
                <span className="text-white">payouts in seconds</span>
              </h1>
              <p className="mb-10 text-lg text-white/90 md:text-xl lg:text-2xl">
                Digitize traditional African savings groups with Bitcoin's Lightning Network.
                Join trusted ROSCAs, contribute via instant Lightning payments, and build your
                financial reputation through transparent trust scores.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-black hover:bg-white/90 text-base px-8 py-6">
                    Start saving now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/groups">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 text-base px-8 py-6">
                    Browse groups
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl text-black">
                Built for trust and transparency
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Everything you need to manage ROSCAs digitally, securely, and transparently.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Bolt className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Lightning Payments</CardTitle>
                  <CardDescription>
                    Instant, low-cost Bitcoin payments via the Lightning Network. No delays, no
                    high fees.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Trust Score System</CardTitle>
                  <CardDescription>
                    Build your financial reputation through transparent trust scores. Higher scores
                    mean earlier payouts.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Member Approval</CardTitle>
                  <CardDescription>
                    Democratic member approval system. Members vote on new joiners with 60%
                    threshold required.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Instant Payouts</CardTitle>
                  <CardDescription>
                    Receive payouts directly to your Mavapay wallet. Automatic ordering by trust
                    score ensures fairness.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Financial Reputation</CardTitle>
                  <CardDescription>
                    Every contribution builds your trust score. Timely payments, peer ratings, and
                    transaction history all factor in.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Transparency First</CardTitle>
                  <CardDescription>
                    All transactions are recorded on-chain. Immutable records, verifiable
                    contributions, and complete transparency.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section className="border-b bg-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl text-black">
                How it works
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4 text-left">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-black">Join or create a group</h3>
                    <p className="text-gray-600">
                      Browse open ROSCAs or create your own. Set contribution amounts, frequency,
                      and member limits. Apply to join groups that match your goals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-left">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-black">Get approved by members</h3>
                    <p className="text-gray-600">
                      Existing members vote on your application. 60% approval is required. Your
                      trust score helps members make informed decisions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-left">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-black">Make contributions</h3>
                    <p className="text-gray-600">
                      Pay via Lightning invoices when contributions are due. Scan QR codes or copy
                      invoice strings. Payments are verified on-chain automatically.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-left">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-black">Build trust, get paid</h3>
                    <p className="text-gray-600">
                      Timely contributions improve your trust score. Payouts are ordered by trust
                      score, so reliable members get paid first. Receive funds directly to your
                      Mavapay wallet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl">
              <Card className="border-primary/40 bg-white">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-black">Ready to get started?</CardTitle>
                  <CardDescription className="text-base text-gray-600">
                    Join thousands of users building financial resilience through Lightning ROSCAs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {[
                      "No credit checks required",
                      "Transparent trust scores",
                      "Instant Lightning payments",
                      "Mavapay wallet integration",
                      "Member-controlled groups",
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <span className="text-black">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                    <Link href="/register" className="flex-1">
                      <Button size="lg" className="w-full">
                        Create account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/groups" className="flex-1">
                      <Button size="lg" variant="outline" className="w-full">
                        Browse groups
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Image
                src="/save-circle-logo.png"
                alt="Save Circle logo"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
              <span className="text-sm font-medium text-black">Save Circle</span>
            </div>
            <p className="text-sm text-gray-600">
              Powered by Bitcoin Lightning Network
            </p>
            <div className="flex gap-4 text-sm text-gray-600">
              <Link href="/login" className="hover:text-black">
                Sign In
              </Link>
              <Link href="/register" className="hover:text-black">
                Register
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
