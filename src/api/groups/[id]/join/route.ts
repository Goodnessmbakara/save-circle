// app/api/groups/[id]/join/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { authenticateToken } from '@/lib/auth'
import { AuthenticatedRequest, ApiResponse } from '@/lib/types'

interface RouteParams {
  params: {
    id: string
  }
}

const POST = authenticateToken(async (req: AuthenticatedRequest, { params }: RouteParams): Promise<NextResponse<ApiResponse>> => {
  try {
    const { id } = params
    const userId = req.userId

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        members: true
      }
    })

    if (!group) {
      return NextResponse.json(
        { success: false, message: 'Group not found' },
        { status: 404 }
      )
    }

    if (!group.isOpen) {
      return NextResponse.json(
        { success: false, message: 'Group is not accepting new members' },
        { status: 400 }
      )
    }

    // Check if user is already a member
    const existingMember = await prisma.groupMember.findFirst({
      where: {
        userId,
        groupId: id
      }
    })

    if (existingMember) {
      return NextResponse.json(
        { success: false, message: 'You are already a member of this group' },
        { status: 400 }
      )
    }

    // Check if group is full
    const approvedMembers = group.members.filter((m: any) => m.status === 'APPROVED')
    if (approvedMembers.length >= group.memberCap) {
      return NextResponse.json(
        { success: false, message: 'Group is full' },
        { status: 400 }
      )
    }

    // Create membership request
    const member = await prisma.groupMember.create({
      data: {
        userId,
        groupId: id,
        status: 'PENDING'
      },
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
    })

    return NextResponse.json({
      success: true,
      message: 'Join request submitted successfully',
      data: { member }
    }, { status: 201 })

  } catch (error) {
    console.error('Join group error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
})

export { POST }