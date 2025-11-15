"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/use-app-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import type { CreateGroupPayload } from "@/types"

const steps = ["Basic info", "Parameters", "Confirmation"]

const GroupCreatePage = () => {
  const router = useRouter()
  const { createGroup } = useAppStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState<string | null>(null)
  const [payload, setPayload] = useState<CreateGroupPayload>({
    name: "",
    description: "",
    contributionAmountBtc: 0.001,
    frequency: "Weekly",
    durationWeeks: 12,
    memberCap: 10,
  })

  const progress = useMemo(() => ((currentStep + 1) / steps.length) * 100, [currentStep])

  const validate = () => {
    if (!payload.name || !payload.description) {
      return "Please provide a group name and description."
    }
    if (payload.contributionAmountBtc <= 0) {
      return "Contribution amount must be greater than 0."
    }
    if (payload.memberCap < 4) {
      return "Member cap must be at least 4."
    }
    return null
  }

  const handleNext = () => {
    const message = validate()
    if (currentStep < steps.length - 1 && message) {
      setErrors(message)
      return
    }
    setErrors(null)
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const handleCreate = async () => {
    const message = validate()
    if (message) {
      setErrors(message)
      return
    }
    try {
      const group = await createGroup(payload)
      router.push(`/groups/${group.id}`)
    } catch (error: any) {
      setErrors(error.response?.data?.message || "Failed to create group. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Create a ROSCA group</h1>
          <p className="text-muted-foreground">
            Define the contribution parameters and confirm the Lightning payout rules.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wizard</CardTitle>
          <CardDescription>{steps[currentStep]}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={progress} />
          {errors && (
            <Alert variant="destructive">
              <AlertTitle>Missing info</AlertTitle>
              <AlertDescription>{errors}</AlertDescription>
            </Alert>
          )}

          {currentStep === 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Group name</Label>
                <Input
                  id="name"
                  value={payload.name}
                  onChange={(event) => setPayload((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Lightning Maendeleo Circle"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={payload.description}
                  onChange={(event) =>
                    setPayload((prev) => ({ ...prev, description: event.target.value }))
                  }
                  placeholder="Explain the goal, payout order, and expectations."
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Contribution (BTC)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.0001"
                  min="0.0001"
                  value={payload.contributionAmountBtc}
                  onChange={(event) =>
                    setPayload((prev) => ({
                      ...prev,
                      contributionAmountBtc: Number(event.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  value={payload.frequency}
                  onValueChange={(value: CreateGroupPayload["frequency"]) =>
                    setPayload((prev) => ({ ...prev, frequency: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (weeks)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="4"
                  value={payload.durationWeeks}
                  onChange={(event) =>
                    setPayload((prev) => ({
                      ...prev,
                      durationWeeks: Number(event.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cap">Member cap</Label>
                <Input
                  id="cap"
                  type="number"
                  min="4"
                  value={payload.memberCap}
                  onChange={(event) =>
                    setPayload((prev) => ({
                      ...prev,
                      memberCap: Number(event.target.value),
                    }))
                  }
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 rounded-xl border p-4">
              <h3 className="font-semibold">Review and confirm</h3>
              <dl className="grid gap-2 text-sm md:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Name</dt>
                  <dd className="font-medium">{payload.name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Contribution</dt>
                  <dd className="font-medium">{payload.contributionAmountBtc} BTC</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Frequency</dt>
                  <dd className="font-medium">{payload.frequency}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Duration</dt>
                  <dd className="font-medium">{payload.durationWeeks} weeks</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Member cap</dt>
                  <dd className="font-medium">{payload.memberCap} people</dd>
                </div>
              </dl>
              <p className="text-sm text-muted-foreground">{payload.description}</p>
            </div>
          )}

          <div className="flex flex-wrap justify-between gap-2">
            <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0}>
              Back
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext}>Continue</Button>
            ) : (
              <Button onClick={handleCreate}>Create group</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GroupCreatePage

