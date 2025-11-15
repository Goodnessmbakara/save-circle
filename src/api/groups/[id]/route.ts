// app/api/groups/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { authenticateToken } from '@/lib/auth'
import { AuthenticatedRequest, ApiResponse } from '@/lib/types'

interface RouteParams {
  params: {
    id: string
  }
}

const GET = authenticateToken(async (req: AuthenticatedRequest, { params }: RouteParams): Promise<NextResponse<ApiResponse>> => {
  try {
    const { id } = params

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        admin: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            trustScore: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                trustScore: true
              }
            },
            votes: {
              include: {
                voter: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true
                  }
                }
              }
            }
          }
        },
        cycles: {
          orderBy: { cycleNumber: 'desc' }
        },
        payments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!group) {
      return NextResponse.json(
        { success: false, message: 'Group not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Group retrieved successfully', // Add this message property
      data: { group }
    })

  } catch (error) {
    console.error('Get group error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
})

export { GET }