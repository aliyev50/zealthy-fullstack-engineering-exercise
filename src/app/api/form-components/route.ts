import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { FormComponent } from '@/types'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    const components = await db.collection('form_components').find().sort({ page: 1, order: 1 }).toArray()
    return NextResponse.json(components)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch form components' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db()
    const data: FormComponent = await request.json()

    if (!data.type || !data.label || data.page === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const lastComponent = await db.collection('form_components')
      .findOne({ page: data.page }, { sort: { order: -1 } })

    const order = lastComponent ? (lastComponent.order || 0) + 1 : 1
    const { _id, ...insertData } = data
    const result = await db.collection('form_components').insertOne({ ...insertData, order })

    return NextResponse.json({ _id: result.insertedId, ...data, order })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create form component' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db()
    const data = await request.json()
    const { _id, ...updateData } = data

    if (!updateData.type || !updateData.label || updateData.page === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await db.collection('form_components').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update form component' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Component ID is required' }, { status: 400 })
    }

    const result = await db.collection('form_components').deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete form component' }, { status: 500 })
  }
} 