import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('form_components')
    console.log(111, collection)
    const result = await collection.deleteOne({
      _id: new ObjectId(params.id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Component deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to delete component:', error)
    return NextResponse.json(
      { error: 'Failed to delete component' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('form_components')
    const updates = await request.json()

    console.log('Updating component:', params.id, updates)

    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updates }
    )

    console.log('Update result:', result)

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Component updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to update component:', error)
    return NextResponse.json(
      { error: 'Failed to update component', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 