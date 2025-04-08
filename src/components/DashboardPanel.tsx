'use client'

export default function DashboardPanel() {
  const stats = [
    { label: 'Completed Forms', value: 12, icon: '📝', color: 'bg-blue-100 text-blue-600' },
    { label: 'Tasks Done', value: 8, icon: '✅', color: 'bg-green-100 text-green-600' },
    { label: 'Pending Items', value: 3, icon: '⏳', color: 'bg-amber-100 text-amber-600' },
    { label: 'Messages', value: 15, icon: '✉️', color: 'bg-purple-100 text-purple-600' }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Dashboard</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg border p-4 flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center text-xl`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Activity Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="border rounded-lg divide-y">
            {[
              { action: 'Updated profile information', time: '2 hours ago', icon: '👤' },
              { action: 'Completed onboarding step 3', time: '1 day ago', icon: '🎯' },
              { action: 'Uploaded new documents', time: '3 days ago', icon: '📄' },
              { action: 'Logged in from new device', time: '1 week ago', icon: '🔐' }
            ].map((activity, index) => (
              <div key={index} className="p-4 flex items-start space-x-3">
                <div className="bg-[#006A71]/10 text-[#006A71] p-2 rounded-full flex-shrink-0">
                  {activity.icon}
                </div>
                <div>
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[
            { label: 'Update Profile', icon: '👤' },
            { label: 'Submit Documents', icon: '📄' },
            { label: 'View Messages', icon: '✉️' },
            { label: 'Check Notifications', icon: '🔔' }
          ].map((action, index) => (
            <button 
              key={index}
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl mb-2">{action.icon}</span>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 