"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useAppStore } from "@/store/use-app-store"
import { getPayoutQueue, requestPayout, getPayoutRequests } from "@/api/payouts"
import type { PayoutQueueEntry, PayoutRequest } from "@/types"
import { Wallet, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

const PayoutsPage = () => {
  const { user, payoutQueue, groups, fetchPayoutQueue, fetchGroups } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [selectedPayout, setSelectedPayout] = useState<PayoutQueueEntry | null>(null)
  const [requesting, setRequesting] = useState(false)
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await Promise.all([fetchPayoutQueue(), fetchGroups()])
        const requests = await getPayoutRequests()
        setPayoutRequests(requests)
      } catch (error) {
        console.error("Failed to fetch payout data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [fetchPayoutQueue, fetchGroups])

  const userPayoutQueue = useMemo(() => {
    if (!user) return []
    return payoutQueue.filter((entry) => entry.memberName === user.name)
  }, [payoutQueue, user])

  const isUserTurn = (entry: PayoutQueueEntry) => {
    return user && entry.order === 1 && entry.memberName === user.name
  }

  const calculatePayoutAmount = (group: typeof groups[0]): number => {
    const contributionAmount = group.contributionAmountBtc
    const memberCount = group.membersCount
    const totalPool = contributionAmount * memberCount
    const platformFee = totalPool * 0.01
    return totalPool - platformFee
  }

  const handleRequestPayout = async (entry: PayoutQueueEntry) => {
    if (!user || !user.mavapayLinked) {
      alert("Please link your Mavapay wallet first in your profile settings.")
      return
    }

    setSelectedPayout(entry)
    setRequesting(true)
    try {
      const group = groups.find((g) => g.id === entry.groupId)
      if (!group) return

      const amountBtc = calculatePayoutAmount(group)
      const payout = await requestPayout(entry.groupId, amountBtc)
      setPayoutRequests((prev) => [payout, ...prev])
      setSelectedPayout(null)
    } catch (error) {
      console.error("Failed to request payout:", error)
      alert("Failed to request payout. Please try again.")
    } finally {
      setRequesting(false)
    }
  }

  const getStatusIcon = (status: PayoutRequest["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "processing":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusVariant = (status: PayoutRequest["status"]) => {
    switch (status) {
      case "completed":
        return "secondary"
      case "failed":
        return "destructive"
      case "processing":
        return "default"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Payouts</h1>
        <p className="text-muted-foreground">
          Request payouts to your Mavapay wallet when it's your turn in the rotation.
        </p>
      </div>

      {user && !user.mavapayLinked && (
        <Alert variant="destructive">
          <AlertTitle>Mavapay wallet not linked</AlertTitle>
          <AlertDescription>
            Please link your Mavapay wallet in your{" "}
            <Link href="/profile" className="underline">
              profile settings
            </Link>{" "}
            to receive payouts.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your payout queue</CardTitle>
          <CardDescription>
            Your position in the payout rotation for each group. Order is determined by trust
            score.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userPayoutQueue.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              You are not currently in any payout queues.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Payout date</TableHead>
                  <TableHead>Your trust score</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userPayoutQueue.map((entry) => {
                  const group = groups.find((g) => g.id === entry.groupId)
                  const amountBtc = group ? calculatePayoutAmount(group) : 0
                  const isReady = isUserTurn(entry)

                  return (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{entry.groupName}</p>
                          {group && (
                            <p className="text-xs text-muted-foreground">
                              ~{amountBtc.toFixed(4)} BTC (~₦
                              {Math.round(amountBtc * 60000000).toLocaleString()})
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isReady ? "secondary" : "outline"}>#{entry.order}</Badge>
                      </TableCell>
                      <TableCell>{entry.payoutDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{entry.trustScore}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {isReady && user && user.mavapayLinked ? (
                          <Button
                            size="sm"
                            onClick={() => handleRequestPayout(entry)}
                            disabled={requesting}
                          >
                            {requesting ? "Requesting..." : "Request payout"}
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {!user || !user.mavapayLinked ? "Link wallet first" : "Not your turn"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payout history</CardTitle>
          <CardDescription>Track the status of your payout requests</CardDescription>
        </CardHeader>
        <CardContent>
          {payoutRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No payout requests yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Transaction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payoutRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <p className="font-medium">{request.groupName}</p>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.amountBtc.toFixed(4)} BTC</p>
                        <p className="text-xs text-muted-foreground">
                          ₦{request.amountNaira.toLocaleString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{request.feeBtc.toFixed(6)} BTC</p>
                        <p className="text-xs text-muted-foreground">
                          ₦{request.feeNaira.toLocaleString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(request.status)} className="gap-1">
                        {getStatusIcon(request.status)}
                        <span className="capitalize">{request.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(request.requestedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {request.mavapayTransactionId ? (
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {request.mavapayTransactionId.slice(0, 12)}...
                        </code>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Fee structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            Platform fee: <strong>1%</strong> per contribution
          </p>
          <p className="text-muted-foreground">
            Mavapay fees: <strong>0.75%</strong> (&lt;₦1M), <strong>0.5%</strong> (≥₦1M)
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Fees are deducted from the total pool before distribution. Mavapay fees are applied
            when converting Lightning payments to Naira.
          </p>
        </CardContent>
      </Card>

      <Dialog open={!!selectedPayout && requesting} onOpenChange={(open) => !open && setSelectedPayout(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Processing payout request</DialogTitle>
            <DialogDescription>
              Your payout request is being processed. You will receive a notification once it's
              completed.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PayoutsPage

