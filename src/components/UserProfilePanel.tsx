'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface UserProfilePanelProps {
  userData: {
    name?: string;
    email?: string;
    role?: string;
    about?: string;
    address?: string | {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
    phone?: string;
    birthdate?: string;
    profileImage?: string;
    [key: string]: any;
  };
  onUpdateProfile: (data: Partial<UserProfilePanelProps['userData']>) => Promise<any>;
}

export default function UserProfilePanel({ userData = {}, onUpdateProfile }: UserProfilePanelProps) {
  const { darkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState({
    name: userData.name || '',
    email: userData.email || '',
    role: userData.role || 'User',
    about: userData.about || '',
    birthdate: userData.birthdate || '',
    address: typeof userData.address === 'string' 
      ? userData.address 
      : userData.address 
        ? `${userData.address.street || ''}, ${userData.address.city || ''}, ${userData.address.state || ''} ${userData.address.zip || ''}` 
        : '',
    phone: userData.phone || '',
  });

  useEffect(() => {
    setEditedData({
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'User',
      about: userData.about || '',
      birthdate: userData.birthdate || '',
      address: typeof userData.address === 'string' 
        ? userData.address 
        : userData.address 
          ? `${userData.address.street || ''}, ${userData.address.city || ''}, ${userData.address.state || ''} ${userData.address.zip || ''}` 
          : '',
      phone: userData.phone || '',
    });
  }, [userData]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'User', 
      about: userData.about || '',
      birthdate: userData.birthdate || '',
      address: typeof userData.address === 'string'
        ? userData.address
        : userData.address
          ? `${userData.address.street || ''}, ${userData.address.city || ''}, ${userData.address.state || ''} ${userData.address.zip || ''}`
          : '',
      phone: userData.phone || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({
      name: userData.name || '',
      email: userData.email || '', 
      role: userData.role || 'User',
      about: userData.about || '',
      birthdate: userData.birthdate || '',
      address: typeof userData.address === 'string'
        ? userData.address
        : userData.address
          ? `${userData.address.street || ''}, ${userData.address.city || ''}, ${userData.address.state || ''} ${userData.address.zip || ''}`
          : '',
      phone: userData.phone || '',
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateProfile(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof typeof userData, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatAddress = (address: UserProfilePanelProps['userData']['address']): string => {
    if (!address) return '';
    if (typeof address === 'string') return address;
    
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zip
    ].filter(Boolean)
    
    return parts.join(', ');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-[#006A71] text-white rounded-lg hover:bg-[#005a60] transition-colors"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-[#006A71] text-white rounded-lg hover:bg-[#005a60] transition-colors disabled:opacity-50 flex items-center"
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
        )}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A71] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{userData.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editedData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A71] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{userData.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Birthdate
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editedData.birthdate}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A71] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{userData.birthdate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editedData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A71] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{userData.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <p className="text-gray-900 dark:text-white">{userData.role}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            About
          </label>
          {isEditing ? (
            <textarea
              value={editedData.about}
              onChange={(e) => handleChange('about', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A71] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ) : (
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{userData.about}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Address
          </label>
          {isEditing ? (
            <textarea
              value={editedData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A71] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ) : (
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{formatAddress(userData.address)}</p>
          )}
        </div>
      </div>
    </div>
  );
} 