"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrustScoreTrend } from "@/features/dashboard"
import { getTrustProgress, trustLevelCopy } from "@/lib/trust"
import { useAppStore } from "@/store/use-app-store"

const TrustScorePage = () => {
  const { user, trustFactors } = useAppStore()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Trust score</h1>
          <p className="text-muted-foreground">
            Score controls payout order, voting weight, and Mavapay settlement limits.
          </p>
        </div>
        <Badge variant="secondary">{user.trustLevel}</Badge>
      </div>

      <Card className="border-primary/40 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-4xl font-semibold">{user.trustScore}</CardTitle>
          <p className="text-sm text-muted-foreground">{trustLevelCopy[user.trustLevel]}</p>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={getTrustProgress(user.trustScore)} />
          <p className="text-xs text-muted-foreground">Score destination: 1000 pts</p>
        </CardContent>
      </Card>

      <TrustScoreTrend />

      <Card>
        <CardHeader>
          <CardTitle>Score components</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {trustFactors.map((factor) => (
            <div key={factor.id} className="rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{factor.weight}% weight</p>
                  <p className="text-lg font-semibold">{factor.label}</p>
                </div>
                <Badge variant="outline">{factor.score} pts</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{factor.description}</p>
              <div className="mt-4 space-y-2">
                <Progress value={(factor.score / (factor.weight * 10)) * 100} />
                <p className="text-xs text-muted-foreground">{factor.suggestion}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default TrustScorePage

