import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'

export async function GET() {
  try {
    await connectToDatabase()
    const users = await User.find({}).sort({ createdAt: -1 })
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const data = await request.json()
    const user = await User.create(data)
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase()
    const data = await request.json()
    const { email, ...updateData } = data
    const user = await User.findOneAndUpdate(
      { email },
      updateData,
      { new: true }
    )
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
} 