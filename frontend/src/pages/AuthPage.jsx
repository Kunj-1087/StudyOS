import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export default function AuthPage() {
    const [mode, setMode] = useState('login'); // login | register
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'login') {
                await login(formData.email, formData.password);
                toast.success('Access granted. Welcome back, Operator.');
            } else {
                await register(formData.email, formData.password, formData.name);
                toast.success('Identity created. Welcome to studyOS.');
            }
            navigate('/hub');
        } catch (err) {
            console.error('Auth error detailed:', err);
            const message = err.response?.data?.detail || err.message || 'Authentication failed';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="hero-background absolute inset-0" />
            <div className="hero-grid absolute inset-0" />

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center mb-8">
                    <img
                        src="/assets/studyos-logo.svg"
                        alt="StudyOS — Academic Intelligence System"
                        className="logo-glow"
                        style={{ height: '44px', width: 'auto' }}
                    />
                </div>

                {/* Auth Card */}
                <div className="auth-modal" data-testid="auth-modal">
                    {/* Tabs */}
                    <div className="auth-tabs">
                        <button
                            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                            onClick={() => setMode('login')}
                            data-testid="login-tab"
                        >
                            Login
                        </button>
                        <button
                            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                            onClick={() => setMode('register')}
                            data-testid="register-tab"
                        >
                            Register
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {mode === 'register' && (
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                    Operator Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required={mode === 'register'}
                                    className="input-tactical bg-black/30 border-0 border-b border-white/20 rounded-none focus:border-primary"
                                    placeholder="Enter your name"
                                    data-testid="name-input"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="input-tactical bg-black/30 border-0 border-b border-white/20 rounded-none focus:border-primary"
                                placeholder="operator@studyos.in"
                                data-testid="email-input"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                Access Code
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="input-tactical bg-black/30 border-0 border-b border-white/20 rounded-none focus:border-primary"
                                placeholder="••••••••"
                                data-testid="password-input"
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-accent text-sm" data-testid="auth-error">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="btn-tactical w-full"
                            data-testid="auth-submit"
                        >
                            {loading ? (
                                <div className="spinner" />
                            ) : (
                                <>
                                    {mode === 'login' ? 'Access System' : 'Create Identity'}
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-xs text-muted-foreground mt-6 font-mono">
                        SECURE CONNECTION ESTABLISHED
                    </p>
                </div>
            </div>
        </div>
    );
}
