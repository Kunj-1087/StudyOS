import {
  createContext,
  useContext,
  ReactNode,
} from "react"

// ─── Types ───────────────────────────────────────────
interface AuthContextType {
  user: any | null
  session: any | null
  profile: any | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  signInWithGoogle: () => Promise<void>
  resetPassword: (email: string) => Promise<any>
  resendVerification: (email: string) => Promise<any>
}

// ─── Context ─────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ─── Mock User Data ──────────────────────────────────────
const mockUser = {
  id: "internal-operator-id",
  email: "operator@internal.studyos.com",
}

const mockProfile = {
  id: "internal-operator-id",
  name: "Operator",
  email: "operator@internal.studyos.com",
  role: "admin",
  contribution_count: 999,
  reputation_score: 9999,
  skill_index: 9.9,
  execution_score: 9.9,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// ─── Provider ────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const value: AuthContextType = {
    user: mockUser,
    session: { access_token: "internal-token", user: mockUser },
    profile: mockProfile,
    loading: false,
    isAuthenticated: true,
    signUp: async () => ({ success: true, error: null }),
    signIn: async () => ({ success: true, error: null }),
    signOut: async () => {},
    logout: async () => {},
    signInWithGoogle: async () => {},
    resetPassword: async () => ({ success: true, error: null }),
    resendVerification: async () => ({ success: true, error: null }),
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
