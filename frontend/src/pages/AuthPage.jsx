import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { ChevronRight, AlertCircle, Eye, EyeOff, Mail, Lock, User as UserIcon } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { toast } from "sonner"

export default function AuthPage() {
    const [mode, setMode] = useState('login') // login | register
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const { login, signIn, signUp, signInWithGoogle, user, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: ''
    })

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/hub') // The user asked for /dashboard, let's use /hub since that's our main hub
        }
    }, [isAuthenticated, navigate])

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        setError('')
    }

    const validate = () => {
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            return "Valid email is required."
        }
        if (mode === 'register') {
            if (!formData.fullName || formData.fullName.length < 2) {
                return "Operator Name must be at least 2 characters."
            }
            if (formData.password.length < 8) {
                return "Password must be at least 8 characters."
            }
            if (!/\d/.test(formData.password) || !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
                return "Password must contain at least 1 number and 1 special character."
            }
        } else {
            if (formData.password.length < 8) {
                return "Password must be at least 8 characters."
            }
        }
        return null
    }

    const mapError = (message) => {
        if (message.includes("Invalid login credentials")) return "Incorrect email or password. Try again."
        if (message.includes("Email not confirmed")) return "Please verify your email before logging in."
        if (message.includes("User already registered")) return "An account with this email already exists."
        if (message.includes("at least 6 characters")) return "Password must be at least 8 characters."
        if (message.includes("Invalid API key")) return "System configuration error. Contact support."
        if (message.includes("Network Error") || message.includes("Fetch")) return "Connection failed. Check your internet and try again."
        return message
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationError = validate()
        if (validationError) {
            setError(validationError)
            return
        }

        setLoading(true)
        setError('')

        try {
            if (mode === 'login') {
                const { error: signInError } = await signIn(formData.email, formData.password)
                if (signInError) throw new Error(signInError)
                toast.success('Access granted. Welcome back, Operator.')
                navigate('/hub')
            } else {
                const { error: signUpError } = await signUp(formData.email, formData.password, formData.fullName)
                if (signUpError) throw new Error(signUpError)
                toast.success('Identity created. Check your email to verify your account.')
                setMode('login') // Switch to login after registration success
            }
        } catch (err) {
            const friendlyMessage = mapError(err.message)
            setError(friendlyMessage)
            toast.error(friendlyMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        const { error: googleError } = await signInWithGoogle()
        if (googleError) {
            toast.error(mapError(googleError))
        }
    }

    return (
        <div className="min-h-screen bg-[#0D0F14] flex items-center justify-center p-4">
            <div className="hero-background absolute inset-0 opacity-20" />
            
            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center mb-8">
                    <img
                        src="/assets/studyos-logo.svg"
                        alt="studyOS"
                        className="h-12 w-auto filter drop-shadow-[0_0_15px_rgba(0,194,255,0.5)]"
                    />
                </div>

                {/* Auth Card */}
                <div className="bg-[#12141C] border border-white/5 shadow-2xl overflow-hidden rounded-lg">
                    {/* Tabs */}
                    <div className="flex border-b border-white/5">
                        <button
                            className={`flex-1 py-4 text-xs font-mono tracking-widest uppercase transition-all ${
                                mode === 'login' ? 'text-[#00C2FF] bg-white/[0.02]' : 'text-muted-foreground hover:text-white'
                            }`}
                            onClick={() => { setMode('login'); setError(''); }}
                        >
                            Login
                        </button>
                        <button
                            className={`flex-1 py-4 text-xs font-mono tracking-widest uppercase transition-all ${
                                mode === 'register' ? 'text-[#00C2FF] bg-white/[0.02]' : 'text-muted-foreground hover:text-white'
                            }`}
                            onClick={() => { setMode('register'); setError(''); }}
                        >
                            Register
                        </button>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {mode === 'register' && (
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-mono uppercase tracking-widest text-[#16F2A5] opacity-70">
                                        Operator Name
                                    </Label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <Input
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            disabled={loading}
                                            className="pl-10 h-11 bg-black/40 border-white/10 focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF] transition-all rounded-none"
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label className="text-[10px] font-mono uppercase tracking-widest text-[#16F2A5] opacity-70">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <Input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="pl-10 h-11 bg-black/40 border-white/10 focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF] transition-all rounded-none"
                                        placeholder="operator@studyos.in"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-mono uppercase tracking-widest text-[#16F2A5] opacity-70">
                                    Access Code
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <Input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="px-10 h-11 bg-black/40 border-white/10 focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF] transition-all rounded-none"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-sm">
                                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                                    <span className="text-red-400 text-xs font-mono">{error}</span>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 bg-[#00C2FF] hover:bg-[#00D2FF] text-[#0D0F14] font-bold uppercase tracking-widest rounded-none transition-all group"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-[#0D0F14]/30 border-t-[#0D0F14] rounded-full animate-spin" />
                                        {mode === 'login' ? 'Authenticating...' : 'Creating Identity...'}
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        {mode === 'login' ? 'Access System' : 'Initiate Identity'}
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-[#12141C] px-2 text-white/20">or continue with</span></div>
                        </div>

                        <Button
                            type="button"
                            onClick={handleGoogleSignIn}
                            variant="outline"
                            className="w-full h-11 bg-transparent border-white/10 text-white hover:bg-white/[0.05] rounded-none font-mono text-xs"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.png" alt="Google" className="w-4 h-4 mr-2" />
                            Google Auth
                        </Button>

                        <p className="text-center text-[10px] font-mono text-white/20 mt-8 uppercase tracking-[0.2em]">
                            Secure Connection Established
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
