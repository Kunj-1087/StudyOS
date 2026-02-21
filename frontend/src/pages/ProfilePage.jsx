import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { StatBlock, ProgressRing, ActivityGraph } from '../components/StatsComponents';
import { useAuth } from '../context/AuthContext';
import { userApi, planApi } from '../lib/api';
import { toast } from 'sonner';
import {
    User, Award, Target, Zap, TrendingUp, BookOpen,
    CheckCircle2, Clock, ExternalLink, Trash2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';

export default function ProfilePage() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [planItems, setPlanItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }
        fetchData();
    }, [isAuthenticated, navigate]);

    const fetchData = async () => {
        try {
            const [statsRes, planRes] = await Promise.all([
                userApi.getStats(),
                planApi.getAll()
            ]);
            setStats(statsRes.data);
            setPlanItems(planRes.data);
        } catch (error) {
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromPlan = async (resourceId) => {
        try {
            await planApi.remove(resourceId);
            setPlanItems(prev => prev.filter(item => item.resource_id !== resourceId));
            toast.success('Removed from plan');
        } catch (error) {
            toast.error('Failed to remove from plan');
        }
    };

    const handleCompletePlanItem = async (resourceId) => {
        try {
            await planApi.complete(resourceId);
            setPlanItems(prev => prev.map(item => 
                item.resource_id === resourceId 
                    ? { ...item, is_completed: true }
                    : item
            ));
            toast.success('Marked as completed!');
        } catch (error) {
            toast.error('Failed to complete item');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="spinner" />
            </div>
        );
    }

    if (!user || !stats) return null;

    const overallProgress = stats.domain_progress.length > 0
        ? stats.domain_progress.reduce((sum, d) => sum + d.completion, 0) / stats.domain_progress.length
        : 0;

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="pt-24 pb-16">
                <div className="tactical-container">
                    {/* Header */}
                    <header className="mb-12">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                            {/* Profile Info */}
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 bg-primary/10 border-2 border-primary/30 rounded-sm flex items-center justify-center">
                                    {user.avatar_url ? (
                                        <img 
                                            src={user.avatar_url} 
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-12 h-12 text-primary" />
                                    )}
                                </div>
                                <div>
                                    <div className="font-mono text-xs text-muted-foreground uppercase mb-1">
                                        // OPERATOR PROFILE
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl text-white mb-2">{user.name}</h1>
                                    <div className="flex items-center gap-3">
                                        <span className="badge-tactical">{user.role}</span>
                                        <span className="font-mono text-xs text-muted-foreground">
                                            {user.email}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Overall Progress */}
                            <div className="glass-panel p-6 lg:ml-auto">
                                <div className="flex items-center gap-6">
                                    <ProgressRing percentage={overallProgress} size={100} />
                                    <div>
                                        <div className="font-mono text-xs text-muted-foreground uppercase mb-1">
                                            Overall Progress
                                        </div>
                                        <div className="font-heading text-2xl text-white">
                                            {stats.domains_started} DOMAINS
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Started
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <section className="mb-12">
                        <div className="section-title mb-6">Performance Metrics</div>
                        <div className="stats-grid">
                            <StatBlock 
                                label="Skill Index" 
                                value={stats.skill_index.toFixed(1)}
                                icon={Target}
                                color="text-primary"
                            />
                            <StatBlock 
                                label="Reputation" 
                                value={stats.reputation_score}
                                icon={Award}
                                color="text-secondary"
                            />
                            <StatBlock 
                                label="Contributions" 
                                value={stats.contribution_count}
                                icon={TrendingUp}
                                color="text-accent"
                            />
                            <StatBlock 
                                label="Execution Score" 
                                value={stats.execution_score.toFixed(1)}
                                icon={Zap}
                                color="text-yellow-500"
                            />
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Domain Progress */}
                            <section className="data-card p-6">
                                <div className="section-title mb-6">Domain Progress</div>
                                {stats.domain_progress.length === 0 ? (
                                    <div className="text-center py-8">
                                        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground mb-4">
                                            You haven't started any domains yet.
                                        </p>
                                        <Button 
                                            onClick={() => navigate('/hub')}
                                            className="btn-tactical-outline"
                                        >
                                            Explore Domains
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {stats.domain_progress.map((domain, idx) => (
                                            <div 
                                                key={idx}
                                                className="p-4 bg-white/[0.02] border border-white/5 rounded-sm"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-semibold text-white">
                                                        {domain.domain_name}
                                                    </span>
                                                    <span className="font-mono text-sm text-primary">
                                                        {domain.completion.toFixed(0)}%
                                                    </span>
                                                </div>
                                                <Progress 
                                                    value={domain.completion} 
                                                    className="h-2 bg-white/10"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Activity Graph */}
                            <section className="data-card p-6">
                                <div className="section-title mb-6">Activity (Last 7 Days)</div>
                                <ActivityGraph data={stats.activity} />
                                <div className="flex justify-between mt-4 text-xs font-mono text-muted-foreground">
                                    {stats.activity.map((item, idx) => (
                                        <span key={idx}>
                                            {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar - Personal Plan */}
                        <div>
                            <section className="data-card p-6">
                                <div className="section-title mb-6">Personal Plan</div>
                                {planItems.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Add resources to your plan from domain toolkits.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {planItems.map((item, idx) => (
                                            <div 
                                                key={idx}
                                                className={`p-3 border border-white/5 rounded-sm ${
                                                    item.is_completed ? 'bg-secondary/5' : 'bg-white/[0.02]'
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <button
                                                        onClick={() => handleCompletePlanItem(item.resource_id)}
                                                        className={`mt-0.5 ${
                                                            item.is_completed 
                                                                ? 'text-secondary' 
                                                                : 'text-muted-foreground hover:text-secondary'
                                                        }`}
                                                        disabled={item.is_completed}
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium ${
                                                            item.is_completed 
                                                                ? 'text-muted-foreground line-through' 
                                                                : 'text-white'
                                                        }`}>
                                                            {item.resource?.title}
                                                        </p>
                                                        <span className="text-xs font-mono text-muted-foreground">
                                                            {item.resource?.resource_type}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <a
                                                            href={item.resource?.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1 text-muted-foreground hover:text-primary"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                        <button
                                                            onClick={() => handleRemoveFromPlan(item.resource_id)}
                                                            className="p-1 text-muted-foreground hover:text-accent"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
