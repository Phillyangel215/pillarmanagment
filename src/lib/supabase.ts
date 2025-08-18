import { createClient } from '@supabase/supabase-js'

// Your Supabase project configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ponclzjxzgoizmfvdzog.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(
	supabaseUrl,
	supabaseAnonKey,
	{ 
		auth: { 
			persistSession: true,
			autoRefreshToken: true,
			detectSessionInUrl: true
		} 
	}
)
