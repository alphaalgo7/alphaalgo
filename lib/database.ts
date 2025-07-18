import { supabase, isSupabaseAvailable } from "./supabase"

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
  name: string
  strategy_data: any[]
  stoxxo_number?: string
  instrument?: string
  plan_letters?: string
  is_public: boolean
  created_at: string
  updated_at: string
}

// User Profile Operations
export async function createUserProfile(profile: Omit<UserProfile, "created_at" | "updated_at">) {
  if (!isSupabaseAvailable() || !supabase) {
    throw new Error("Database not available")
  }

  const { data, error } = await supabase.from("user_profiles").insert(profile).select().single()

  if (error) throw error
  return data
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseAvailable() || !supabase) {
    return null
  }

  const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  if (!isSupabaseAvailable() || !supabase) {
    throw new Error("Database not available")
  }

  const { data, error } = await supabase.from("user_profiles").update(updates).eq("id", userId).select().single()

  if (error) throw error
  return data
}

// Strategy Operations
export async function saveStrategy(strategy: Omit<StrategyRecord, "id" | "created_at" | "updated_at">) {
  if (!isSupabaseAvailable() || !supabase) {
    throw new Error("Database not available")
  }

  const { data, error } = await supabase.from("strategies").insert(strategy).select().single()

  if (error) throw error
  return data
}

export async function getUserStrategies(userId: string): Promise<StrategyRecord[]> {
  if (!isSupabaseAvailable() || !supabase) {
    return []
  }

  const { data, error } = await supabase
    .from("strategies")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching strategies:", error)
    return []
  }

  return data || []
}

export async function updateStrategy(strategyId: string, updates: Partial<StrategyRecord>) {
  if (!isSupabaseAvailable() || !supabase) {
    throw new Error("Database not available")
  }

  const { data, error } = await supabase.from("strategies").update(updates).eq("id", strategyId).select().single()

  if (error) throw error
  return data
}

export async function deleteStrategy(strategyId: string) {
  if (!isSupabaseAvailable() || !supabase) {
    throw new Error("Database not available")
  }

  const { error } = await supabase.from("strategies").delete().eq("id", strategyId)

  if (error) throw error
}

// Public strategies for community features
export async function getPublicStrategies(limit = 20): Promise<StrategyRecord[]> {
  if (!isSupabaseAvailable() || !supabase) {
    return []
  }

  const { data, error } = await supabase
    .from("strategies")
    .select(`
      *,
      user_profiles!inner(name, avatar_url)
    `)
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching public strategies:", error)
    return []
  }

  return data || []
}
