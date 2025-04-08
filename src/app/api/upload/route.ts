import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // In a real app, this would handle file upload to a storage service
    // For this demo, we'll just return a placeholder image
    
    // Get a random placeholder avatar
    const avatarId = Math.floor(Math.random() * 100)
    const imageUrl = `https://i.pravatar.cc/300?img=${avatarId}`
    
    console.log('Mock image upload successful, returning URL:', imageUrl)
    
    return NextResponse.json({ 
      success: true, 
      url: imageUrl,
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