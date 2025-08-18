#!/usr/bin/env node

/**
 * Check Supabase connection and configuration
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 Checking Supabase configuration...\n')

// Check environment variables
if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL is not set')
  process.exit(1)
}

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY is not set')
  process.exit(1)
}

console.log('✅ Environment variables are set')
console.log(`📍 Supabase URL: ${supabaseUrl}`)
console.log(`🔑 Anon Key: ${supabaseAnonKey.substring(0, 20)}...`)

// Test connection
const supabase = createClient(supabaseUrl, supabaseAnonKey)

try {
  console.log('\n🔌 Testing connection...')
  
  // Test basic connection
  const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
  
  if (error) {
    if (error.code === 'PGRST116') {
      console.log('⚠️  Profiles table does not exist yet - you need to set up the database schema')
      console.log('📖 See SUPABASE_SETUP.md for instructions')
    } else {
      console.error('❌ Connection error:', error.message)
      process.exit(1)
    }
  } else {
    console.log('✅ Successfully connected to Supabase!')
    console.log(`📊 Profiles table has ${data || 0} rows`)
  }

  // Test auth
  console.log('\n🔐 Testing auth service...')
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError && authError.message !== 'Auth session missing!') {
    console.error('❌ Auth error:', authError.message)
  } else {
    console.log('✅ Auth service is working')
    if (user) {
      console.log(`👤 Current user: ${user.email}`)
    } else {
      console.log('👤 No user currently logged in')
    }
  }

  // Test storage
  console.log('\n💾 Testing storage service...')
  try {
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets()
    
    if (storageError) {
      console.log('⚠️  Storage error:', storageError.message)
    } else {
      console.log('✅ Storage service is working')
      const avatarBucket = buckets?.find(bucket => bucket.name === 'avatars')
      if (avatarBucket) {
        console.log('✅ Avatars bucket exists and is configured')
      } else {
        console.log('⚠️  Avatars bucket not found - you need to create it for profile photos')
        console.log('📖 See SUPABASE_SETUP.md section 3 for storage setup')
      }
    }
  } catch (err: any) {
    console.log('⚠️  Could not test storage:', err.message)
  }

} catch (err) {
  console.error('❌ Unexpected error:', err.message)
  process.exit(1)
}

console.log('\n🎉 Supabase configuration looks good!')
console.log('\n📝 Next steps:')
console.log('1. Run `npm run dev` to start the development server')
console.log('2. Open http://localhost:3000 in your browser')
console.log('3. Try signing up with an email to test authentication')
console.log('4. Upload a profile photo to test storage functionality')
console.log('5. Check your Supabase dashboard to see the data')
