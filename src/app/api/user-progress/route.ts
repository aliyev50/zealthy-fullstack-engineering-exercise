import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) return
    await mongoose.connect(process.env.MONGODB_URI as string)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
  }
}

const userProgressSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  currentPage: { type: Number, default: 1 },
  formData: { type: Object, default: {} },
  completed: { type: Boolean, default: false },
  status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
}, { 
  timestamps: true,
  collection: 'userprogresses'
})

const UserProgress = mongoose.models.UserProgress || mongoose.model('UserProgress', userProgressSchema)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const fetchAll = searchParams.get('fetchAll') === 'true'
    
    console.log('GET - Searching for email:', email, 'fetchAll:', fetchAll)

    await connectDB()
    
    if (fetchAll || !email) {
      const allProgress = await UserProgress.find().sort({ updatedAt: -1 })
      return NextResponse.json(allProgress)
    }

    const progress = await UserProgress.findOne({ email })

    if (!progress) {
      return NextResponse.json({ 
        email,
        currentPage: 1,
        formData: {},
        completed: false,
        status: 'in_progress'
      })
    }

    return NextResponse.json(progress)
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch user progress' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('POST - Saving progress for:', body)
    
    const email = body.email || body.userId
    
    if (!email) {
      console.error('POST - Missing email in request body:', body)
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    await connectDB()
    
    const updateData = {
      email,
      currentPage: body.currentPage,
      formData: body.formData || {},
      completed: body.completed || false,
      status: body.status || (body.completed ? 'completed' : 'in_progress')
    }
    
    console.log('POST - Updating with data:', updateData)
    
    const progress = await UserProgress.findOneAndUpdate(
      { email },
      updateData,
      { new: true, upsert: true }
    )
    
    console.log('POST - Progress saved successfully:', {
      email: progress.email,
      currentPage: progress.currentPage,
      completed: progress.completed,
      status: progress.status
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ error: 'Failed to save user progress' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const all = searchParams.get('all');
    
    await connectDB();
    
    if (all === 'true') {
      console.log('DELETE - Removing all user progress data');
      const result = await UserProgress.deleteMany({});
      return NextResponse.json({ 
        success: true, 
        message: `Deleted ${result.deletedCount} user records` 
      });
    }
    
    if (email) {
      console.log(`DELETE - Removing user progress data for: ${email}`);
      const result = await UserProgress.deleteOne({ email });
      
      if (result.deletedCount === 0) {
        return NextResponse.json({ 
          success: false, 
          message: 'No matching user found' 
        }, { status: 404 });
      }
      
      return NextResponse.json({ 
        success: true, 
        message: `User ${email} deleted successfully` 
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Email parameter or all=true is required' 
    }, { status: 400 });
    
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete user progress' 
    }, { status: 500 });
  }
} 