"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { register, verifyOtp } from "@/api/auth"
import { Clock, CheckCircle2, AlertCircle, Zap, Shield, Wallet } from "lucide-react"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type RegisterFormData = z.infer<typeof registerSchema>

const RegisterPage = () => {
  const router = useRouter()
  const { user, linkMavapay, setUser, fetchUser } = useAppStore()
  const {
    register: registerForm,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [walletId, setWalletId] = useState(user?.mavapayWalletId ?? "")
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
  })

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

  const handleRegister = async (data: RegisterFormData) => {
    setFormData(data)
    setLoading(true)
    setOtpError(null)
    try {
      const result = await register({
        email: data.email,
        password: data.password,
        phone: data.phone,
      })
      if (result.user) {
        setUser(result.user)
      }
      setOtpSent(true)
      setResendCooldown(60)
    } catch (error: any) {
      setOtpError(
        error.response?.data?.message || "Failed to register. Please try again.",
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
    await handleRegister(formData)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navbar */}
      <header className="bg-white/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-black">
            <Image
              src="/save-circle-logo.png"
              alt="Save Circle logo"
              width={32}
              height={32}
              priority
              className="h-8 w-8 object-contain"
            />
            <span>Save Circle</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-black">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="relative min-h-[calc(100vh-4rem)]">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-primary/5" />
          
          {/* Decorative elements */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="relative container mx-auto px-4 py-12">
            <div className="grid w-full max-w-6xl mx-auto gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Left Column - Registration Form */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tight text-black">
                    Join the Lightning Revolution
                  </h1>
                  <p className="text-lg text-gray-600">
                    Create your account and start building financial resilience with Lightning ROSCAs.
                  </p>
                </div>
                
                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Create your account</CardTitle>
                        <CardDescription>Use your email and phone to join Lightning ROSCAs.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="Amelia Njoroge"
                  {...registerForm("name")}
                  disabled={loading || otpSent}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@lightning.africa"
                  {...registerForm("email")}
                  disabled={loading || otpSent}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  placeholder="+254 700 555 222"
                  {...registerForm("phone")}
                  disabled={loading || otpSent}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  {...registerForm("password")}
                  disabled={loading || otpSent}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" disabled={isSubmitting || loading || otpSent}>
                {loading || isSubmitting ? "Registering..." : "Register & send OTP"}
              </Button>
            </form>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link className="text-primary underline" href="/login">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
              </div>

              {/* Right Column - OTP & Wallet */}
              <div className="space-y-6">
                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>OTP verification</CardTitle>
                        <CardDescription>
                          Enter the 6-digit code sent to {formData.email || formData.phone || "your email/phone"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">6-digit code</Label>
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
                    Fill out the registration form and click "Register & send OTP" to receive a
                    verification code.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Wallet className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Mavapay wallet</CardTitle>
                        <CardDescription>Connect your settlement wallet for local payouts.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant={user?.mavapayLinked ? "secondary" : "destructive"}>
                {user?.mavapayLinked ? "Wallet linked" : "Wallet not linked"}
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
                Link wallet
              </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  )
}

export default RegisterPage

