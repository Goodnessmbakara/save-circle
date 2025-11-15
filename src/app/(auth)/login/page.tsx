"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { login, verifyOtp } from "@/api/auth"
import { Clock, CheckCircle2, AlertCircle } from "lucide-react"

const LoginPage = () => {
  const router = useRouter()
  const { user, linkMavapay, setUser, fetchUser } = useAppStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [walletId, setWalletId] = useState(user?.mavapayWalletId ?? "")

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  useEffect(() => {
    if (otp.length === 6 && otpSent && !otpVerified) {
      handleVerifyOtp()
    }
  }, [otp])

  const handleSendOtp = async () => {
    if (!email || !password) {
      return
    }
    setLoading(true)
    setOtpError(null)
    try {
      const result = await login({ email, password })
      if (result.user) {
        setUser(result.user)
      }
      setOtpSent(true)
      setResendCooldown(60)
    } catch (error: any) {
      setOtpError(
        error.response?.data?.message || "Failed to send OTP. Please try again.",
      )
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return
    setLoading(true)
    setOtpError(null)
    try {
      const result = await verifyOtp(otp)
      if (result.success) {
        // Fetch user data after successful OTP verification
        await fetchUser()
        setOtpVerified(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        setOtpError("Invalid OTP. Please try again.")
        setOtp("")
      }
    } catch (error: any) {
      setOtpError(
        error.response?.data?.message || "Verification failed. Please try again.",
      )
      setOtp("")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return
    await handleSendOtp()
  }

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
              <Input
                id="email"
                type="email"
                placeholder="you@lightning.africa"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || otpSent}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || otpSent}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !otpSent) {
                    handleSendOtp()
                  }
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" disabled={loading || otpSent} />
              <Label htmlFor="remember" className="text-sm font-normal">
                Keep me signed in
              </Label>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSendOtp}
                disabled={!email || !password || loading || otpSent}
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
              <Button asChild variant="outline" disabled={loading || otpSent}>
                <Link href="/register">Need an account? Register</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>OTP Verification</CardTitle>
              <CardDescription>
                Enter the 6-digit code sent to {email || "your email/phone"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">One-time passcode</Label>
                <Input
                  id="otp"
                  maxLength={6}
                  disabled={!otpSent || loading || otpVerified}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "")
                    setOtp(value)
                    setOtpError(null)
                  }}
                  className="text-center text-2xl tracking-widest"
                />
                {otpSent && !otpVerified && (
                  <div className="flex items-center justify-between text-xs">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || loading}
                    >
                      {resendCooldown > 0 ? (
                        <>
                          <Clock className="mr-1 h-3 w-3" />
                          Resend in {resendCooldown}s
                        </>
                      ) : (
                        "Resend OTP"
                      )}
                    </Button>
                  </div>
                )}
              </div>
              {otpError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{otpError}</AlertDescription>
                </Alert>
              )}
              {otpVerified && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Verified</AlertTitle>
                  <AlertDescription>
                    OTP accepted. Redirecting to dashboard...
                  </AlertDescription>
                </Alert>
              )}
              {!otpSent && (
                <Alert variant="destructive">
                  <AlertTitle>Awaiting OTP</AlertTitle>
                  <AlertDescription>
                    Enter your credentials above and click "Send OTP" to receive a verification
                    code.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Link Mavapay wallet</CardTitle>
              <CardDescription>Connect to swap Lightning payouts to local currency.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant={user?.mavapayLinked ? "secondary" : "destructive"}>
                {user?.mavapayLinked ? "Wallet linked" : "Wallet not linked"}
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
                onClick={async () => {
                  if (walletId.trim()) {
                    try {
                      await linkMavapay(walletId.trim())
                      await fetchUser()
                    } catch (error) {
                      console.error("Failed to link wallet:", error)
                    }
                  }
                }}
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

