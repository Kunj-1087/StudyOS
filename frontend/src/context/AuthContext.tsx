import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react"
import { User, Session, AuthError } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"

// ─── Types ───────────────────────────────────────────
interface AuthContextType {
  user: User | null
  session: Session | null
  profile: any | null
  loading: boolean
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<AuthResult>
  signIn: (
    email: string,
    password: string
  ) => Promise<AuthResult>
  signOut: () => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  signInWithGoogle: () => Promise<void>
  resetPassword: (email: string) => Promise<AuthResult>
  resendVerification: (email: string) => Promise<AuthResult>
}

interface AuthResult {
  success: boolean
  error: string | null
  needsEmailConfirmation?: boolean
}

// ─── Context ─────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ─── Provider ────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle()
      
      if (data) {
        setProfile(data)
      } else if (error) {
        console.warn("[Auth] Profile fetch error:", error)
      }
    } catch (err) {
      console.error("[Auth] Profile fetch failed:", err)
    }
  }, [])

  // Initialize auth state from existing session
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Get existing session from localStorage
        const {
          data: { session: existingSession },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("[Auth] Session retrieval error:", error)
        }

        if (mounted) {
          setSession(existingSession)
          setUser(existingSession?.user ?? null)
          setLoading(false)
        }
      } catch (err) {
        console.error("[Auth] Init error:", err)
        if (mounted) setLoading(false)
      }
    }

    initializeAuth()

    // Listen for ALL auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("[Auth] State changed:", event, currentSession?.user?.email)

        if (mounted) {
          setSession(currentSession)
          setUser(currentSession?.user ?? null)
          if (!currentSession?.user) {
            setProfile(null)
          }
          setLoading(false)
        }

        if (currentSession?.user && event === "SIGNED_IN") {
          fetchProfile(currentSession.user.id)
        }

        // Handle specific auth events
        if (event === "SIGNED_IN" && currentSession?.user) {
          console.log("[Auth] User signed in:", currentSession.user.email)
          ensureUserProfile(currentSession.user.id, currentSession.user.email!)
        }

        if (event === "SIGNED_OUT") {
          console.log("[Auth] User signed out")
          setUser(null)
          setSession(null)
        }

        if (event === "TOKEN_REFRESHED") {
          console.log("[Auth] Token refreshed")
        }

        if (event === "USER_UPDATED") {
          console.log("[Auth] User updated")
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // ─── SIGN UP ───────────────────────────────────────
  const signUp = useCallback(
    async (email: string, password: string, fullName: string): Promise<AuthResult> => {
      setLoading(true)
      const normalizedEmail = email.toLowerCase().trim()
      
      try {
        console.log("[Auth] Initializing Instant Access for:", normalizedEmail)
        
        // 1. Force identity creation/healing via backend
        const accessRes = await fetch("/api/auth/instant-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: normalizedEmail, password, fullName }),
        })

        if (!accessRes.ok) {
           const errData = await accessRes.json()
           throw new Error(errData.detail || "Identity initialization failed")
        }

        // 2. Perform direct Supabase Login
        console.log("[Auth] Identity ready. Performing direct entry...")
        await new Promise(r => setTimeout(r, 1000)) // Wait for propagation
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: password,
        })

        if (error) throw error

        if (data.user && data.session) {
          setUser(data.user)
          setSession(data.session)
          await fetchProfile(data.user.id)
          setLoading(false)
          return { success: true, error: null }
        }

        throw new Error("Session establishment failed")
      } catch (err: any) {
        console.error("[Auth] Access failed:", err)
        setLoading(false)
        return { success: false, error: parseAuthError(err) }
      }
    },
    [fetchProfile]
  )

  // ─── SIGN IN ───────────────────────────────────────
  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setLoading(true)
      const normalizedEmail = email.toLowerCase().trim()

      try {
        console.log("[Auth] Direct Entry protocol initiated for:", normalizedEmail)
        
        // 1. Try standard login first
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        })

        if (!error && data.session) {
          setUser(data.user)
          setSession(data.session)
          if (data.user) await fetchProfile(data.user.id)
          setLoading(false)
          return { success: true, error: null }
        }

        // 2. Failure? Trigger Instant Healing then retry
        console.warn("[Auth] Standard entry failed. Activating Instant Healing...")
        const fixRes = await fetch("/api/auth/instant-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: normalizedEmail, password }),
        })

        if (fixRes.ok) {
           console.log("[Auth] Identity healed. Synchronizing...")
           await new Promise(r => setTimeout(r, 1200))
           const retry = await supabase.auth.signInWithPassword({
             email: normalizedEmail,
             password,
           })

           if (!retry.error && retry.data.session) {
              setUser(retry.data.user)
              setSession(retry.data.session)
              if (retry.data.user) await fetchProfile(retry.data.user.id)
              setLoading(false)
              return { success: true, error: null }
           }
           if (retry.error) throw retry.error
        }

        throw error || new Error("Authentication failed")
      } catch (err: any) {
        console.error("[Auth] Access denied:", err)
        setLoading(false)
        return { success: false, error: parseAuthError(err) }
      }
    },
    [fetchProfile]
  )

  // ─── SIGN OUT ──────────────────────────────────────
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) console.error("[Auth] Sign out error:", error)
      setUser(null)
      setSession(null)
    } catch (err) {
      console.error("[Auth] Unexpected sign out error:", err)
    }
  }, [])

  // ─── GOOGLE SIGN IN ────────────────────────────────
  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) console.error("[Auth] Google sign in error:", error)
    } catch (err) {
      console.error("[Auth] Unexpected Google sign in error:", err)
    }
  }, [])

  // ─── RESET PASSWORD ────────────────────────────────
  const resetPassword = useCallback(
    async (email: string): Promise<AuthResult> => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email.toLowerCase().trim(),
          {
            redirectTo: `${window.location.origin}/reset-password`,
          }
        )

        if (error) {
          return { success: false, error: parseAuthError(error) }
        }

        return { success: true, error: null }
      } catch (err) {
        return {
          success: false,
          error: "Failed to send reset email. Try again.",
        }
      }
    },
    []
  )

  // ─── RESEND VERIFICATION ───────────────────────────
  const resendVerification = useCallback(
    async (email: string): Promise<AuthResult> => {
      try {
        const { error } = await supabase.auth.resend({
          type: "signup",
          email: email.toLowerCase().trim(),
        })

        if (error) {
          return { success: false, error: parseAuthError(error) }
        }

        return { success: true, error: null }
      } catch (err) {
        return {
          success: false,
          error: "Failed to resend link. Try again.",
        }
      }
    },
    []
  )

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    logout: signOut,
    signInWithGoogle,
    resetPassword,
    resendVerification,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>")
  }
  return context
}

