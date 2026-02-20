import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { ResourceCard } from '../components/ResourceCard';
import { domainsApi, planApi, progressApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { ArrowLeft, ChevronRight, Filter, BookOpen } from 'lucide-react';

const CATEGORIES = [
    { value: 'all', label: 'All Resources' },
    { value: 'foundation', label: 'Foundation' },
    { value: 'core_stack', label: 'Core Stack' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'projects', label: 'Projects' },
    { value: 'industry_exposure', label: 'Industry Exposure' }
];

export default function ToolkitPage() {
    const { slug } = useParams();
    const { isAuthenticated } = useAuth();
    const [domain, setDomain] = useState(null);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [planItems, setPlanItems] = useState([]);

    useEffect(() => {
        fetchData();
    }, [slug]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchPlanItems();
        }
    }, [isAuthenticated]);

    const fetchData = async () => {
        try {
            const [domainRes, resourcesRes] = await Promise.all([
                domainsApi.getBySlug(slug),
                domainsApi.getResources(slug)
            ]);
            setDomain(domainRes.data);
            setResources(resourcesRes.data);
        } catch (error) {
            toast.error('Failed to load toolkit');
        } finally {
            setLoading(false);
        }
    };

    const fetchPlanItems = async () => {
        try {
            const response = await planApi.getAll();
            setPlanItems(response.data.map(item => item.resource_id));
        } catch (error) {
            console.error('Failed to fetch plan items:', error);
        }
    };

    const handleAddToPlan = async (resourceId) => {
        if (!isAuthenticated) {
            toast.error('Please login to add to your plan');
            return;
        }

        try {
            await planApi.add(resourceId);
            setPlanItems(prev => [...prev, resourceId]);
            toast.success('Added to your personal plan');
        } catch (error) {
            if (error.response?.data?.detail === 'Already in plan') {
                toast.info('Already in your plan');
            } else {
                toast.error('Failed to add to plan');
            }
        }
    };

    const handleCompleteResource = async (resourceId) => {
        if (!isAuthenticated) {
            toast.error('Please login to track progress');
            return;
        }

        try {
            await progressApi.completeResource(slug, resourceId);
            toast.success('Resource marked as completed!');
        } catch (error) {
            toast.error('Failed to mark as completed');
        }
    };

    const filteredResources = activeCategory === 'all' 
        ? resources 
        : resources.filter(r => r.category === activeCategory);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="spinner" />
            </div>
        );
    }

    if (!domain) return null;

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="pt-20 pb-16">
                <div className="tactical-container">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                        <Link to="/hub" className="hover:text-primary transition-colors">
                            Domain Hub
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link to={`/domain/${slug}`} className="hover:text-primary transition-colors">
                            {domain.name}
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-white">Toolkit</span>
                    </div>

                    {/* Header */}
                    <header className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <Link 
                                to={`/domain/${slug}`}
                                className="p-2 hover:bg-white/5 rounded-sm transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                            </Link>
                            <div>
                                <div className="section-title mb-1">Resource Configuration</div>
                                <h1 className="text-3xl sm:text-4xl text-white">
                                    {domain.name} <span className="text-primary">TOOLKIT</span>
                                </h1>
                            </div>
                        </div>
                        <p className="text-muted-foreground max-w-2xl ml-11">
                            Curated learning resources organized by skill level. Add items to your 
                            personal plan and track your progress through the domain.
                        </p>
                    </header>

                    {/* Category Tabs */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter className="w-4 h-4 text-muted-foreground" />
                            <span className="font-mono text-xs text-muted-foreground uppercase">Filter by Category</span>
                        </div>
                        <div className="category-tabs">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.value}
                                    className={`category-tab ${activeCategory === cat.value ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat.value)}
                                    data-testid={`category-${cat.value}`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Resources Grid */}
                    {filteredResources.length === 0 ? (
                        <div className="text-center py-20">
                            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">
                                No resources found in this category.
                            </p>
                        </div>
                    ) : (
                        <div className="resource-grid" data-testid="resource-grid">
                            {filteredResources.map(resource => (
                                <ResourceCard
                                    key={resource.id}
                                    resource={resource}
                                    onAddToPlan={handleAddToPlan}
                                    inPlan={planItems.includes(resource.id)}
                                    onComplete={isAuthenticated ? handleCompleteResource : null}
                                />
                            ))}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="mt-12 pt-8 border-t border-white/5">
                        <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-muted-foreground">
                                    {filteredResources.length} RESOURCES
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-muted-foreground">
                                    {filteredResources.filter(r => r.is_free).length} FREE
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-muted-foreground">
                                    {filteredResources.filter(r => r.is_verified).length} VERIFIED
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
