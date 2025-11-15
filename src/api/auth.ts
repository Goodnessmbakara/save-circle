import { apiClient } from "./client"
import type { UserProfile } from "@/types"

interface AuthPayload {
  email: string
  password: string
  phone?: string
}

interface LoginResponse {
  user: UserProfile
  token: string
  nextStep?: string
}

interface RegisterResponse {
  user: UserProfile
  token: string
  requiresOtp: boolean
}

interface OtpResponse {
  success: boolean
  expiresAt?: string
  token?: string
}

interface LinkMavapayResponse {
  walletId: string
  linked: boolean
}

export const login = async (payload: AuthPayload): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>("/auth/login", payload)
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token)
    }
    return response.data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export const register = async (payload: AuthPayload): Promise<RegisterResponse> => {
  try {
    const response = await apiClient.post<RegisterResponse>("/auth/register", payload)
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token)
    }
    return response.data
  } catch (error) {
    console.error("Register error:", error)
    throw error
  }
}

export const verifyOtp = async (code: string): Promise<OtpResponse> => {
  try {
    const response = await apiClient.post<OtpResponse>("/auth/verify-otp", { code })
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token)
    }
    return response.data
  } catch (error) {
    console.error("OTP verification error:", error)
    throw error
  }
}

export const linkMavapay = async (walletId: string): Promise<LinkMavapayResponse> => {
  try {
    const response = await apiClient.post<LinkMavapayResponse>("/auth/link-mavapay", {
      walletId,
    })
    return response.data
  } catch (error) {
    console.error("Link Mavapay error:", error)
    throw error
  }
}

export const getCurrentUser = async (): Promise<UserProfile> => {
  try {
    const response = await apiClient.get<UserProfile>("/auth/me")
    return response.data
  } catch (error) {
    console.error("Get current user error:", error)
    throw error
  }
}

export const logout = (): void => {
  localStorage.removeItem("auth_token")
}

