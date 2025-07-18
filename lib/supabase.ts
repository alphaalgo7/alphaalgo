import { createClient } from "@supabase/supabase-js"

// Get environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Check if we have the required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables not found. Using demo mode.")
}

// Create Supabase client only if we have valid credentials
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => {
  return supabase !== null
}

// Types for our database
export interface UserProfile {
  id: string
  name: string
  email: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface StrategyRecord {
  id: string
  user_id: string
  strategy_data: any[]
  stoxxo_number?: string
  instrument?: string
  created_at: string
  updated_at: string
}
