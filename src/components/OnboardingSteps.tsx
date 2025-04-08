import { OnboardingStep } from '@/types'

interface OnboardingStepsProps {
  steps: OnboardingStep[]
}

export default function OnboardingSteps({ steps }: OnboardingStepsProps) {
  return (
    <div className="max-w-3xl mx-auto mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={step.step}
            className={`flex items-center ${
              index < steps.length - 1 ? 'flex-1' : ''
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step.isCompleted
                  ? 'bg-primary text-white'
                  : step.isActive
                  ? 'bg-primary/20 text-primary'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step.step}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  step.isCompleted ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {steps.map((step) => (
          <div
            key={step.step}
            className={`text-sm ${
              step.isActive ? 'text-primary font-medium' : 'text-gray-500'
            }`}
          >
            {step.title}
          </div>
        ))}
      </div>
    </div>
  )
} 