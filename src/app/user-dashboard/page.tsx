'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import UserSidebar from '@/components/UserSidebar'
import UserProfilePanel from '@/components/UserProfilePanel'
import SettingsPanel from '@/components/SettingsPanel'
import { ThemeProvider } from '@/context/ThemeContext'
import Link from 'next/link'

export default function UserDashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  
  const [userData, setUserData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('profile')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('User dashboard loaded with email param:', email)
    if (!email) {
      console.error('No email parameter found in URL, redirecting to homepage')
      router.push('/')
      return
    }
    fetchUserData()
  }, [email, router])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      console.log('Fetching user data for email:', email)
      const response = await fetch(`/api/user-progress?email=${encodeURIComponent(email!)}`)
      
      if (!response.ok) {
        console.error(`Failed to fetch user data: ${response.status} ${response.statusText}`)
        throw new Error('Failed to fetch user data')
      }
      
      const data = await response.json()
      console.log('User data received:', data)
      
      if (!data || !data.email) {
        console.error('Invalid user data received:', data)
        setError('User data not found. Please try again or contact support.')
        setLoading(false)
        return
      }
      
      // Ensure formData exists
      const formData = data.formData || {}
      
      // Format address fields into a properly formatted American address if individual components exist
      let formattedAddress = formData.address || formData.Address || '';
      
      // Check if we have individual address components
      const hasStreetAddress = formData['Street Address'] || formData.street;
      const hasApt = formData['Apartment'] || formData.apt || formData.unit || formData.suite;
      const hasCity = formData['City'] || formData.city;
      const hasState = formData['State'] || formData.state;
      const hasZipCode = formData['Zip Code'] || formData.zipCode || formData.zip;
      
      // If individual components exist, format them properly
      if (hasStreetAddress || hasCity || hasState || hasZipCode) {
        // Standard American address format: 
        // Street Address (+ Apartment/Suite), City, State ZIP
        let streetPart = hasStreetAddress || '';
        if (hasApt) {
          streetPart += `, ${hasApt}`;
        }
        
        let cityStatePart = '';
        if (hasCity) cityStatePart += hasCity;
        if (hasState) {
          // Format as "City, State"
          cityStatePart += cityStatePart ? `, ${hasState}` : hasState;
        }
        
        // For ZIP code, we don't use a comma before it in American format
        if (hasZipCode) {
          cityStatePart += ` ${hasZipCode}`;
        }
        
        // Put it all together
        let addressParts = [];
        if (streetPart) addressParts.push(streetPart);
        if (cityStatePart) addressParts.push(cityStatePart);
        
        formattedAddress = addressParts.join(', ');
      }
      
      setUserData({
        email: data.email,
        name: formData.name || formData.Name || formData.fullName || formData['Full Name'] || '',
        about: formData.about || formData.About || formData.bio || formData.Bio || '',
        address: formattedAddress,
        phone: formData.phone || formData.Phone || formData['Phone Number'] || '',
        profileImage: formData.profileImage || formData.avatar || '',
        birthdate: formData.birthdate || formData.Birthdate || formData['Birthdate'] || '',
        role: formData.role || formData.Role || 'User',
        ...formData
      })
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      setError('Failed to load user data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (data: Record<string, any>) => {
    try {
      // Merge the updated data with the existing user data
      const updatedFormData = {
        ...userData,
        ...data
      }
      
      const response = await fetch('/api/user-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          currentPage: userData.currentPage || 1,
          formData: updatedFormData,
          completed: true,
          status: 'completed'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      // Refresh user data
      await fetchUserData()
      
      return true
    } catch (error) {
      console.error('Failed to update profile:', error)
      setError('Failed to update profile. Please try again later.')
      return false
    }
  }

  const handleLogout = async () => {
    try {
      // No actual logout for this demo app
      router.push('/')
      return Promise.resolve()
    } catch (error) {
      console.error('Error during logout:', error)
      return Promise.reject(error)
    }
  }

  if (loading) {
    return (
      <ThemeProvider>
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006A71]"></div>
        </div>
      </ThemeProvider>
    )
  }

  if (!userData.email) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">We couldn't find your profile information.</p>
            <Link href="/" className="px-4 py-2 bg-[#006A71] text-white rounded-md hover:bg-[#005a60] transition-colors">
              Return to Home
            </Link>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <UserSidebar 
          email={userData.email}
          name={userData.name}
          profileImage={userData.profileImage}
          onUpdateProfile={handleUpdateProfile}
          onLogout={handleLogout}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-800 dark:text-red-400">{error}</p>
            </div>
          )}
          
          {activeSection === 'profile' && (
            <UserProfilePanel 
              userData={userData}
              onUpdateProfile={handleUpdateProfile}
            />
          )}
          {activeSection === 'settings' && (
            <SettingsPanel 
              userData={userData}
              onUpdateSettings={handleUpdateProfile}
            />
          )}
          {activeSection !== 'profile' && activeSection !== 'settings' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">This section is currently under development.</p>
              <button 
                onClick={() => setActiveSection('profile')}
                className="px-4 py-2 bg-[#006A71] text-white rounded-md hover:bg-[#005a60] transition-colors"
              >
                Return to Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  )
} 