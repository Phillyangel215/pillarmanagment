/**
 * @fileoverview Demo_Avatar - Avatar upload demonstration screen
 * @description Shows how the Avatar component works with mock data for demo purposes
 * @version 1.0.0 - Demo implementation
 */

import React, { useState } from 'react'
import Avatar from '../../components/auth/Avatar'

export default function Demo_Avatar() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploadMessage, setUploadMessage] = useState<string>('')

  const handleAvatarUpload = (event: Event, url: string) => {
    setAvatarUrl(url)
    setUploadMessage(`Avatar uploaded successfully! File: ${url}`)
    
    // In a real app, you would save this to the user's profile
    console.log('Avatar uploaded:', url)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Avatar Upload Demo
          </h1>
          <p className="text-gray-600">
            Test the profile photo upload functionality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Demo Avatar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Avatar</h2>
            
            <div className="flex justify-center mb-4">
              <Avatar
                url={avatarUrl}
                size={150}
                onUpload={handleAvatarUpload}
              />
            </div>

            {uploadMessage && (
              <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {uploadMessage}
              </div>
            )}

            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Note:</strong> This demo shows the avatar component in action.</p>
              <p>In demo mode, uploads are simulated. For real uploads, you need:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Supabase project configured</li>
                <li>Storage bucket named "avatars"</li>
                <li>Proper storage policies set up</li>
              </ul>
            </div>
          </div>

          {/* Different Sizes Demo */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Different Sizes</h2>
            
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Small (80px)</p>
                <Avatar url={avatarUrl} size={80} editable={false} />
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Medium (120px)</p>
                <Avatar url={avatarUrl} size={120} editable={false} />
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Large (200px)</p>
                <Avatar url={avatarUrl} size={200} editable={false} />
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Ready to set up real avatar uploads?
          </h3>
          <p className="text-blue-800 mb-4">
            Follow these steps to enable actual file uploads with Supabase:
          </p>
          <div className="space-y-2 text-sm">
            <p><strong>1.</strong> Set up your Supabase project (see <code>SUPABASE_SETUP.md</code>)</p>
            <p><strong>2.</strong> Create the avatars storage bucket</p>
            <p><strong>3.</strong> Configure your environment variables</p>
            <p><strong>4.</strong> Test the connection with <code>npm run supabase:check</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}
