import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../context/AuthContext"
import { userApi } from "../lib/api"
import { supabase } from "../lib/supabase"

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      // Fetch data from supabase users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()

      if (userError) {
        console.warn("[useProfile] Supabase query error:", userError.message)
        // Don't throw — still try to build profile from auth user data
      }

      // Try to fetch additional stats from backend API (non-critical)
      let stats = {}
      try {
        const statsRes = await userApi.getStats()
        stats = statsRes.data || {}
      } catch (e) {
        // Stats API failure is not critical — profile still works
        console.warn("[useProfile] Stats API unavailable, using defaults")
      }
      
      setProfile({
        ...userData,
        email: user.email,
        full_name: userData?.name || user.user_metadata?.full_name || "Operator",
        role: userData?.role || "Student",
        domains_enrolled: stats.domains_started || stats.domains_enrolled || 0,
        resources_contributed: stats.resources_contributed || userData?.contribution_count || 0,
        reputation_score: userData?.reputation_score || 0,
        streak_days: stats.streak_days || 0,
        bio: userData?.bio || ""
      })
    } catch (err) {
      console.error("[useProfile] Error fetching profile:", err)
      // Even on error, provide a minimal profile from auth user data
      setProfile({
        email: user.email,
        full_name: user.user_metadata?.full_name || "Operator",
        role: "Student",
        domains_enrolled: 0,
        resources_contributed: 0,
        reputation_score: 0,
        streak_days: 0,
        bio: ""
      })
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchProfile()
    } else {
      setProfile(null)
      setLoading(false)
    }
  }, [user, fetchProfile])

  return { profile, loading, error, refreshProfile: fetchProfile }
}
