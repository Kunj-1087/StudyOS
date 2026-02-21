import { useNavigate } from 'react-router-dom';
import { ChevronRight, Activity, Zap, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background */}
            <div className="hero-background" />
            <div className="hero-grid" />

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <header className="top-bar">
                    <div className="brand-left">
                        <img
                            src="/assets/studyos-logo.svg"
                            alt="StudyOS — Academic Intelligence System"
                            className="logo-glow"
                            height="36"
                            style={{ height: '36px', width: 'auto' }}
                        />
                    </div>

                    <div className="status-right">
                        <div className="status-dot" />
                        <span className="text-secondary font-mono text-xs uppercase tracking-widest">System Online</span>
                    </div>
                </header>

                {/* Hero */}
                <main className="flex-1 flex items-center">
                    <div className="tactical-container">
                        <div className="max-w-4xl mx-auto text-center">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-sm mb-8">
                                <Zap className="w-4 h-4 text-primary" />
                                <span className="font-mono text-xs uppercase tracking-wider text-primary">
                                    Academic Intelligence System v1.0
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading text-white mb-6 glow-text">
                                MASTER YOUR<br />
                                <span className="text-primary">DOMAIN</span>
                            </h1>

                            {/* Subtitle */}
                            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                                A tactical command center for navigating high-value tech domains. 
                                Get curated intelligence on FinTech, AI, Cybersecurity, Quant, and more.
                            </p>

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button
                                    onClick={() => navigate('/hub')}
                                    className="btn-tactical text-base px-8 py-4"
                                    data-testid="enter-system-btn"
                                >
                                    Enter the System
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </Button>
                                <Button
                                    onClick={() => navigate('/auth')}
                                    className="btn-tactical-outline text-base px-8 py-4"
                                    data-testid="create-account-btn"
                                >
                                    Create Operator ID
                                </Button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
                                <div className="stat-block items-center">
                                    <span className="stat-value text-primary">8</span>
                                    <span className="stat-label">Domains</span>
                                </div>
                                <div className="stat-block items-center">
                                    <span className="stat-value text-secondary">50+</span>
                                    <span className="stat-label">Resources</span>
                                </div>
                                <div className="stat-block items-center">
                                    <span className="stat-value text-accent">∞</span>
                                    <span className="stat-label">Potential</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer Features */}
                <footer className="tactical-container py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-panel p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Activity className="w-5 h-5 text-primary" />
                                <span className="font-heading text-sm text-white">MARKET INTELLIGENCE</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Real-time demand signals and salary insights for each domain.
                            </p>
                        </div>
                        <div className="glass-panel p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Zap className="w-5 h-5 text-secondary" />
                                <span className="font-heading text-sm text-white">EXECUTION PROTOCOL</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Step-by-step execution strategies with time-to-competency estimates.
                            </p>
                        </div>
                        <div className="glass-panel p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="w-5 h-5 text-accent" />
                                <span className="font-heading text-sm text-white">VERIFIED RESOURCES</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Curated toolkit of the best learning resources for each skill level.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
