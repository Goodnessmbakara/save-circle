"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAppStore } from "@/store/use-app-store"

const VotingPage = () => {
  const params = useParams<{ id: string }>()
  const { votes, submitVote, getGroupById } = useAppStore()
  const group = getGroupById(params.id)
  const groupVotes = votes.filter((vote) => vote.groupId === params.id)

  if (!group) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Group not found</AlertTitle>
          <AlertDescription>Double-check the URL or return to the groups page.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase text-muted-foreground">Voting</p>
        <h1 className="text-2xl font-semibold">{group.name}</h1>
        <p className="text-muted-foreground">
          Approve or reject pending join requests. Admin approval happens after the threshold is met.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business rules</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[
            "Need at least 60% approval.",
            "Votes editable until the 7-day deadline.",
            "Admin has final approval authority.",
          ].map((rule) => (
            <div key={rule} className="rounded-xl border p-4 text-sm text-muted-foreground">
              {rule}
            </div>
          ))}
        </CardContent>
      </Card>

      {groupVotes.length === 0 ? (
        <Alert>
          <AlertTitle>No active votes</AlertTitle>
          <AlertDescription>All member applications have been resolved.</AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4">
          {groupVotes.map((vote) => {
            const progress = Math.round((vote.approvals / vote.totalVoters) * 100)
            return (
              <Card key={vote.id}>
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                  <div>
                    <CardTitle>{vote.applicantName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{vote.applicantRole}</p>
                  </div>
                  <Badge>{vote.trustScore} trust pts</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{vote.summary}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        Approvals: {vote.approvals}/{vote.totalVoters}
                      </span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Deadline: {vote.deadline} · Requires {vote.requiredPercentage}% approval
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => submitVote(vote.id, "approve")}>
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => submitVote(vote.id, "reject")}>
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default VotingPage

