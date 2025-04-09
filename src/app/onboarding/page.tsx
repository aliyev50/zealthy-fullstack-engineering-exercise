'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormComponent } from '@/types'
import DynamicForm from '@/components/DynamicForm'
import Link from 'next/link'

export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  
  const [components, setComponents] = useState<FormComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [error, setError] = useState<string>('')
  const [progress, setProgress] = useState<number>(0)
  const [showWelcomeBack, setShowWelcomeBack] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [existingData, setExistingData] = useState<Record<string, any>>({})

  useEffect(() => {
    setMounted(true)
    
    // Fetch user data if email is provided
    if (email) {
      fetchUserData()
    }
  }, [email])

  const fetchUserData = async () => {
    if (!email) return
    
    try {
      const response = await fetch(`/api/user-progress?email=${encodeURIComponent(email)}`)
      if (response.ok) {
        const userData = await response.json()
        if (userData && userData.formData) {
          setFormData(userData.formData)
          setExistingData(userData.formData)
          setCurrentPage(userData.currentPage || 1)
        }
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await fetch('/api/form-components')
        if (!response.ok) throw new Error('Failed to fetch form components')
        const data = await response.json()
        const componentsArray = Array.isArray(data) ? data : []
        setComponents(componentsArray)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch form components')
      } finally {
        setLoading(false)
      }
    }

    fetchComponents()
    if (existingData && Object.keys(existingData).length > 0) {
      setShowWelcomeBack(true)
      setTimeout(() => setShowWelcomeBack(false), 5000)
    }
  }, [existingData])

  const maxPage = Math.max(...components.map(c => c.page || 1), 1)

  const handleFormChange = (data: Record<string, any>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const handleSaveProgress = async (data: Record<string, any>) => {
    // Update local state with the latest form data
    setFormData(data)
    
    if (!email) return

    try {
      const response = await fetch('/api/user-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          formData: data,
          completed: false,
          currentPage
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save progress')
      }
    } catch (error) {
      console.error('Failed to save progress:', error)
      setError(error instanceof Error ? error.message : 'Failed to save progress')
    }
  }

  const handleNext = async () => {
    await handleSaveProgress(formData)
    setCurrentPage(prev => {
      const nextPage = prev + 1
      setProgress((nextPage - 1) / maxPage * 100)
      return nextPage
    })
  }

  const handleSubmit = async () => {
    if (!email) {
      router.push('/dashboard')
      return
    }

    try {
      const response = await fetch('/api/user-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          formData,
          completed: true,
          currentPage: maxPage,
          status: 'completed'
        }),
      })


      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error:', errorText)
        throw new Error(`Failed to submit form: ${errorText}`)
      }

      router.push(`/dashboard?email=${encodeURIComponent(email)}`)
    } catch (error) {
      console.error('Failed to submit form:', error)
      setError(error instanceof Error ? error.message : 'Failed to submit form')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006A71]"></div>
      </div>
    )
  }

  if (components.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">No Form Components Found</h1>
          <p className="text-gray-600">Please contact the administrator to set up the onboarding form.</p>
        </div>
      </div>
    )
  }

  const currentComponents = components.filter(c => c.page === currentPage)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-gray-900">
              {currentPage === 1 ? 'Welcome!' : `Step ${currentPage} of ${maxPage}`}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#006A71]"
              ></div>
            </div>
          </div>
        </div>

        {showWelcomeBack && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800">
              Welcome back! We've restored your previous progress.
            </p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div>
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            <DynamicForm
              page={currentPage}
              components={currentComponents}
              initialData={formData}
              onSubmit={currentPage === maxPage ? handleSubmit : handleNext}
              onSaveProgress={handleSaveProgress}
              maxPage={maxPage}
            />
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-y-2 md:gap-y-0 mt-6">
              <Link
                href="/"
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-center"
              >
                Back to main menu
              </Link>
              <div className="flex flex-col md:flex-row md:space-x-4 gap-y-6 md:gap-y-0">
                <button
                  type="button"
                  onClick={() => {
                    setError('') // Clear errors when navigating
                    setCurrentPage(prev => {
                      const newPage = prev - 1
                      setProgress((newPage - 1) / maxPage * 100)
                      return newPage
                    })
                  }}
                  disabled={currentPage === 1}
                  className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError('') // Clear errors when navigating
                    if (currentPage === maxPage) {
                      handleSubmit()
                    } else {
                      handleNext()
                    }
                  }}
                  className="w-full md:w-auto px-4 py-2 bg-[#006A71] border border-[#006A71] rounded-md text-white hover:bg-[#005a61]"
                >
                  {currentPage === maxPage ? 'Complete' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 