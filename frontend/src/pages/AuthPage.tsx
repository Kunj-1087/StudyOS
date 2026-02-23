import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase"

type AuthMode = "login" | "register"

export default function AuthPage() {
    const { signIn, signUp, signInWithGoogle, user, loading, resendVerification } = useAuth()
    const navigate = useNavigate()

    const [mode, setMode] = useState<AuthMode>("login")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [needsConfirmation, setNeedsConfirmation] = useState(false)
    const [resendSuccess, setResendSuccess] = useState(false)

    // Redirect if already logged in
    useEffect(() => {
        if (!loading && user) {
            navigate("/dashboard", { replace: true })
        }
    }, [user, loading, navigate])

    const resetForm = () => {
        setError(null)
        setSuccess(null)
        setNeedsConfirmation(false)
        setResendSuccess(false)
    }

    const switchMode = (newMode: AuthMode, clearFields = true) => {
        setMode(newMode)
        resetForm()
        if (clearFields) {
            setEmail("")
            setPassword("")
            setConfirmPassword("")
            setFullName("")
        }
    }

    const validateForm = (): string | null => {
        if (!email.trim()) return "Email is required."
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return "Please enter a valid email address."
        }
        if (!password) return "Password is required."
        if (password.length < 6) {
            return "Password must be at least 6 characters."
        }
        if (mode === "register") {
            if (!fullName.trim()) return "Full name is required."
            if (fullName.trim().length < 2) {
                return "Full name must be at least 2 characters."
            }
            if (password !== confirmPassword) {
                return "Passwords do not match."
            }
        }
        return null
    }

    const [backendStatus, setBackendStatus] = useState<"online" | "offline" | "checking">("checking")
    const [supabaseStatus, setSupabaseStatus] = useState<"online" | "offline" | "checking">("checking")

    // Check system health on mount
    useEffect(() => {
        const checkHealth = async () => {
            try {
                // Check Backend
                const res = await fetch("/api/health")
                if (res.ok) setBackendStatus("online")
                else setBackendStatus("offline")
            } catch {
                setBackendStatus("offline")
            }

            try {
                // Check Supabase - more robust check
                const { error } = await supabase.auth.getSession()
                // A null error means connectivity is good, regardless of session presence
                if (error === null) {
                    setSupabaseStatus("online")
                } else {
                    console.warn("[AuthPage] Supabase connectivity check error:", error)
                    setSupabaseStatus("offline")
                }
            } catch (err) {
                console.error("[AuthPage] Supabase health check exception:", err)
                setSupabaseStatus("offline")
            }
        }
        checkHealth()
    }, [])

    const handleResendLink = async () => {
        setIsSubmitting(true)
        const result = await resendVerification(email)
        if (result.success) {
            setResendSuccess(true)
            setSuccess("A new activation link has been dispatched to your inbox.")
        } else {
            setError(result.error)
        }
        setIsSubmitting(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        resetForm()

        const validationError = validateForm()
        if (validationError) {
            setError(validationError)
            return
        }

        setIsSubmitting(true)
        console.log(`[AuthPage] Starting ${mode} flow for ${email}`)

        try {
            if (mode === "login") {
                const result = await signIn(email, password)
                if (result.success) {
                    setSuccess("Access Granted. Synchronizing Hub...")
                    setTimeout(() => navigate("/dashboard", { replace: true }), 800)
                } else {
                    setError(result.error)
                }
            } else {
                const result = await signUp(email, password, fullName)
                if (result.success) {
                    setSuccess("Identity Confirmed. Access Granted.")
                    setTimeout(() => navigate("/dashboard", { replace: true }), 1000)
                } else {
                    setError(result.error)
                }
            }
        } catch (err: any) {
            console.error("[AuthPage] Critical error:", err)
            setError(`Systemic error: ${err.message || "Unknown Failure"}.`)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0D0F14] flex items-center justify-center">
                <div className="text-[#00C2FF] font-mono text-lg animate-pulse tracking-widest">
                    SYNCHRONIZING AUTH STATE...
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0D0F14] flex flex-col items-center justify-center p-4">
            
            {/* System Status Indicators */}
            <div className="flex gap-4 mb-8 font-mono text-[10px] tracking-widest">
                <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${supabaseStatus === "online" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500 animate-pulse"}`} />
                    <span className={supabaseStatus === "online" ? "text-green-500/80" : "text-red-500"}>SUPABASE: {supabaseStatus.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${backendStatus === "online" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500 animate-pulse"}`} />
                    <span className={backendStatus === "online" ? "text-green-500/80" : "text-red-500"}>API: {backendStatus.toUpperCase()}</span>
                </div>
            </div>

            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-10">
                    <button 
                        onClick={() => navigate("/")}
                        className="group hover:opacity-80 transition-opacity"
                    >
                        <h1 className="text-3xl font-mono font-bold text-[#00C2FF] tracking-widest uppercase group-hover:drop-shadow-[0_0_8px_rgba(0,194,255,0.4)]">
                            STUDYOS
                        </h1>
                        <p className="text-[#8B9CB3] text-sm mt-2 tracking-wider">
                            Academic Intelligence System
                        </p>
                    </button>
                </div>

                {/* Card */}
                <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-2xl p-8 relative overflow-hidden">
                    {/* Decorative Scanner Line */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00C2FF] to-transparent animate-[scan_2s_linear_infinite]" />

                    {/* Tabs */}
                    <div className="flex mb-8 bg-[#0D0F14] rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => switchMode("login")}
                            className={`flex-1 py-2 text-sm font-mono tracking-wider uppercase rounded-md transition-all duration-200 ${
                                mode === "login"
                                    ? "bg-[#00C2FF] text-black font-bold shadow-[0_0_15px_rgba(0,194,255,0.4)]"
                                    : "text-[#8B9CB3] hover:text-white"
                            }`}
                        >
                            LOGIN
                        </button>
                        <button
                            type="button"
                            onClick={() => switchMode("register")}
                            className={`flex-1 py-2 text-sm font-mono tracking-wider uppercase rounded-md transition-all duration-200 ${
                                mode === "register"
                                    ? "bg-[#00C2FF] text-black font-bold shadow-[0_0_15px_rgba(0,194,255,0.4)]"
                                    : "text-[#8B9CB3] hover:text-white"
                            }`}
                        >
                            REGISTER
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                            <span className="text-red-400 text-lg mt-0.5">✕</span>
                            <p className="text-red-400 text-sm font-mono leading-relaxed">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-[#16F2A5]/10 border border-[#16F2A5]/30 rounded-lg flex items-start gap-3">
                            <span className="text-[#16F2A5] text-lg mt-0.5">✓</span>
                            <p className="text-[#16F2A5] text-sm font-mono leading-relaxed">{success}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Full Name (register only) */}
                        {mode === "register" && (
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-[#8B9CB3] mb-2">
                                    FULL NAME
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    autoComplete="name"
                                    className="w-full bg-[#0D0F14] border border-[#2A2D35] rounded-lg px-4 py-3 text-white placeholder-[#4A5568] focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF] transition-all duration-200"
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-[#8B9CB3] mb-2">
                                EMAIL ADDRESS
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="operator@studyos.in"
                                autoComplete="email"
                                className="w-full bg-[#0D0F14] border border-[#2A2D35] rounded-lg px-4 py-3 text-white placeholder-[#4A5568] focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF] transition-all duration-200"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-[#8B9CB3] mb-2">
                                ACCESS CODE
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete={
                                        mode === "login" ? "current-password" : "new-password"
                                    }
                                    className="w-full bg-[#0D0F14] border border-[#2A2D35] rounded-lg px-4 py-3 pr-12 text-white placeholder-[#4A5568] focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF] transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B9CB3] hover:text-white transition-colors"
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password (register only) */}
                        {mode === "register" && (
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-[#8B9CB3] mb-2">
                                    CONFIRM ACCESS CODE
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    className="w-full bg-[#0D0F14] border border-[#2A2D35] rounded-lg px-4 py-3 text-white placeholder-[#4A5568] focus:outline-none focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF] transition-all duration-200"
                                />
                            </div>
                        )}

                        {/* Forgot Password */}
                        {mode === "login" && (
                            <div className="text-right">
                                <button
                                    type="button"
                                    className="text-xs text-[#00C2FF] hover:text-[#16F2A5] transition-colors font-mono"
                                    onClick={() => {
                                        /* implement forgot password flow */
                                    }}
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-[#00C2FF] hover:bg-[#00A8E0] disabled:bg-[#00C2FF]/50 disabled:cursor-not-allowed text-black font-mono font-bold uppercase tracking-widest rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    {mode === "login" ? "AUTHENTICATING..." : "CREATING ACCOUNT..."}
                                </>
                            ) : (
                                mode === "login" ? "ACCESS SYSTEM ›" : "CREATE IDENTITY ›"
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#2A2D35]" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-[#1A1D24] px-3 text-[#8B9CB3] font-mono">
                                    OR CONTINUE WITH
                                </span>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <button
                            type="button"
                            onClick={signInWithGoogle}
                            className="w-full py-3 bg-transparent border border-[#2A2D35] hover:border-[#00C2FF] text-white font-mono text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-3"
                        >
                            <span>G</span>
                            <span>Continue with Google</span>
                        </button>

                    </form>

                </div>

                {/* Footer */}
                <p className="text-center text-[#8B9CB3] text-xs mt-6 font-mono">
                    {mode === "login"
                        ? "No account? "
                        : "Already have an account? "}
                    <button
                        type="button"
                        onClick={() =>
                            switchMode(mode === "login" ? "register" : "login")
                        }
                        className="text-[#00C2FF] hover:text-[#16F2A5] transition-colors"
                    >
                        {mode === "login" ? "Register here" : "Login here"}
                    </button>
                </p>

            </div>
        </div>
    )
}
