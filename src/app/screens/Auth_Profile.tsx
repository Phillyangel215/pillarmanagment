/**
 * @fileoverview Auth_Profile - User profile management screen
 * @description Allows users to view and edit their profile information including avatar upload
 * @version 1.0.0 - Initial implementation with Supabase integration
 * @requires Supabase Auth configured with profiles table and avatars storage bucket
 * @hipaa Handles user profile data - audit logging recommended
 */

import React from 'react'
import { AuthExample } from '../../components/auth/AuthExample'

export default function Auth_Profile() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Profile
          </h1>
          <p className="text-gray-600">
            Manage your account settings and profile information
          </p>
        </div>
        
        <AuthExample />
      </div>
    </div>
  )
}
