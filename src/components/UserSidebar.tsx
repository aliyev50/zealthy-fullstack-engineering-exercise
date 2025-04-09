'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'

interface UserSidebarProps {
  email?: string
  name?: string
  profileImage?: string
  onUpdateProfile?: (data: any) => Promise<boolean>
  onLogout: () => Promise<void>
  activeSection: string
  onSectionChange: (section: string) => void
}

export default function UserSidebar({
  email = '',
  name = 'User',
  profileImage = '',
  onUpdateProfile = async () => true,
  onLogout,
  activeSection,
  onSectionChange
}: UserSidebarProps) {
  const router = useRouter()
  const { darkMode } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(name || '')
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [imageCacheKey, setImageCacheKey] = useState(Date.now())
  
  useEffect(() => {
    setMounted(true)
    setEditedName(name || '')
  }, [name])

  useEffect(() => {
    // Update cache key when profileImage changes to prevent browser caching
    if (profileImage) {
      setImageCacheKey(Date.now());
    }
  }, [profileImage]);

  const getImageUrlWithCacheBusting = (url: string | undefined) => {
    if (!url) return '/default-avatar.png';
    return `${url}?v=${imageCacheKey}`;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const { url } = await response.json()
      await onUpdateProfile({ profileImage: url })
    } catch (error) {
      console.error('Failed to upload image:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleNameSave = async () => {
    if (editedName === name) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      await onUpdateProfile({ name: editedName })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update name:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await onLogout()
      if (mounted) {
        router.push('/')
      } else {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  return (
    <div className="w-64 h-full bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
      <div className="p-6 border-b dark:border-gray-700">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <img
            src={getImageUrlWithCacheBusting(profileImage)}
            alt={name || 'User'}
            key={profileImage || 'default-avatar'}
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/default-avatar.png'
            }}
          />
          <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </label>
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        <div className="text-center">
          {isEditing ? (
            <div className="flex items-center justify-center space-x-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="px-2 py-1 border dark:border-gray-600 rounded text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleNameSave}
                disabled={isSaving}
                className="text-[#006A71] hover:text-[#005a60]"
              >
                ✓
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditedName(name || '')
                }}
                className="text-red-600 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mr-2">{name}</h2>
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <button
            onClick={() => onSectionChange('profile')}
            className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'profile'
                ? 'bg-[#006A71] text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => onSectionChange('settings')}
            className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'settings'
                ? 'bg-[#006A71] text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Settings
          </button>
        </div>
      </nav>

      <div className="p-4 border-t dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center"
        >
          Logout
        </button>
      </div>
    </div>
  )
} 