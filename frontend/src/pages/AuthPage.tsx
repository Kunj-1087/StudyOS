import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

type AuthMode = "login" | "register"

export default function AuthPage() {
    const { signIn, signUp, signInWithGoogle, user, loading } = useAuth()
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
    }

    const switchMode = (newMode: AuthMode) => {
        setMode(newMode)
        resetForm()
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setFullName("")
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        resetForm()

        const validationError = validateForm()
        if (validationError) {
            setError(validationError)
            return
        }

        setIsSubmitting(true)

        try {
            if (mode === "login") {
                console.log("[AuthPage] Attempting login with:", email)

                const result = await signIn(email, password)

                console.log("[AuthPage] Login result:", result)

                if (result.success) {
                    setSuccess("Login successful! Redirecting...")
                    setTimeout(() => navigate("/dashboard", { replace: true }), 500)
                } else if (result.needsEmailConfirmation) {
                    setNeedsConfirmation(true)
                    setError(result.error)
                } else {
                    setError(result.error || "Login failed. Please try again.")
                }
            } else {
                console.log("[AuthPage] Attempting registration with:", email)

                const result = await signUp(email, password, fullName)

                console.log("[AuthPage] Registration result:", result)

                if (result.success && result.needsEmailConfirmation) {
                    setNeedsConfirmation(true)
                    setSuccess(
                        "Account created! Please check your email and click the confirmation link before logging in."
                    )
                } else if (result.success) {
                    setSuccess(
                        "Account created successfully! You can now log in."
                    )
                    setTimeout(() => switchMode("login"), 2000)
                } else {
                    setError(result.error || "Registration failed. Please try again.")
                }
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0D0F14] flex items-center justify-center">
                <div className="text-[#00C2FF] font-mono text-lg animate-pulse tracking-widest">
                    INITIALIZING SYSTEM...
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0D0F14] flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-mono font-bold text-[#00C2FF] tracking-widest uppercase">
                        STUDYOS
                    </h1>
                    <p className="text-[#8B9CB3] text-sm mt-2 tracking-wider">
                        Academic Intelligence System
                    </p>
                </div>

                {/* Card */}
                <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-2xl p-8">

                    {/* Tabs */}
                    <div className="flex mb-8 bg-[#0D0F14] rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => switchMode("login")}
                            className={`flex-1 py-2 text-sm font-mono tracking-wider uppercase rounded-md transition-all duration-200 ${
                                mode === "login"
                                    ? "bg-[#00C2FF] text-black font-bold"
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
                                    ? "bg-[#00C2FF] text-black font-bold"
                                    : "text-[#8B9CB3] hover:text-white"
                            }`}
                        >
                            REGISTER
                        </button>
                    </div>

                    {/* Email Confirmation Notice */}
                    {needsConfirmation && (
                        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <p className="text-yellow-400 text-sm font-mono">
                                📧 CHECK YOUR EMAIL
                            </p>
                            <p className="text-yellow-300/80 text-xs mt-1">
                                A confirmation link has been sent to {email}.
                                Click it before trying to log in.
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && !needsConfirmation && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                            <span className="text-red-400 text-lg">✕</span>
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
                            <span className="text-green-400 text-lg">✓</span>
                            <p className="text-green-400 text-sm">{success}</p>
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
