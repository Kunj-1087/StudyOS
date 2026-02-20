export function SkillBar({ name, level, importance }) {
    const levelColors = {
        beginner: 'from-green-500 to-green-400',
        intermediate: 'from-primary to-cyan-400',
        advanced: 'from-yellow-500 to-orange-400',
        expert: 'from-accent to-red-400'
    };

    return (
        <div className="skill-item">
            <div className="skill-header">
                <span className="skill-name">{name}</span>
                <span className="skill-level">{level}</span>
            </div>
            <div className="skill-bar">
                <div 
                    className={`skill-bar-fill bg-gradient-to-r ${levelColors[level] || levelColors.intermediate}`}
                    style={{ width: `${importance}%` }}
                />
            </div>
        </div>
    );
}

export function StatBlock({ label, value, icon: Icon, color = 'text-primary' }) {
    return (
        <div className="stat-block p-4 bg-white/[0.02] border border-white/5 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
                {Icon && <Icon className={`w-4 h-4 ${color}`} />}
                <span className="stat-label">{label}</span>
            </div>
            <span className={`stat-value ${color}`}>{value}</span>
        </div>
    );
}

export function ProgressRing({ percentage, size = 120, strokeWidth = 8, color = '#00C2FF' }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    className="text-white/10"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className="transition-all duration-500 ease-out"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    stroke={color}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: offset
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-2xl font-bold" style={{ color }}>
                    {Math.round(percentage)}%
                </span>
            </div>
        </div>
    );
}

export function ActivityGraph({ data }) {
    const maxActivity = Math.max(...data.map(d => d.activity), 1);

    return (
        <div className="activity-graph">
            {data.map((item, index) => (
                <div
                    key={index}
                    className="activity-bar"
                    style={{ height: `${(item.activity / maxActivity) * 100}%` }}
                    title={`${item.date}: ${item.activity} activities`}
                />
            ))}
        </div>
    );
}
