import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { DomainCard } from '../components/DomainCard';
import { domainsApi } from '../lib/api';
import { Activity, Filter, Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

export default function HubPage() {
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('demand'); // demand | difficulty | name

    useEffect(() => {
        fetchDomains();
    }, []);

    const fetchDomains = async () => {
        try {
            const response = await domainsApi.getAll();
            setDomains(response.data);
        } catch (error) {
            toast.error('Failed to load domains');
            console.error('Error fetching domains:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter and sort domains
    const filteredDomains = domains
        .filter(domain => 
            domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            domain.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'demand') return b.market_demand - a.market_demand;
            if (sortBy === 'difficulty') return a.difficulty_index - b.difficulty_index;
            return a.name.localeCompare(b.name);
        });

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Main Content */}
            <main className="pt-24 pb-16">
                <div className="tactical-container">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="section-title mb-2">Domain Selection Board</div>
                        <h1 className="text-4xl sm:text-5xl text-white mb-4">
                            CHOOSE YOUR <span className="text-primary">VECTOR</span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl">
                            Select a domain to access its intelligence brief. Each domain contains 
                            market signals, skill requirements, and execution strategies.
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search domains..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-card border-white/10 focus:border-primary"
                                data-testid="domain-search"
                            />
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-muted-foreground" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-card border border-white/10 rounded-sm px-3 py-2 text-sm text-white font-mono focus:border-primary focus:outline-none"
                                data-testid="domain-sort"
                            >
                                <option value="demand">Sort by Demand</option>
                                <option value="difficulty">Sort by Difficulty</option>
                                <option value="name">Sort by Name</option>
                            </select>
                        </div>
                    </div>

                    {/* Domain Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="spinner" />
                        </div>
                    ) : filteredDomains.length === 0 ? (
                        <div className="text-center py-20">
                            <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No domains found matching your search.</p>
                        </div>
                    ) : (
                        <div className="domain-grid" data-testid="domain-grid">
                            {filteredDomains.map((domain, index) => (
                                <DomainCard 
                                    key={domain.id} 
                                    domain={domain} 
                                    index={index} 
                                />
                            ))}
                        </div>
                    )}

                    {/* Stats Footer */}
                    <div className="mt-16 pt-8 border-t border-white/5">
                        <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                <span className="font-mono text-muted-foreground">
                                    {domains.length} DOMAINS AVAILABLE
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-secondary" />
                                <span className="font-mono text-muted-foreground">
                                    REAL-TIME MARKET DATA
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-accent" />
                                <span className="font-mono text-muted-foreground">
                                    CURATED RESOURCES
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
