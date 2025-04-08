import mongoose from 'mongoose'
import { OnboardingConfig } from '@/types'

const configSchema = new mongoose.Schema<OnboardingConfig>({
  page2: [{ type: String, enum: ['about', 'address', 'birthdate'] }],
  page3: [{ type: String, enum: ['about', 'address', 'birthdate'] }],
}, {
  timestamps: true,
})

export default mongoose.models.Config || mongoose.model<OnboardingConfig>('Config', configSchema) 