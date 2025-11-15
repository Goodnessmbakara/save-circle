// app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { registerValidation } from '@/lib/validation'
import { generateTokens } from '@/lib/auth'
import { RegisterRequest, ApiResponse } from '@/lib/types'

export async function POST(request: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const body: RegisterRequest = await request.json()
    
    const { error } = registerValidation.validate(body)
    if (error) {
      return NextResponse.json(
        { success: false, message: error.details[0].message },
        { status: 400 }
      )
    }

    const { email, phone, password, firstName, lastName } = body

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email or phone already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        firstName,
        lastName,
        trustScore: 500
      },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        trustScore: true,
        createdAt: true
      }
    })

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    // TODO: Send OTP via SMS/Email

    const { accessToken, refreshToken } = generateTokens(user.id)

    return NextResponse.json({
      success: true,
      message: 'User registered successfully. Please verify OTP.',
      data: {
        user,
        accessToken,
        refreshToken,
        requiresVerification: true
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}