// ─── Helper: Create user profile ──────────────────────
async function createUserProfile(
  userId: string,
  email: string,
  fullName: string
) {
  try {
    const { error } = await supabase.from("users").upsert(
      {
        id: userId,
        email: email,
        name: fullName,
        role: "student",
        contribution_count: 0,
        reputation_score: 0,
        skill_index: 0.0,
        execution_score: 0.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )

    if (error) {
      console.error("[Auth] Profile creation error:", error)
    } else {
      console.log("[Auth] Profile created for:", email)
    }
  } catch (err) {
    console.error("[Auth] Unexpected profile creation error:", err)
  }
}

// ─── Helper: Ensure profile exists after login ─────────
async function ensureUserProfile(userId: string, email: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single()

    if (error && error.code === "PGRST116") {
      // Profile doesn't exist — create it
      await createUserProfile(userId, email, email.split("@")[0])
    }
  } catch (err) {
    console.error("[Auth] Profile check error:", err)
  }
}

// ─── Helper: Parse Supabase auth errors ───────────────
function parseAuthError(error: AuthError): string {
  const message = error.message.toLowerCase()

  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid_credentials")
  ) {
    return "Incorrect email or password. Verify your credentials."
  }

  if (
    message.includes("email not confirmed") ||
    message.includes("email_not_confirmed") ||
    error.status === 400 && message.includes("not confirmed")
  ) {
    return "IDENTITY UNVERIFIED: Check your email for the activation link."
  }

  if (message.includes("user already registered")) {
    return "An account with this email already exists. Please log in."
  }

  if (message.includes("password should be at least")) {
    return "Password must be at least 6 characters."
  }

  if (message.includes("unable to validate email address")) {
    return "Please enter a valid email address."
  }

  if (message.includes("email rate limit exceeded")) {
    return "Too many attempts. Please wait a few minutes."
  }

  if (message.includes("network") || message.includes("fetch")) {
    return "COMM LINK FAILURE: Unable to reach the Authentication Server."
  }

  // If it's a 400 but we didn't catch specific text, show more detail
  if (error.status === 400) {
    return `Access Denied: ${error.message}`
  }

  return error.message || "Authentication failed. System rejected the request."
}
