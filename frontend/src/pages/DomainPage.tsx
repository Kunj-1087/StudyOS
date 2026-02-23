import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { SkillBar } from '../components/StatsComponents';
import { domainsApi, progressApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import {
    ArrowLeft, ExternalLink, ChevronRight, Clock, DollarSign,
    TrendingUp, Target, Briefcase, BookOpen, CheckCircle2,
    Wallet, Brain, Cpu, BarChart3, Shield, LineChart, Blocks
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';

const iconMap = {
    Wallet: Wallet,
    TrendingUp: TrendingUp,
    Brain: Brain,
    Cpu: Cpu,
    BarChart3: BarChart3,
    Shield: Shield,
    LineChart: LineChart,
    Blocks: Blocks
};

export default function DomainPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAuthenticated = !!user;
    const [domain, setDomain] = useState(null);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);

    useEffect(() => {
        fetchDomain();
    }, [slug]);

    const fetchDomain = async () => {
        try {
            const response = await domainsApi.getBySlug(slug);
            setDomain(response.data);
        } catch (error) {
            toast.error('Domain not found');
            navigate('/hub');
        } finally {
            setLoading(false);
        }
    };

    const handleStartDomain = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to track your progress');
            navigate('/auth');
            return;
        }

        setStarting(true);
        try {
            await progressApi.startDomain(slug);
            toast.success('Domain added to your progress tracker');
        } catch (error) {
            toast.error('Failed to start domain');
        } finally {
            setStarting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="spinner" />
            </div>
        );
    }

    if (!domain) return null;

    const Icon = iconMap[domain.icon] || Brain;

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="pt-20 pb-16">
                <div className="tactical-container">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                        <Link to="/hub" className="hover:text-primary transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <Link to="/hub" className="hover:text-primary transition-colors">
                            Domain Hub
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-white">{domain.name}</span>
                    </div>

                    {/* Header */}
                    <header className="mb-12">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                            {/* Left: Title & Meta */}
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-sm flex items-center justify-center">
                                        <Icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-mono text-xs text-muted-foreground uppercase mb-1">
                                            // INTELLIGENCE BRIEF
                                        </div>
                                        <h1 className="text-4xl sm:text-5xl text-white">{domain.name}</h1>
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-lg max-w-2xl">
                                    {domain.description}
                                </p>
                            </div>

                            {/* Right: Quick Stats */}
                            <div className="glass-panel p-6 lg:w-80">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="stat-block">
                                        <span className="stat-label flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            Market Demand
                                        </span>
                                        <span className="stat-value text-primary">{domain.market_demand}%</span>
                                    </div>
                                    <div className="stat-block">
                                        <span className="stat-label flex items-center gap-1">
                                            <Target className="w-3 h-3" />
                                            Difficulty
                                        </span>
                                        <span className="stat-value text-accent">{domain.difficulty_index}/100</span>
                                    </div>
                                    <div className="stat-block">
                                        <span className="stat-label flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Time Est.
                                        </span>
                                        <span className="font-mono text-lg text-white">{domain.time_to_competency}</span>
                                    </div>
                                    <div className="stat-block">
                                        <span className="stat-label flex items-center gap-1">
                                            <DollarSign className="w-3 h-3" />
                                            Salary Range
                                        </span>
                                        <span className="font-mono text-lg text-secondary">
                                            ${(domain.avg_salary_min/1000).toFixed(0)}K-${(domain.avg_salary_max/1000).toFixed(0)}K
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleStartDomain}
                                        disabled={starting}
                                        className="btn-tactical flex-1"
                                        data-testid="start-domain-btn"
                                    >
                                        {starting ? 'Starting...' : 'Start Domain'}
                                    </Button>
                                    <Link to={`/domain/${slug}/toolkit`}>
                                        <Button className="btn-tactical-outline" data-testid="view-toolkit-btn">
                                            <BookOpen className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Overview */}
                            <section className="data-card p-6">
                                <div className="section-title">Overview</div>
                                <p className="text-muted-foreground leading-relaxed">
                                    {domain.overview}
                                </p>
                            </section>

                            {/* Why It Matters */}
                            <section className="data-card p-6">
                                <div className="section-title">Why It Matters</div>
                                <p className="text-muted-foreground leading-relaxed">
                                    {domain.why_it_matters}
                                </p>
                            </section>

                            {/* Core Concepts */}
                            {domain.core_concepts && domain.core_concepts.length > 0 && (
                                <section className="data-card p-6">
                                    <div className="section-title">Core Concepts</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {domain.core_concepts.map((concept, idx) => (
                                            <div 
                                                key={idx}
                                                className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-sm"
                                            >
                                                <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                                                <span className="text-sm text-white">{concept}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Industry Applications */}
                            {domain.industry_applications && domain.industry_applications.length > 0 && (
                                <section className="data-card p-6">
                                    <div className="section-title">Industry Applications</div>
                                    <div className="space-y-2">
                                        {domain.industry_applications.map((app, idx) => (
                                            <div 
                                                key={idx}
                                                className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-sm"
                                            >
                                                <Briefcase className="w-4 h-4 text-primary flex-shrink-0" />
                                                <span className="text-sm text-white">{app}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Market Intelligence */}
                             {domain.market_data && (
                                <section className="data-card p-0 overflow-hidden">
                                    <div className="bg-primary/5 px-6 py-3 border-b border-primary/10 flex items-center justify-between">
                                        <div className="section-title mb-0">Market Intelligence</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                            <span className="font-mono text-[10px] text-primary/70 uppercase">Live Signal</span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="font-mono text-[10px] text-muted-foreground uppercase mb-1">Demand Trend</div>
                                                    <div className="text-xl text-white font-heading">{domain.market_data.demand_trend}</div>
                                                </div>
                                                <div>
                                                    <div className="font-mono text-[10px] text-muted-foreground uppercase mb-1">YoY Growth</div>
                                                    <div className="text-xl text-secondary font-heading">{domain.market_data.yoy_growth}</div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-mono text-[10px] text-muted-foreground uppercase mb-1">Top Hiring Vectors</div>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {(domain.market_data.top_hiring || []).map((company, i) => (
                                                        <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-sm text-xs text-white/80">
                                                            {company}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Strategic Project Paths */}
                            {domain.project_paths && domain.project_paths.length > 0 && (
                                <section className="data-card p-6">
                                    <div className="section-title">Strategic Project Paths</div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {domain.project_paths.map((project, idx) => (
                                            <div key={idx} className="group p-4 bg-white/[0.02] border border-white/5 rounded-sm hover:border-primary/30 transition-all duration-300">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="text-white font-heading group-hover:text-primary transition-colors">{project.title}</h4>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                                                        project.difficulty === 'Advanced' ? 'text-accent border-accent/30 bg-accent/5' :
                                                        project.difficulty === 'Expert' ? 'text-red-400 border-red-400/30 bg-red-400/5' :
                                                        'text-secondary border-secondary/30 bg-secondary/5'
                                                    }`}>
                                                        {project.difficulty}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{project.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Execution Strategy */}
                            {domain.execution_strategy && domain.execution_strategy.length > 0 && (
                                <section className="data-card p-6">
                                    <div className="section-title">Execution Protocol</div>
                                    <div className="execution-timeline">
                                        {domain.execution_strategy.map((step, idx) => (
                                            <div key={idx} className="timeline-step">
                                                <div className="timeline-marker">{step.step}</div>
                                                <div className="mb-2">
                                                    <h4 className="font-heading text-white text-lg">{step.title}</h4>
                                                    <span className="font-mono text-xs text-primary">{step.duration}</span>
                                                </div>
                                                <ul className="space-y-1">
                                                    {step.tasks.map((task, tidx) => (
                                                        <li key={tidx} className="text-sm text-muted-foreground flex items-center gap-2">
                                                            <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                                                            {task}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Skill Matrix */}
                            {domain.required_skills && domain.required_skills.length > 0 && (
                                <section className="data-card p-6">
                                    <div className="section-title">Skill Matrix</div>
                                    <div className="skill-matrix">
                                        {domain.required_skills.map((skill, idx) => (
                                            <SkillBar 
                                                key={idx}
                                                name={skill.name}
                                                level={skill.level}
                                                importance={skill.importance}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Tool Stack */}
                            {domain.tool_stack && domain.tool_stack.length > 0 && (
                                <section className="data-card p-6">
                                    <div className="section-title">Tool Stack</div>
                                    <div className="space-y-2">
                                        {domain.tool_stack.map((tool, idx) => (
                                            <div key={idx} className="tool-item">
                                                <div className="tool-icon">
                                                    <Cpu className="w-4 h-4" />
                                                </div>
                                                <div className="tool-info">
                                                    <span className="tool-name">{tool.name}</span>
                                                    <span className="tool-category">{tool.category}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* CTA */}
                            <div className="data-card p-6 border-primary/30">
                                <h3 className="font-heading text-lg text-white mb-2">Ready to Begin?</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Access the complete resource toolkit with curated learning materials.
                                </p>
                                <Link to={`/domain/${slug}/toolkit`}>
                                    <Button className="btn-tactical w-full" data-testid="toolkit-cta-btn">
                                        Open Toolkit
                                        <ExternalLink className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
