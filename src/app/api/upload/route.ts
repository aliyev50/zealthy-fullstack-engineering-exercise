import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { existsSync, mkdirSync } from 'fs'
import { randomUUID } from 'crypto'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('avatar') as File
    
    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file uploaded' 
      }, { status: 400 })
    }
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true })
    }
    
    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `${randomUUID()}.${fileExt}`
    const filePath = path.join(uploadDir, fileName)
    
    await writeFile(filePath, new Uint8Array(buffer))
    
    const fileUrl = `/uploads/${fileName}`
    
    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      message: 'Image uploaded successfully' 
    })
  } catch (error) {
    console.error('Failed to upload image:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload image' 
    }, { status: 500 })
  }
} 