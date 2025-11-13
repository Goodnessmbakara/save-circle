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

const RegisterPage = () => {
  const { user, linkMavapay } = useAppStore()
  const [otpReady, setOtpReady] = useState(false)
  const [walletId, setWalletId] = useState(user.mavapayWalletId ?? "")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4 py-12">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Use your email and phone to join Lightning ROSCAs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="Amelia Njoroge" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="you@lightning.africa" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" placeholder="+254 700 555 222" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Create a strong password" />
            </div>
            <Button onClick={() => setOtpReady(true)}>Register &amp; send OTP</Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link className="text-primary underline" href="/login">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>OTP verification</CardTitle>
              <CardDescription>Final step before activating your wallet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="otp">6-digit code</Label>
                <Input id="otp" maxLength={6} disabled={!otpReady} placeholder="••••••" />
              </div>
              <Alert variant={otpReady ? "default" : "destructive"}>
                <AlertTitle>{otpReady ? "OTP sent" : "Complete registration first"}</AlertTitle>
                <AlertDescription>
                  {otpReady
                    ? "Enter the OTP received by SMS to activate your account."
                    : "Fill out the registration form, then request your OTP."}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mavapay wallet</CardTitle>
              <CardDescription>Connect your settlement wallet for local payouts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant={user.mavapayLinked ? "secondary" : "destructive"}>
                {user.mavapayLinked ? "Wallet linked" : "Wallet not linked"}
              </Badge>
              <div className="space-y-2">
                <Label htmlFor="wallet">Wallet ID</Label>
                <Input
                  id="wallet"
                  value={walletId}
                  placeholder="MAVA-4451-10"
                  onChange={(event) => setWalletId(event.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => walletId.trim() && linkMavapay(walletId.trim())}
              >
                Link wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

