// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { loginValidation } from '@/lib/validation'
import { generateTokens } from '@/lib/auth'
import { LoginRequest, ApiResponse } from '@/lib/types'

export async function POST(request: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const body: LoginRequest = await request.json()
    
    const { error } = loginValidation.validate(body)
    if (error) {
      return NextResponse.json(
        { success: false, message: error.details[0].message },
        { status: 400 }
      )
    }

    const { email, password } = body

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        groupsCreated: true,
        groupMembers: {
          include: {
            group: true
          }
        }
      }
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { success: false, message: 'Please verify your account first' },
        { status: 403 }
      )
    }

    const { accessToken, refreshToken } = generateTokens(user.id)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        accessToken,
        refreshToken
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}