import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { UserData } from '@/types'

const userSchema = new mongoose.Schema<UserData>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  about: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
  birthdate: { type: String },
  currentStep: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  this.updatedAt = new Date()
  next()
})

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.User || mongoose.model<UserData>('User', userSchema) 