"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Auth callback error:", error)
        router.push("/?error=auth_failed")
        return
      }

      if (data.session?.user) {
        // Create or update user profile
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", data.session.user.id)
          .single()

        if (!profile) {
          await supabase.from("user_profiles").insert({
            id: data.session.user.id,
            name: data.session.user.user_metadata?.full_name || data.session.user.email?.split("@")[0] || "User",
            email: data.session.user.email || "",
            avatar_url:
              data.session.user.user_metadata?.avatar_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.session.user.email}`,
          })
        }

        router.push("/")
      } else {
        router.push("/?error=no_session")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
        <p>Completing sign in...</p>
      </div>
    </div>
  )
}
