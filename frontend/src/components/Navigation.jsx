import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    User, 
    LogOut, 
    Menu, 
    X,
    ChevronRight 
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';

export function Navigation() {
    const { user, profile, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { path: '/hub', label: 'Domain Hub' },
        { path: '/profile', label: 'Operator Profile', requireAuth: true }
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="nav-fixed" data-testid="navigation">
            <div className="tactical-container">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className="flex items-center"
                        data-testid="nav-logo"
                    >
                        <img
                            src="/assets/studyos-logo.svg"
                            alt="StudyOS"
                            className="logo-glow"
                            style={{ height: '30px', width: 'auto' }}
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => {
                            if (link.requireAuth && !isAuthenticated) return null;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                                    data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}

                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        className="flex items-center gap-2 text-muted-foreground hover:text-white"
                                        data-testid="user-menu-trigger"
                                    >
                                        <div className="w-8 h-8 bg-primary/10 border border-primary/30 rounded-sm flex items-center justify-center">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="font-mono text-sm">
                                            {profile?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Operator"}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent 
                                    align="end" 
                                    className="w-48 bg-card border-white/10"
                                >
                                    <DropdownMenuItem 
                                        onClick={() => navigate('/profile')}
                                        className="cursor-pointer"
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem 
                                        onClick={handleLogout}
                                        className="cursor-pointer text-accent"
                                        data-testid="logout-btn"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link to="/auth">
                                <Button 
                                    className="btn-tactical-outline text-xs py-2"
                                    data-testid="nav-auth-btn"
                                >
                                    Access System
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-muted-foreground hover:text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        data-testid="mobile-menu-toggle"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/5">
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => {
                                if (link.requireAuth && !isAuthenticated) return null;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                            
                            {isAuthenticated ? (
                                <button
                                    onClick={handleLogout}
                                    className="nav-link text-accent text-left"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link 
                                    to="/auth"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Button className="btn-tactical w-full">
                                        Access System
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
