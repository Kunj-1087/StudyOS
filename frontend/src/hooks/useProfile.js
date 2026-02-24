import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../context/AuthContext"
import { userApi } from "../lib/api"

export function useProfile() {
  const { user, profile: authProfile } = useAuth()
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
      let stats = {}
      try {
        const statsRes = await userApi.getStats()
        stats = statsRes.data || {}
      } catch (e) {
        console.warn("[useProfile] Stats API unavailable, using defaults")
      }
      
      setProfile({
        ...authProfile,
        full_name: authProfile?.name || authProfile?.full_name || "Operator", 
        domains_enrolled: stats.domains_started || stats.domains_enrolled || 0,
        resources_contributed: stats.resources_contributed || authProfile?.contribution_count || 0,
        reputation_score: stats.reputation_score || authProfile?.reputation_score || 0,
        streak_days: stats.streak_days || 0,
        bio: authProfile?.bio || ""
      })
    } catch (err) {
      console.error("[useProfile] Error fetching profile:", err)
      setProfile(authProfile)
    } finally {
      setLoading(false)
    }
  }, [user, authProfile])

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
