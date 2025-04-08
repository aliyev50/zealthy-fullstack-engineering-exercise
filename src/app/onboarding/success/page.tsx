'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Onboarding Complete!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for completing the onboarding process. Your information has been
            successfully saved.
          </p>
          
          <div className="space-y-4">
            <Link
              href={`/user-dashboard?email=${encodeURIComponent(email || '')}`}
              className="block w-full bg-[#006A71] text-white px-6 py-2 rounded-md hover:bg-[#006A71]/90 transition-colors"
            >
              Go to Dashboard
            </Link>
            
            <Link
              href="/"
              className="block w-full bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 