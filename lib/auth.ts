import { supabase, isSupabaseAvailable } from "./supabase"
import { createUserProfile, getUserProfile } from "./database"

export interface AuthUser {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
  lastLogin: string
}

export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  if (!isSupabaseAvailable() || !supabase) {
    // Demo mode fallback
    return {
      id: `demo_${Date.now()}`,
      name: email.split("@")[0],
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  if (!data.user) throw new Error("No user returned")

  // Get or create user profile
  let profile = await getUserProfile(data.user.id)

  if (!profile) {
    profile = await createUserProfile({
      id: data.user.id,
      name: data.user.user_metadata?.full_name || email.split("@")[0],
      email: data.user.email || email,
      avatar_url: data.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    })
  }

  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    avatar: profile.avatar_url,
    createdAt: profile.created_at,
    lastLogin: new Date().toISOString(),
  }
}

export async function signUpWithEmail(email: string, password: string, name: string): Promise<void> {
  if (!isSupabaseAvailable() || !supabase) {
    throw new Error("Signup not available in demo mode")
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  })

  if (error) throw error

  // Profile will be created on first sign in
}

export async function signOut(): Promise<void> {
  if (!isSupabaseAvailable() || !supabase) {
    return
  }

  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!isSupabaseAvailable() || !supabase) {
    return null
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const profile = await getUserProfile(user.id)
  if (!profile) return null

  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    avatar: profile.avatar_url,
    createdAt: profile.created_at,
    lastLogin: new Date().toISOString(),
  }
}
