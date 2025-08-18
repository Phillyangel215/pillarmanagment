import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Avatar from './Avatar'
import type { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  username?: string
  full_name?: string
  avatar_url?: string
  website?: string
  updated_at?: string
}

interface AccountProps {
  user: User
}

export default function Account({ user }: AccountProps) {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    getProfile()
  }, [user])

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '')
      setFullName(profile.full_name || '')
      setWebsite(profile.website || '')
      setAvatarUrl(profile.avatar_url || '')
    }
  }, [profile])

  async function getProfile() {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setProfile(data)
      }
    } catch (error: any) {
      alert('Error loading user data!')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile(event: React.FormEvent, newAvatarUrl?: string) {
    event.preventDefault()

    try {
      setLoading(true)

      const updates = {
        id: user.id,
        username,
        full_name: fullName,
        website,
        avatar_url: newAvatarUrl || avatarUrl,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }

      // Update local state
      if (newAvatarUrl) {
        setAvatarUrl(newAvatarUrl)
      }

      alert('Profile updated!')
    } catch (error: any) {
      alert('Error updating the data!')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Profile</h2>
        
        <form onSubmit={updateProfile} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex justify-center">
            <Avatar
              url={avatarUrl}
              size={150}
              onUpload={(event, url) => {
                updateProfile(event as unknown as React.FormEvent, url)
              }}
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="text"
              value={user.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Update Profile'}
            </button>

            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
            >
              Sign Out
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
