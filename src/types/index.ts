export type OnboardingComponent = 'about' | 'address' | 'birthdate'

export interface OnboardingConfig {
  page2: OnboardingComponent[]
  page3: OnboardingComponent[]
}

export interface UserData {
  email: string
  password: string
  about?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zip?: string
  }
  birthdate?: string
  currentStep: number
  createdAt: Date
  updatedAt: Date
}

export interface OnboardingStep {
  step: number
  title: string
  description: string
  isActive: boolean
  isCompleted: boolean
}

export interface FormComponent {
  _id?: string
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'date'
  label: string
  required: boolean
  placeholder?: string
  options?: string[]
  page: number
  order: number
  validation?: {
    pattern?: string
    message?: string
    min?: number
    max?: number
  }
}

export interface UserProgress {
  _id?: string
  email: string
  currentPage: number
  formData: Record<string, any>
  completed: boolean
  createdAt?: string
  updatedAt?: string
}

export interface FormData {
  email?: string
  password?: string
  name?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  [key: string]: any
} 