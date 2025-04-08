import { useState } from 'react'
import { OnboardingComponent, UserData } from '@/types'

interface OnboardingFormProps {
  currentStep: number
  components: OnboardingComponent[]
  userData: Partial<UserData>
  onSubmit: (data: Partial<UserData>) => void
}

export default function OnboardingForm({
  currentStep,
  components,
  userData,
  onSubmit,
}: OnboardingFormProps) {
  const [formData, setFormData] = useState<Partial<UserData>>(userData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {components.includes('about') && (
        <div className="form-group">
          <label htmlFor="about" className="label">
            About Me
          </label>
          <textarea
            id="about"
            name="about"
            value={formData.about || ''}
            onChange={handleChange}
            className="input min-h-[100px]"
            placeholder="Tell us about yourself..."
          />
        </div>
      )}

      {components.includes('address') && (
        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="street" className="label">
              Street Address
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.address?.street || ''}
              onChange={handleAddressChange}
              className="input"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="city" className="label">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.address?.city || ''}
                onChange={handleAddressChange}
                className="input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="state" className="label">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.address?.state || ''}
                onChange={handleAddressChange}
                className="input"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="zip" className="label">
              ZIP Code
            </label>
            <input
              type="text"
              id="zip"
              name="zip"
              value={formData.address?.zip || ''}
              onChange={handleAddressChange}
              className="input"
            />
          </div>
        </div>
      )}

      {components.includes('birthdate') && (
        <div className="form-group">
          <label htmlFor="birthdate" className="label">
            Birth Date
          </label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            value={formData.birthdate || ''}
            onChange={handleChange}
            className="input"
          />
        </div>
      )}

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">
          {currentStep === 3 ? 'Complete' : 'Next'}
        </button>
      </div>
    </form>
  )
} 