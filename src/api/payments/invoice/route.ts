// app/api/payments/invoice/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { authenticateToken } from '@/lib/auth'
import { AuthenticatedRequest, ApiResponse } from '@/lib/types'

const POST = authenticateToken(async (req: AuthenticatedRequest): Promise<NextResponse<ApiResponse>> => {
  try {
    const body = await req.json()
    const { groupId, cycleNumber } = body
    const userId = req.userId

    if (!groupId || !cycleNumber) {
      return NextResponse.json(
        { success: false, message: 'Group ID and cycle number are required' },
        { status: 400 }
      )
    }

    // Verify user is group member
    const member = await prisma.groupMember.findFirst({
      where: {
        userId,
        groupId,
        status: 'APPROVED'
      },
      include: {
        group: true
      }
    })

    if (!member) {
      return NextResponse.json(
        { success: false, message: 'You are not an approved member of this group' },
        { status: 403 }
      )
    }

    // Check if payment already exists and is pending
    const existingPayment = await prisma.payment.findFirst({
      where: {
        userId,
        groupId,
        cycleNumber,
        status: 'PENDING'
      }
    })

    if (existingPayment) {
      return NextResponse.json(
        { success: false, message: 'You already have a pending payment for this cycle' },
        { status: 400 }
      )
    }

    const amount = member.group.contributionAmount
    const description = `ROSCA Contribution - ${member.group.name} - Cycle ${cycleNumber}`

    // TODO: Implement Lightning invoice creation
    // For now, mock the invoice creation
    const mockInvoice = {
      request: `lnbc${amount}mockinvoice`,
      id: `payment_hash_${Date.now()}`,
      expires_at: new Date(Date.now() + 3600000).toISOString()
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        groupId,
        cycleNumber,
        amount,
        lightningInvoice: mockInvoice.request,
        paymentHash: mockInvoice.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      include: {
        group: {
          select: {
            name: true,
            contributionAmount: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Payment invoice created successfully', // Added message
      data: {
        payment,
        invoice: {
          request: mockInvoice.request,
          paymentHash: mockInvoice.id,
          expiresAt: new Date(mockInvoice.expires_at)
        }
      }
    })

  } catch (error) {
    console.error('Create invoice error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
})

export { POST }