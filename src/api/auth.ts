import { mockUser } from "@/data/mock-data"
import { mockRequest } from "./mock-request"

interface AuthPayload {
  email: string
  password: string
  phone?: string
}

export const login = async (payload: AuthPayload) =>
  mockRequest({
    user: mockUser,
    token: "mock-token-123",
    payload,
    nextStep: mockUser.mavapayLinked ? "dashboard" : "link-mavapay",
  })

export const register = async (payload: AuthPayload) =>
  mockRequest({
    user: mockUser,
    token: "mock-token-456",
    payload,
    requiresOtp: true,
  })

export const verifyOtp = async (code: string) =>
  mockRequest({
    success: code.length === 6,
    expiresAt: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
  })

export const linkMavapay = async (walletId: string) =>
  mockRequest({
    walletId,
    linked: true,
  })

