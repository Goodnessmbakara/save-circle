// app/api/groups/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { groupValidation } from '@/lib/validation'
import { authenticateToken } from '@/lib/auth'
import { AuthenticatedRequest, ApiResponse, GroupCreateRequest } from '@/lib/types'

// Create group
const POST = authenticateToken(async (req: AuthenticatedRequest): Promise<NextResponse<ApiResponse>> => {
    try {
        const body: GroupCreateRequest = await req.json()

        const { error } = groupValidation.validate(body)
        if (error) {
            return NextResponse.json(
                { success: false, message: error.details[0].message },
                { status: 400 }
            )
        }

        const { name, description, contributionAmount, duration, frequency, memberCap } = body

        const group = await prisma.group.create({
            data: {
                name,
                description,
                contributionAmount,
                duration,
                frequency,
                memberCap,
                adminId: req.userId
            },
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
                        }
                    }
                }
            }
        })

        // Auto-join admin as first approved member
        await prisma.groupMember.create({
            data: {
                userId: req.userId,
                groupId: group.id,
                status: 'APPROVED',
                joinDate: new Date()
            }
        })

        // Create first cycle
        await prisma.cycle.create({
            data: {
                groupId: group.id,
                cycleNumber: 1,
                startDate: new Date(),
                endDate: new Date(Date.now() + duration * 7 * 24 * 60 * 60 * 1000),
                payoutOrder: []
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Group created successfully',
            data: { group }
        }, { status: 201 })

    } catch (error) {
        console.error('Create group error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
})

// Get all groups
const GET = authenticateToken(async (req: AuthenticatedRequest): Promise<NextResponse<ApiResponse>> => {
    try {
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const status = searchParams.get('status')

        const skip = (page - 1) * limit

        const where: any = { isOpen: true }
        if (status) where.status = status

        const groups = await prisma.group.findMany({
            where,
            skip,
            take: limit,
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
                    where: { status: 'APPROVED' },
                    select: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        members: {
                            where: { status: 'APPROVED' }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        const total = await prisma.group.count({ where })

        return NextResponse.json({
            success: true,
            message: 'Groups retrieved successfully', // Added message
            data: {
                groups,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        })

    } catch (error) {
        console.error('Get groups error:', error)
        return NextResponse.json(
            {
                success: false, message: 'Internal server error',
                status: 500
            }
        )
    }
})

export { POST, GET }