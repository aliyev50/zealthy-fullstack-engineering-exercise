import { MongoClient } from 'mongodb'

// Check for MongoDB URI and provide a more helpful error message
if (!process.env.MONGODB_URI) {
  if (process.env.NODE_ENV === 'production') {
    console.error('WARNING: Missing MONGODB_URI environment variable in production mode')
  } else {
    throw new Error('Please add your Mongo URI to .env.local')
  }
}

const uri = process.env.MONGODB_URI || ''
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export const connectToDatabase = async () => {
  try {
    const client = await clientPromise
    return { client, db: client.db() }
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw new Error('Database connection failed. Please check your MongoDB URI.')
  }
}

export default clientPromise 
