import { NextResponse } from 'next/server'
import User from '@/models/User'
import mongoose from 'mongoose'

// Connect to MongoDB if not already connected
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return
  
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw new Error('Failed to connect to database')
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create new user
    const user = new User({
      email,
      password,
      currentStep: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await user.save()

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toObject()
    
    return NextResponse.json({
      message: 'User registered successfully',
      user: userWithoutPassword
    }, { status: 201 })
    
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
} 