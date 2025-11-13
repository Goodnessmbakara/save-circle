"use client"

import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/store/use-app-store"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { JoinGroupDialog } from "@/components/join-group-dialog"

const GroupDetailsPage = () => {
  const params = useParams<{ id: string }>()
  const { getGroupById, user, payments, votes } = useAppStore()
  const [showJoinDialog, setShowJoinDialog] = useState(false)
  const group = getGroupById(params.id)

  if (!group) {
    return notFound()
  }

  const isMember = user.memberGroupIds.includes(group.id)
  const isAdmin = user.adminGroupIds.includes(group.id)
  const groupVotes = votes.filter((vote) => vote.groupId === group.id && vote.status === "pending")
  const groupPayments = payments.filter((payment) => payment.groupId === group.id)
  const nextPayout = group.nextPayoutDate

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase text-muted-foreground">Group</p>
          <h1 className="text-3xl font-semibold">{group.name}</h1>
          <p className="text-muted-foreground">{group.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isMember && (
            <Button onClick={() => setShowJoinDialog(true)}>Request to join</Button>
          )}
          {isAdmin && (
            <Button variant="outline">Manage group</Button>
          )}
          {groupVotes.length > 0 && (
            <Button asChild variant="secondary">
              <Link href={`/groups/${group.id}/voting`}>Open voting</Link>
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="grid gap-4 px-6 py-4 md:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Contribution</p>
            <p className="text-lg font-semibold">{group.contributionAmountBtc} BTC</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Frequency</p>
            <p className="text-lg font-semibold">{group.frequency}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Next payout</p>
            <p className="text-lg font-semibold">{nextPayout}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <Badge variant={group.status === "Open" ? "secondary" : "outline"}>{group.status}</Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cycles">Cycles</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          {groupVotes.length > 0 && <TabsTrigger value="voting">Voting</TabsTrigger>}
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-lg font-semibold">{group.durationWeeks} weeks</p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Members</p>
                  <p className="text-lg font-semibold">
                    {group.membersCount}/{group.memberCap}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Rules</p>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  {group.rules.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cycles">
          <Card>
            <CardHeader>
              <CardTitle>Cycle management</CardTitle>
              <p className="text-sm text-muted-foreground">{group.cycleStatus}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Current cycle</p>
                  <p className="text-2xl font-semibold">
                    {group.cycleStatus.includes("Cycle") 
                      ? group.cycleStatus.match(/Cycle (\d+)/)?.[1] || "1"
                      : "1"}
                  </p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Total cycles</p>
                  <p className="text-2xl font-semibold">
                    {Math.ceil(group.durationWeeks / (group.frequency === "Weekly" ? 1 : 4))}
                  </p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <p className="text-2xl font-semibold">
                    {Math.round(
                      ((group.membersCount / group.memberCap) * 100)
                    )}%
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold mb-3">Payout order</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Payouts are ordered by trust score (highest first). Members receive payouts in
                    rotation order.
                  </p>
                  <div className="space-y-2">
                    {group.members
                      .sort((a, b) => b.trustScore - a.trustScore)
                      .map((member, index) => (
                        <div
                          key={member.id}
                          className={`flex items-center justify-between rounded-lg border p-3 ${
                            index === 0 ? "bg-primary/5 border-primary/40" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Trust score: {member.trustScore}
                              </p>
                            </div>
                          </div>
                          {index === 0 && (
                            <Badge variant="secondary">Next payout</Badge>
                          )}
                        </div>
                      ))}
                  </div>
                </div>

                <div className="rounded-lg border p-4 bg-muted/40">
                  <p className="text-sm font-semibold mb-2">Cycle timeline</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Cycle start</span>
                      <span className="font-medium">{group.nextContributionDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Next payout</span>
                      <span className="font-medium">{group.nextPayoutDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Frequency</span>
                      <span className="font-medium">{group.frequency}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Member roster</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Trust score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last contribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.trustScore}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            member.contributionStatus === "On-time"
                              ? "secondary"
                              : member.contributionStatus === "Late"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {member.contributionStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{member.lastContribution}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        {groupVotes.length > 0 && (
          <TabsContent value="voting">
            <Card>
              <CardHeader>
                <CardTitle>Pending applications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {groupVotes.map((vote) => {
                  const progress = Math.round((vote.approvals / vote.totalVoters) * 100)
                  return (
                    <div key={vote.id} className="space-y-3 rounded-xl border p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold">{vote.applicantName}</p>
                          <p className="text-sm text-muted-foreground">{vote.applicantRole}</p>
                        </div>
                        <Badge>{vote.trustScore} trust score</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{vote.summary}</p>
                      <div className="text-xs text-muted-foreground">
                        Deadline: {vote.deadline} · Requires {vote.requiredPercentage}% approval
                      </div>
                      <Alert>
                        <AlertTitle>Status</AlertTitle>
                        <AlertDescription>
                          {vote.approvals} approvals · {vote.rejections} rejections ({progress}% achieved)
                        </AlertDescription>
                      </Alert>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>
        )}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Due date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.dueDate}</TableCell>
                      <TableCell>{payment.amountBtc} BTC</TableCell>
                      <TableCell>
                        <Badge variant={payment.status === "Paid" ? "secondary" : "outline"}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{payment.invoice.slice(0, 12)}...</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <JoinGroupDialog group={group} open={showJoinDialog} onOpenChange={setShowJoinDialog} />
    </div>
  )
}

export default GroupDetailsPage
