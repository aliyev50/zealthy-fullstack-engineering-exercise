'use client'

import { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Transition, Switch, Popover } from '@headlessui/react'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [randomImage, setRandomImage] = useState(1)
  const [checkingProgress, setCheckingProgress] = useState(false)

  useEffect(() => {
    // Set a random image number between 1-3
    setRandomImage(Math.floor(Math.random() * 3) + 1)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setCheckingProgress(true)

    if (!email) {
      setError('Email is required')
      setCheckingProgress(false)
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      setCheckingProgress(false)
      return
    }

    if (!password) {
      setError('Password is required')
      setCheckingProgress(false)
      return
    }

    try {
      // First try to log in with the credentials
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      const loginData = await loginResponse.json()
      
      if (loginResponse.ok) {
        // Login successful
        console.log('Login successful:', loginData)
        
        // Check if user has completed onboarding
        const progressResponse = await fetch(`/api/user-progress?email=${encodeURIComponent(email)}`)
        if (progressResponse.ok) {
          const progress = await progressResponse.json()
          if (progress && progress.status === 'completed') {
            // User completed onboarding, go to dashboard
            router.push(`/user-dashboard?email=${encodeURIComponent(email)}`)
          } else {
            // User didn't complete onboarding
            router.push(`/onboarding?email=${encodeURIComponent(email)}`)
          }
        } else {
          // No progress found, start onboarding
          router.push(`/onboarding?email=${encodeURIComponent(email)}`)
        }
        return
      } else if (loginResponse.status === 404) {
        // User doesn't exist, try to register them
        const registerResponse = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        
        const registerData = await registerResponse.json()
        
        if (registerResponse.ok) {
          // Registration successful, start onboarding
          console.log('Registration successful:', registerData)
          router.push(`/onboarding?email=${encodeURIComponent(email)}`)
          return
        } else {
          // Registration failed
          setError(registerData.error || 'Failed to register. Please try again.')
          setCheckingProgress(false)
          return
        }
      } else if (loginResponse.status === 401) {
        // Invalid password
        setError('Invalid password. Please try again.')
        setCheckingProgress(false)
        return
      } else {
        // Other login error
        setError(loginData.error || 'An error occurred. Please try again.')
        setCheckingProgress(false)
        return
      }
    } catch (error) {
      console.error('Error during authentication:', error)
      setError('An error occurred. Please try again.')
      setCheckingProgress(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Section: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-10 lg:p-20">
        <div className="mb-12">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-md bg-[#006A71] flex items-center justify-center text-white font-bold mr-2">Z</div>
            <span className="text-2xl font-bold text-gray-900">zealthy</span>
          </div>
        </div>

        <div className="my-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome</h1>
          <p className="text-lg text-gray-600 mb-8">Enter your credentials to get started with Zealthy</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#006A71] ${
                    error && error.includes('email') ? 'border-red-500' : ''
                  }`}
                  placeholder="you@example.com"
                />
                {error && error.includes('email') && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {error && error.includes('email') && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#006A71] ${
                    error && error.includes('password') ? 'border-red-500' : ''
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
                {error && error.includes('password') && (
                  <div className="absolute inset-y-0 right-10 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {error && error.includes('password') && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <Transition
              show={!!error}
              enter="transition-opacity duration-150"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      There was an error with your submission
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>

            <button
              type="submit"
              disabled={checkingProgress}
              className={`w-full bg-[#006A71] text-white py-3 px-4 rounded-md hover:bg-[#005a60] focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:ring-offset-2 transition-colors ${
                checkingProgress ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              <Transition
                show={checkingProgress}
                enter="transition-opacity duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
              </Transition>
              <span className={checkingProgress ? 'opacity-0' : ''}>
                {checkingProgress ? 'Checking...' : 'Start Onboarding'}
              </span>
            </button>
          </form>
          
          <div className="mt-6 flex flex-col md:flex-row justify-between text-sm">
            <Link
              href="/admin"
              className="text-[#006A71] hover:text-[#005a60] transition-colors hover:underline"
            >
              Admin Dashboard →
            </Link>
            
            <div className="flex flex-col md:flex-row md:space-x-4">
              <Link
                href="/user-dashboard?email=demo@example.com"
                className="text-[#006A71] hover:text-[#005a60] transition-colors hover:underline"
              >
                User Dashboard →
              </Link>
              <Link
                href="/data"
                className="text-[#006A71] hover:text-[#005a60] transition-colors hover:underline"
              >
                View Data →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 space-x-4">
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button className="hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:ring-offset-2 rounded">
                    Terms
                  </Popover.Button>
                  <Transition
                    show={open}
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute bottom-full mb-2 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-md">
                      <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="relative bg-white p-4">
                          <h3 className="text-sm font-medium text-gray-900">Terms of Service</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            By using Zhealthy, you agree to our terms of service and privacy policy.
                          </p>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
            <Link href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-700 transition-colors">Imprint</Link>
            <Link href="#" className="hover:text-gray-700 transition-colors">Support</Link>
          </div>
        </div>
      </div>

      {/* Right Section: Feature Showcase */}
      <div className="hidden lg:block lg:w-1/2 bg-gray-100 relative overflow-hidden">
        <Transition
          show={true}
          appear={true}
          enter="transition-opacity duration-1000"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <div className="absolute inset-0">
            <div className="h-full w-full">
              <div className="relative h-full w-full overflow-hidden">
                <Image 
                  src={`/images/healthcare-${randomImage}.jpg`} 
                  alt="Healthcare professional" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  className="opacity-90"
                  priority
                />
                <div className="absolute inset-0 bg-[#006A71]/10"></div>
              </div>
            </div>
          </div>
        </Transition>

        <Transition
          show={true}
          appear={true}
          enter="transition-all duration-1000 delay-500"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
        >
          <div className="absolute inset-0 flex flex-col justify-center p-16">
            <div className="bg-white/90 p-8 rounded-lg max-w-md shadow-lg backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Health Portal</h2>
              <p className="text-gray-700 mb-6">
                The Zhealthy portal is your digital health assistant. Manage appointments, 
                view medical records, and communicate with your healthcare providers.
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#006A71] text-white flex items-center justify-center font-medium">1</div>
                </div>
                <div className="flex-1">
                  <div className="h-1 bg-gray-200 rounded">
                    <div className="h-1 bg-[#006A71] rounded" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <Transition
          show={true}
          appear={true}
          enter="transition-all duration-1000 delay-1000"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 translate-y-0"
        >
          <div className="absolute bottom-10 left-0 right-0 p-8">
            <div className="bg-white/80 rounded-lg p-6 backdrop-blur-sm">
              <p className="text-center text-sm text-gray-500 mb-6">Trusted by leading healthcare providers</p>
              <div className="flex justify-between items-center space-x-8">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <div key={index} className="flex-1 h-6 flex items-center justify-center grayscale opacity-70">
                    <div className="h-6 w-20 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-600 font-medium">
                      Provider {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  )
} 