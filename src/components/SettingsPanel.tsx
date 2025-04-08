'use client'

import { useState, useEffect } from 'react'
import { Switch } from '@headlessui/react'
import { useTheme } from '@/context/ThemeContext'

interface SettingsState {
  emailNotifications: boolean
  darkMode: boolean
  twoFactorAuth: boolean
  language: string
  timezone: string
}

export default function SettingsPanel() {
  const { darkMode, toggleDarkMode } = useTheme()
  const [settings, setSettings] = useState<SettingsState>({
    emailNotifications: true,
    darkMode: darkMode,
    twoFactorAuth: false,
    language: 'English',
    timezone: 'UTC',
  })

  useEffect(() => {
    setSettings(prev => ({ ...prev, darkMode }))
  }, [darkMode])

  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (field: keyof SettingsState, value: any) => {
    if (field === 'darkMode') {
      toggleDarkMode()
    }
    setSettings({ ...settings, [field]: value })
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive email updates about your account activity</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onChange={(checked) => handleChange('emailNotifications', checked)}
              className={`${settings.emailNotifications ? 'bg-[#006A71]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:ring-offset-2`}
            >
              <span className={`${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
            </Switch>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
            </div>
            <Switch
              checked={settings.darkMode}
              onChange={(checked) => handleChange('darkMode', checked)}
              className={`${settings.darkMode ? 'bg-[#006A71]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:ring-offset-2`}
            >
              <span className={`${settings.darkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
            </Switch>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Language and Timezone</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006A71]"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006A71]"
            >
              <option value="UTC">UTC</option>
              <option value="EST">EST</option>
              <option value="PST">PST</option>
              <option value="GMT">GMT</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onChange={(checked) => handleChange('twoFactorAuth', checked)}
              className={`${settings.twoFactorAuth ? 'bg-[#006A71]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:ring-offset-2`}
            >
              <span className={`${settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
            </Switch>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t dark:border-gray-700">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full px-4 py-2 bg-[#006A71] text-white rounded-lg hover:bg-[#005a60] transition-colors focus:outline-none focus:ring-2 focus:ring-[#006A71] focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  )
} 