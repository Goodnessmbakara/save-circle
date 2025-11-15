"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/store/use-app-store"
import { joinGroup as joinGroupApi } from "@/api/groups"
import type { GroupSummary } from "@/types"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface JoinGroupDialogProps {
  group: GroupSummary
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const JoinGroupDialog = ({ group, open, onOpenChange }: JoinGroupDialogProps) => {
  const { user, joinGroup: joinGroupStore } = useAppStore()
  const [applicationMessage, setApplicationMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isMember = user?.memberGroupIds.includes(group.id) ?? false

  const handleSubmit = async () => {
    if (isMember) {
      onOpenChange(false)
      return
    }

    if (applicationMessage.trim().length < 10) {
      setError("Please write at least 10 characters explaining why you want to join this group.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await joinGroupApi(group.id)
      await joinGroupStore(group.id)
      setSubmitted(true)
      setTimeout(() => {
        onOpenChange(false)
        setSubmitted(false)
        setApplicationMessage("")
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit application. Please try again.")
      console.error("Failed to join group:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false)
      setApplicationMessage("")
      setError(null)
      setSubmitted(false)
    }
  }

  if (isMember) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Already a member</DialogTitle>
            <DialogDescription>You are already a member of this group.</DialogDescription>
          </DialogHeader>
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Member</AlertTitle>
            <AlertDescription>
              You are already participating in {group.name}. Visit the group page to view details.
            </AlertDescription>
          </Alert>
          <Button onClick={handleClose}>Close</Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request to join {group.name}</DialogTitle>
          <DialogDescription>
            Submit an application to join this ROSCA. Existing members will vote on your
            application.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Your trust score</span>
              <Badge>{user?.trustScore ?? 0}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Group members</span>
              <span className="font-medium">
                {group.membersCount}/{group.memberCap}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Contribution</span>
              <span className="font-medium">{group.contributionAmountBtc} BTC</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Frequency</span>
              <span className="font-medium">{group.frequency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Approval threshold</span>
              <span className="font-medium">60%</span>
            </div>
          </div>

          {submitted ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Application submitted</AlertTitle>
              <AlertDescription>
                Your application has been submitted. Members will vote on your request. You'll be
                notified when a decision is made.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="message">
                  Application message{" "}
                  <span className="text-xs text-muted-foreground">
                    (min. 10 characters)
                  </span>
                </Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={applicationMessage}
                  onChange={(e) => setApplicationMessage(e.target.value)}
                  placeholder="Tell members why you want to join this ROSCA. Mention your goals, experience with savings groups, or how you plan to contribute..."
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  {applicationMessage.length}/10 characters
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Alert>
                <AlertDescription className="text-xs">
                  <strong>How it works:</strong> Once submitted, your application will be reviewed
                  by existing group members. At least 60% of active members must approve your
                  request. The voting window is 7 days. You'll receive notifications about the
                  voting progress.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button onClick={handleSubmit} disabled={isSubmitting || applicationMessage.trim().length < 10} className="flex-1">
                  {isSubmitting ? "Submitting..." : "Submit application"}
                </Button>
                <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

