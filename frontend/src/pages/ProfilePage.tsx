import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../hooks/useProfile";
import { Navigation } from "../components/Navigation";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading, error, refreshProfile } = useProfile();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#080A06] flex items-center justify-center">
        <div className="text-[#C8F400] font-mono text-lg animate-pulse tracking-widest">
          LOADING OPERATOR PROFILE...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#080A06] flex flex-col items-center justify-center gap-4">
        <p className="text-[#00FF87] font-mono">{error}</p>
        <button
          onClick={refreshProfile}
          className="px-6 py-2 bg-[#C8F400] text-[#080A06] font-mono font-bold rounded-sm hover:bg-[#C8F400]/90 transition-all duration-200"
        >
          RETRY
        </button>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-background grid-pattern">
      <Navigation />
      <div className="pt-24 pb-12 tactical-container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-mono font-bold tracking-widest text-[#C8F400] uppercase mb-8">
            OPERATOR PROFILE
          </h1>
          
          {/* Profile Details */}
          <div className="glass-panel p-6 mb-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-[#C8F400] flex items-center justify-center text-[#080A06] text-2xl font-bold font-mono">
                {profile?.full_name?.charAt(0).toUpperCase() || profile?.name?.charAt(0).toUpperCase() || "O"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#EEFCE8] font-display">
                  {profile?.full_name || profile?.name || "Operator"}
                </h2>
                <p className="text-muted-foreground text-sm font-body">
                  {profile?.email}
                </p>
                <span className="inline-block mt-1 px-3 py-1 bg-[#C8F400]/10 border border-[#C8F400]/30 text-[#C8F400] text-xs font-mono rounded-sm uppercase tracking-wider">
                  {profile?.role || "Operator"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "DOMAINS", value: profile?.domains_enrolled ?? 0 },
                { label: "RESOURCES", value: profile?.resources_contributed ?? 0 },
                { label: "REPUTATION", value: profile?.reputation_score ?? 0 },
                { label: "STREAK", value: `${profile?.streak_days ?? 0}d` },
              ].map((stat) => (
                <div key={stat.label} className="data-card p-4 text-center">
                  <p className="text-2xl font-bold text-[#00FF87] font-mono">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono tracking-wider mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="section-title">
              BIO
            </h3>
            <p className="text-muted-foreground font-body">
              {profile?.bio || "Internal Operator System Clearance Granted. Standby for directives."}
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
