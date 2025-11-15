// app/api/auth/me/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { authenticateToken } from '@/lib/auth'
import { AuthenticatedRequest, ApiResponse } from '@/lib/types'

const GET = authenticateToken(async (req: AuthenticatedRequest): Promise<NextResponse<ApiResponse>> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        mavapayWalletId: true,
        trustScore: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        groupsCreated: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    trustScore: true
                  }
                }
              }
            }
          }
        },
        groupMembers: {
          include: {
            group: {
              include: {
                admin: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User profile retrieved successfully', // Add message here
      data: { user }
    })

  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
})

export { GET }