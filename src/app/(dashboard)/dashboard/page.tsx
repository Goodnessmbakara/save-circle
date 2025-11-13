"use client"

import Link from "next/link"
import { CalendarDays, CircleDollarSign, UsersRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/store/use-app-store"
import { ContributionChart, StatCard, TrustScoreTrend } from "@/features/dashboard"
import { getTrustProgress } from "@/lib/trust"
import { Progress } from "@/components/ui/progress"

const DashboardPage = () => {
  const { user, groups, payments, votes } = useAppStore()
  const activeGroups = groups.filter((group) => group.status === "Open")
  const upcomingPayments = payments.filter((item) => item.status !== "Paid")
  const pendingVotes = votes.filter((vote) => vote.status === "pending")

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active groups"
          value={`${activeGroups.length} groups`}
          description="Participating + admin roles"
          icon={<UsersRound className="text-primary" />}
        />
        <StatCard
          title="Next contribution"
          value={`${user.nextContribution.amountBtc} BTC`}
          description={user.nextContribution.date}
          icon={<CalendarDays className="text-primary" />}
        />
        <StatCard
          title="Lightning settled this month"
          value="0.032 BTC"
          description="Across all ROSCAs"
          icon={<CircleDollarSign className="text-primary" />}
        />
        <Card className="border-primary/40 bg-primary/5">
          <CardHeader>
            <CardTitle>Trust score</CardTitle>
            <p className="text-2xl font-semibold">
              {user.trustScore} · {user.trustLevel}
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress value={getTrustProgress(user.trustScore)} />
            <p className="text-xs text-muted-foreground">
              Paid invoices early for +5 pts. Keep it up!
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <TrustScoreTrend />
        <ContributionChart />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming contributions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Lightning invoices auto-generate 48h before due date.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/payments">Review all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingPayments.slice(0, 3).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{payment.groupName}</p>
                  <p className="text-sm text-muted-foreground">{payment.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{payment.amountBtc} BTC</p>
                  <Badge variant={payment.status === "Pending" ? "secondary" : "destructive"}>
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending votes</CardTitle>
              <p className="text-sm text-muted-foreground">
                A 60% threshold is required before admin approval.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/groups">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingVotes.length === 0 && (
              <p className="text-sm text-muted-foreground">No open votes right now.</p>
            )}
            {pendingVotes.slice(0, 3).map((vote) => {
              const progress = Math.round((vote.approvals / vote.totalVoters) * 100)
              return (
                <div key={vote.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{vote.applicantName}</p>
                      <p className="text-sm text-muted-foreground">{vote.applicantRole}</p>
                    </div>
                    <Badge>{vote.requiredPercentage}% needed</Badge>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Approval progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage

