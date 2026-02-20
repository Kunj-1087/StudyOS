import { Plus, ExternalLink, Check, BookOpen, Video, FileText, Wrench, FolderGit2, Users } from 'lucide-react';
import { Button } from './ui/button';

const typeIcons = {
    video: Video,
    article: FileText,
    course: BookOpen,
    book: BookOpen,
    tool: Wrench,
    project: FolderGit2,
    community: Users
};

const difficultyColors = {
    beginner: 'badge-success',
    intermediate: 'badge-tactical',
    advanced: 'badge-warning',
    expert: 'badge-danger'
};

export function ResourceCard({ resource, onAddToPlan, inPlan = false, onComplete }) {
    const TypeIcon = typeIcons[resource.resource_type] || FileText;

    return (
        <div className="resource-card" data-testid={`resource-card-${resource.id}`}>
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-10 h-10 bg-primary/10 border border-primary/30 rounded-sm flex items-center justify-center flex-shrink-0">
                    <TypeIcon className="w-5 h-5 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-white text-sm line-clamp-1">
                            {resource.title}
                        </h4>
                        <span className={`badge-tactical ${difficultyColors[resource.difficulty]} flex-shrink-0`}>
                            {resource.difficulty}
                        </span>
                    </div>

                    {resource.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {resource.description}
                        </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {resource.provider && (
                            <span className="font-mono">{resource.provider}</span>
                        )}
                        {resource.duration && (
                            <span className="font-mono">{resource.duration}</span>
                        )}
                        <span className={resource.is_free ? 'text-secondary' : 'text-accent'}>
                            {resource.is_free ? 'FREE' : 'PAID'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                <a 
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary text-xs font-bold uppercase tracking-wider hover:gap-2 transition-all"
                    data-testid={`resource-link-${resource.id}`}
                >
                    Open Resource
                    <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex items-center gap-2">
                    {onComplete && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-secondary hover:bg-secondary/10"
                            onClick={() => onComplete(resource.id)}
                            data-testid={`complete-resource-${resource.id}`}
                        >
                            <Check className="w-4 h-4" />
                        </Button>
                    )}
                    {onAddToPlan && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-2 ${inPlan ? 'text-secondary' : 'text-muted-foreground hover:text-primary'}`}
                            onClick={() => onAddToPlan(resource.id)}
                            disabled={inPlan}
                            data-testid={`add-to-plan-${resource.id}`}
                        >
                            {inPlan ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
