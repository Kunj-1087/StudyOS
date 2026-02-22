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
  signInWithGoogle: () => Promise<void>
  resetPassword: (email: string) => Promise<AuthResult>
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
  const [loading, setLoading] = useState(true)

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
          setLoading(false)
        }

        // Handle specific auth events
        if (event === "SIGNED_IN") {
          console.log("[Auth] User signed in:", currentSession?.user?.email)
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
    async (
      email: string,
      password: string,
      fullName: string
    ): Promise<AuthResult> => {
      try {
        console.log("[Auth] Attempting signup for:", email)

        // Normalize email to lowercase
        const normalizedEmail = email.toLowerCase().trim()
        const trimmedPassword = password

        if (!normalizedEmail || !trimmedPassword) {
          return {
            success: false,
            error: "Email and password are required.",
          }
        }

        if (trimmedPassword.length < 6) {
          return {
            success: false,
            error: "Password must be at least 6 characters.",
          }
        }

        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password: trimmedPassword,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        })

        if (error) {
          console.error("[Auth] Signup error:", error)
          return {
            success: false,
            error: parseAuthError(error),
          }
        }

        // Check if email confirmation is required
        if (
          data.user &&
          !data.session &&
          !data.user.email_confirmed_at
        ) {
          console.log("[Auth] Email confirmation required")
          return {
            success: true,
            error: null,
            needsEmailConfirmation: true,
          }
        }

        // Create profile in public.users table
        if (data.user) {
          await createUserProfile(
            data.user.id,
            normalizedEmail,
            fullName.trim()
          )
        }

        console.log("[Auth] Signup successful:", data.user?.email)
        return { success: true, error: null }
      } catch (err) {
        console.error("[Auth] Unexpected signup error:", err)
        return {
          success: false,
          error: "An unexpected error occurred. Please try again.",
        }
      }
    },
    []
  )

  // ─── SIGN IN ───────────────────────────────────────
  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      try {
        console.log("[Auth] Attempting login for:", email)

        // IMPORTANT: Normalize email exactly as done during signup
        const normalizedEmail = email.toLowerCase().trim()
        // IMPORTANT: Do NOT trim or modify password
        const rawPassword = password

        if (!normalizedEmail || !rawPassword) {
          return {
            success: false,
            error: "Email and password are required.",
          }
        }

        // MUST use signInWithPassword for Supabase v2
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: rawPassword,
        })

        if (error) {
          console.error("[Auth] Login error code:", error.status)
          console.error("[Auth] Login error message:", error.message)

          // Handle specific error cases
          if (
            error.message.includes("Email not confirmed") ||
            error.message.includes("email_not_confirmed")
          ) {
            return {
              success: false,
              error:
                "Please confirm your email first. Check your inbox for a confirmation link.",
              needsEmailConfirmation: true,
            }
          }

          if (
            error.message.includes("Invalid login credentials") ||
            error.message.includes("invalid_credentials") ||
            error.status === 400
          ) {
            return {
              success: false,
              error:
                "Incorrect email or password. Please check your credentials and try again.",
            }
          }

          return {
            success: false,
            error: parseAuthError(error),
          }
        }

        if (!data.session) {
          return {
            success: false,
            error:
              "Login failed. Please confirm your email address first.",
            needsEmailConfirmation: true,
          }
        }

        console.log("[Auth] Login successful:", data.user?.email)

        // Ensure profile exists after login
        if (data.user) {
          await ensureUserProfile(data.user.id, data.user.email!)
        }

        return { success: true, error: null }
      } catch (err) {
        console.error("[Auth] Unexpected login error:", err)
        return {
          success: false,
          error: "An unexpected error occurred. Please try again.",
        }
      }
    },
    []
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

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    resetPassword,
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
        full_name: fullName,
        role: "student",
        domains_enrolled: 0,
        resources_contributed: 0,
        reputation_score: 0,
        streak_days: 0,
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
    return "Incorrect email or password. Please try again."
  }

  if (
    message.includes("email not confirmed") ||
    message.includes("email_not_confirmed")
  ) {
    return "Please confirm your email. Check your inbox."
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
    return "Too many attempts. Please wait a few minutes and try again."
  }

  if (message.includes("network") || message.includes("fetch")) {
    return "Network error. Please check your internet connection."
  }

  return error.message || "Authentication failed. Please try again."
}
