"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/store/use-app-store"
import { Checkbox } from "@/components/ui/checkbox"

const LoginPage = () => {
  const { user, linkMavapay } = useAppStore()
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [walletId, setWalletId] = useState(user.mavapayWalletId ?? "")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4 py-12">
      <div className="grid w-full max-w-4xl gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Use your email or phone plus a password to sign in.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email or phone</Label>
              <Input id="email" placeholder="you@lightning.africa" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal">
                Keep me signed in
              </Label>
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={() => setOtpSent(true)}>Send OTP</Button>
              <Button asChild variant="outline">
                <Link href="/register">Need an account? Register</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>OTP Verification</CardTitle>
              <CardDescription>Mock step – enter any 6 digits.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">One-time passcode</Label>
                <Input
                  id="otp"
                  maxLength={6}
                  disabled={!otpSent}
                  placeholder="123456"
                  onChange={(event) => setOtpVerified(event.target.value.length === 6)}
                />
              </div>
              <Alert variant={otpVerified ? "default" : "destructive"}>
                <AlertTitle>{otpVerified ? "Verified" : "Awaiting code"}</AlertTitle>
                <AlertDescription>
                  {otpVerified
                    ? "OTP accepted. You can proceed to the dashboard."
                    : "Enter the 6-digit OTP sent via SMS or email to continue."}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Link Mavapay wallet</CardTitle>
              <CardDescription>Connect to swap Lightning payouts to local currency.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant={user.mavapayLinked ? "secondary" : "destructive"}>
                {user.mavapayLinked ? "Wallet linked" : "Wallet not linked"}
              </Badge>
              <div className="space-y-2">
                <Label htmlFor="wallet">Wallet ID</Label>
                <Input
                  id="wallet"
                  placeholder="MAVA-1234-56"
                  value={walletId}
                  onChange={(event) => setWalletId(event.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => walletId.trim() && linkMavapay(walletId.trim())}
              >
                Save wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

