import { useNavigate } from 'react-router-dom';
import { 
    Wallet, TrendingUp, Brain, Cpu, BarChart3, 
    Shield, LineChart, Blocks, ChevronRight, Clock, Zap 
} from 'lucide-react';

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

export function DomainCard({ domain, index }) {
    const navigate = useNavigate();
    const Icon = iconMap[domain.icon] || Brain;

    // Calculate difficulty segments
    const difficultySegments = Math.ceil(domain.difficulty_index / 25);
    const getDifficultyColor = (level) => {
        if (level <= 2) return 'active';
        if (level <= 3) return 'active medium';
        return 'active high';
    };

    return (
        <div 
            className={`domain-card fade-in stagger-${(index % 6) + 1}`}
            onClick={() => navigate(`/domain/${domain.slug}`)}
            data-testid={`domain-card-${domain.slug}`}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-sm flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl text-white">{domain.name}</h3>
                        <span className="font-mono text-xs text-muted-foreground uppercase">
                            /{domain.slug}
                        </span>
                    </div>
                </div>
                
                {/* Market Demand Circle */}
                <div className="demand-circle">
                    <svg width="60" height="60" viewBox="0 0 60 60">
                        <circle 
                            className="demand-circle-bg" 
                            cx="30" 
                            cy="30" 
                            r="26" 
                        />
                        <circle 
                            className="demand-circle-progress" 
                            cx="30" 
                            cy="30" 
                            r="26"
                            strokeDasharray={`${(domain.market_demand / 100) * 163.36} 163.36`}
                        />
                    </svg>
                    <div className="demand-value text-primary">{domain.market_demand}%</div>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                {domain.description}
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Difficulty */}
                <div className="stat-block">
                    <span className="stat-label">Difficulty</span>
                    <div className="difficulty-bar mt-1">
                        {[1, 2, 3, 4].map((seg) => (
                            <div 
                                key={seg}
                                className={`difficulty-segment ${seg <= difficultySegments ? getDifficultyColor(difficultySegments) : ''}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Time */}
                <div className="stat-block">
                    <span className="stat-label">Time</span>
                    <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-secondary" />
                        <span className="font-mono text-xs text-white">
                            {domain.time_to_competency}
                        </span>
                    </div>
                </div>

                {/* Demand */}
                <div className="stat-block">
                    <span className="stat-label">Demand</span>
                    <div className="flex items-center gap-1 mt-1">
                        <Zap className="w-3 h-3 text-primary" />
                        <span className="font-mono text-xs text-white">
                            {domain.market_demand >= 90 ? 'Critical' : 
                             domain.market_demand >= 80 ? 'High' : 'Rising'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="font-mono text-xs text-muted-foreground">
                    ${(domain.avg_salary_min / 1000).toFixed(0)}K - ${(domain.avg_salary_max / 1000).toFixed(0)}K
                </div>
                <button className="flex items-center gap-1 text-primary text-sm font-bold uppercase tracking-wider hover:gap-2 transition-all">
                    Enter Domain
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
