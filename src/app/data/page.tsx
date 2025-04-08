'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DataPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClearing, setIsClearing] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const response = await fetch('/api/user-progress')
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleClearAllData = async () => {
    if (!confirm('Are you sure you want to delete ALL user data? This cannot be undone.')) {
      return
    }
    
    setIsClearing(true)
    setSuccessMessage(null)
    setError(null)
    
    try {
      const response = await fetch('/api/user-progress?all=true', {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to clear data')
      }
      
      const result = await response.json()
      setSuccessMessage(result.message || 'All data has been cleared successfully')
      
      // Refresh the data table
      await fetchData()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to clear data')
    } finally {
      setIsClearing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006A71]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
          <Link
            href="/"
            className="text-[#006A71] hover:text-[#005a60]"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submitted Data</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleClearAllData}
              disabled={isClearing}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isClearing ? 'Clearing...' : 'Clear All Data'}
            </button>
            <Link
              href="/"
              className="text-[#006A71] hover:text-[#005a60]"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {data.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No data available. Start the onboarding process to add some data.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                {['Name', 'Email', 'Status', 'Progress', 'Last Updated'].map((header, index) => (
                  <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.formData.Name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.completed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.completed ? 'Completed' : 'In Progress'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Page {item.currentPage} {item.completed ? '(Complete)' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
} 