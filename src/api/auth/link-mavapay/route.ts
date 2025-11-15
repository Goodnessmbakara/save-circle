// app/api/auth/link-mavapay/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { authenticateToken } from '@/lib/auth'
import { AuthenticatedRequest, ApiResponse } from '@/lib/types'

const POST = authenticateToken(async (req: AuthenticatedRequest): Promise<NextResponse<ApiResponse>> => {
  try {
    const body = await req.json()
    const { walletId } = body

    if (!walletId) {
      return NextResponse.json(
        { success: false, message: 'Wallet ID is required' },
        { status: 400 }
      )
    }

    // TODO: Verify walletId with Mavapay API
    const mavapayResponse = await verifyMavapayWallet(walletId)

    if (!mavapayResponse.valid) {
      return NextResponse.json(
        { success: false, message: 'Invalid Mavapay wallet ID' },
        { status: 400 }
      )
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { mavapayWalletId: walletId },
      select: {
        id: true,
        email: true,
        mavapayWalletId: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Mavapay wallet linked successfully',
      data: { user }
    })

  } catch (error) {
    console.error('Link Mavapay error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
})

export { POST }

// Helper function to verify Mavapay wallet
async function verifyMavapayWallet(walletId: string): Promise<{ valid: boolean; customerName?: string }> {
  // TODO: Implement actual Mavapay API call
  // For now, mock the response
  return { valid: true, customerName: 'Verified Customer' }
}