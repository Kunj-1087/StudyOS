import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../hooks/useProfile";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading, error, refreshProfile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0D0F14] flex items-center justify-center">
        <div className="text-[#00C2FF] font-mono text-lg animate-pulse tracking-widest">
          LOADING OPERATOR PROFILE...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0F14] flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 font-mono">{error}</p>
        <button
          onClick={refreshProfile}
          className="px-6 py-2 bg-[#00C2FF] text-black font-mono font-bold rounded hover:bg-[#16F2A5] transition-all duration-200"
        >
          RETRY
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0F14] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-mono font-bold tracking-widest text-[#00C2FF] uppercase mb-8">
          OPERATOR PROFILE
        </h1>
        
        {/* Profile Details */}
        <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-[#00C2FF] flex items-center justify-center text-black text-2xl font-bold font-mono">
              {profile?.full_name?.charAt(0).toUpperCase() || "O"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {profile?.full_name || "Operator"}
              </h2>
              <p className="text-[#8B9CB3] text-sm">
                {profile?.email}
              </p>
              <span className="inline-block mt-1 px-3 py-1 bg-[#00C2FF]/10 border border-[#00C2FF]/30 text-[#00C2FF] text-xs font-mono rounded-full uppercase tracking-wider">
                {profile?.role || "Student"}
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
              <div key={stat.label} className="bg-[#0D0F14] border border-[#2A2D35] rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-[#16F2A5]">
                  {stat.value}
                </p>
                <p className="text-xs text-[#8B9CB3] font-mono tracking-wider mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-xl p-6">
          <h3 className="text-sm font-mono uppercase tracking-wider text-[#8B9CB3] mb-3">
            BIO
          </h3>
          <p className="text-[#8B9CB3]">
            {profile?.bio || "No bio added yet. Edit your profile to add one."}
          </p>
        </div>
      </div>
    </div>
  );
}
