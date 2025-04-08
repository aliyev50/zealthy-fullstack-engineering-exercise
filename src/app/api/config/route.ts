import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Config from '@/models/Config'

export async function GET() {
  try {
    await connectToDatabase()
    let config = await Config.findOne()
    
    if (!config) {
      // Create default config if none exists
      config = await Config.create({
        page2: ['about', 'birthdate'],
        page3: ['address'],
      })
    }
    
    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase()
    const data = await request.json()
    const config = await Config.findOneAndUpdate(
      {},
      data,
      { new: true, upsert: true }
    )
    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 })
  }
} 