'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { UserProgress } from '@/types'
import AnalogClock from './components/AnalogClock'

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editedData, setEditedData] = useState<Record<string, any>>({})
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [currentTime, setCurrentTime] = useState(new Date())

  // Time zones for world clock
  const timeZones = [
    { city: 'New York', zone: 'America/New_York' },
    { city: 'London', zone: 'Europe/London' },
    { city: 'Tokyo', zone: 'Asia/Tokyo' },
    { city: 'Moscow', zone: 'Europe/Moscow' }
  ]

  useEffect(() => {
    if (!email) {
      router.push('/')
      return
    }
    fetchUserData()

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [email])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/user-progress?email=${encodeURIComponent(email!)}`)
      if (response.ok) {
        const data = await response.json()
        setUserProgress(data)
        setEditedData(data.formData || {})
        if (data.formData?.profileImage) {
          setProfileImage(data.formData.profileImage)
        }
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageLoading(true)
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64String = reader.result as string
        setProfileImage(base64String)
        await saveProgress({
          ...editedData,
          profileImage: base64String
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Failed to upload image:', error)
    } finally {
      setImageLoading(false)
    }
  }

  const saveProgress = async (data: Record<string, any>) => {
    try {
      const response = await fetch('/api/user-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          currentPage: userProgress?.currentPage || 1,
          formData: data,
          completed: userProgress?.completed || false,
        }),
      })

      if (response.ok) {
        setEditedData(data)
        setEditing(false)
        await fetchUserData()
      }
    } catch (error) {
      console.error('Failed to save progress:', error)
    }
  }

  const handleSave = async () => {
    await saveProgress(editedData)
  }

  const formatTimeForZone = (zone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      timeZone: zone
    }).format(currentTime)
  }

  const generateCalendar = () => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]

    const days = []
    for (let i = 0 ; i < startingDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return {
      month: monthNames[today.getMonth()],
      year: today.getFullYear(),
      days
    }
  }

  const calendar = generateCalendar()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006A71]"></div>
      </div>
    )
  }

  if (!userProgress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find your profile information.</p>
          <Link href="/" className="text-[#006A71] hover:text-[#005a60]">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  const NavItem = ({ icon, label, badge = null }: { icon: string, label: string, badge?: number | null }) => (
    <button 
      onClick={() => setActiveSection(label.toLowerCase())}
      className={`flex items-center w-full px-4 py-2 text-left rounded-lg ${
        activeSection === label.toLowerCase() 
          ? 'bg-[#006A71]/10 text-[#006A71]' 
          : 'hover:bg-gray-100'
      }`}
    >
      <span className="w-5 h-5 mr-3">{icon}</span>
      <span>{label}</span>
      {badge && (
        <span className="ml-auto bg-[#006A71]/20 text-[#006A71] px-2 py-0.5 rounded-full text-xs">
          {badge}
        </span>
      )}
    </button>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col h-screen sticky top-0">
        {/* User Profile Section */}
        <div className="mb-8">
          <div className="relative w-12 h-12 mb-4">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#006A71]/10 flex items-center justify-center text-[#006A71]">
                {email?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div className="text-sm font-medium text-gray-900">{email?.split('@')[0]}</div>
          <div className="text-xs text-gray-500">Online</div>
        </div>

        {/* Main Navigation Section */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Navigation */}
          <nav className="space-y-2">
            <NavItem icon="🏠" label="Home" />
            <NavItem icon="🤖" label="AI Assistant" />
            <NavItem icon="👤" label="My Profile" />
            <NavItem icon="📬" label="Inbox" badge={3} />
            <NavItem icon="📅" label="Calendar" />
            <NavItem icon="📊" label="Reports & Analytics" />
          </nav>

          {/* Projects Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-500">My Projects</h2>
              <button className="text-[#006A71] text-sm hover:text-[#005a60]">+ Add</button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span className="text-sm">Product launch</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-sm">Team brainstorm</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                <span className="text-sm">Branding launch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => router.push('/')}
          className="mt-8 flex items-start w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <span className="w-5 h-5 mr-3">🚪</span>
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hello, {email?.split('@')[0]}</h1>
            <p className="text-2xl text-[#006A71]">Welcome to your dashboard</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* User Information Section - Now First and Full Width */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">My Information</h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-[#006A71] hover:text-[#005a60] text-sm font-medium"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {editing ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(editedData).map(([key, value]) => {
                        if (key === 'profileImage') return null
                        return (
                          <div key={key} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                            </label>
                            <input
                              type="text"
                              value={value as string}
                              onChange={(e) => setEditedData(prev => ({
                                ...prev,
                                [key]: e.target.value
                              }))}
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A71]"
                            />
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-[#006A71] text-white rounded-lg hover:bg-[#005a60] transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setEditedData(userProgress.formData || {})
                          setEditing(false)
                        }}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(userProgress.formData || {}).map(([key, value]) => {
                      if (key === 'profileImage') return null
                      return (
                        <div key={key} className="bg-gray-50 p-4 rounded-lg">
                          <dt className="text-sm font-medium text-gray-500">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                          </dt>
                          <dd className="mt-1 text-sm font-medium text-gray-900">
                            {value as string || 'Not provided'}
                          </dd>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Utilities Row - Calendar and Clock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* World Clock Section - More Compact */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3">World Clock</h2>
                <div className="grid grid-cols-2 gap-4">
                  {timeZones.map(({ city, zone }) => {
                    const localTime = new Date(currentTime.toLocaleString('en-US', { timeZone: zone }))
                    return (
                      <AnalogClock
                        key={city}
                        time={localTime}
                        city={city}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Calendar Widget - More Compact */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3">Calendar</h2>
                <div className="text-center mb-3">
                  <h3 className="text-md font-medium text-[#006A71]">
                    {calendar.month} {calendar.year}
                  </h3>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-xs font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {calendar.days.map((day, index) => (
                    <div
                      key={index}
                      className={`p-1 text-sm ${
                        day === new Date().getDate() && calendar.month === new Date().toLocaleString('default', { month: 'long' })
                          ? 'bg-[#006A71] text-white rounded-full'
                          : day
                          ? 'hover:bg-gray-100 rounded-full'
                          : ''
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 