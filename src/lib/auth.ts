// lib/auth.ts
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { AuthenticatedRequest } from './types'

// Updated to accept handlers with params
export function authenticateToken(
  handler: (req: AuthenticatedRequest, context?: any) => Promise<NextResponse>
) {
  return async (req: Request, context: any): Promise<NextResponse> => {
    try {
      const authHeader = req.headers.get('authorization')
      const token = authHeader && authHeader.split(' ')[1]

      if (!token) {
        return NextResponse.json(
          { success: false, message: 'Access token required' },
          { status: 401 }
        )
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
      const authenticatedReq = req as AuthenticatedRequest
      authenticatedReq.userId = decoded.userId

      return handler(authenticatedReq, context)
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 403 }
      )
    }
  }
}

export function generateTokens(userId: string): { accessToken: string; refreshToken: string } {
  const accessToken = jwt.sign(
    { userId }, 
    process.env.JWT_SECRET!, 
    { expiresIn: '15m' }
  )
  
  const refreshToken = jwt.sign(
    { userId }, 
    process.env.JWT_REFRESH_SECRET!, 
    { expiresIn: '7d' }
  )

  return { accessToken, refreshToken }
}