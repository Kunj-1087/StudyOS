import React from 'react';

export default function SocialProofBar() {
  const logos = ['DEF CON', 'Y COMBINATOR', 'A16Z', 'QUANTITATIVE ANALYSIS RESEARCH', 'CYBER COMMAND', 'IEEE'];
  const stats = ['10,000+ Verified Operators', '99.9% Signal-to-Noise Ratio', '384 Intelligence Briefs Compiled', '124,000+ XP Allocated'];

  return (
    <section className="relative w-full overflow-hidden bg-[#080A06] border-y border-[#182015] py-6 flex flex-col gap-4">
      {/* Ticker 1: Logos */}
      <div 
        className="flex whitespace-nowrap overflow-hidden" 
        style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
      >
        <div className="flex animate-[scroll_20s_linear_infinite]">
          {[...logos, ...logos].map((logo, i) => (
            <span key={`logo-${i}`} className="mx-12 text-[#182015] font-display font-bold text-2xl tracking-widest uppercase flex-shrink-0">
              {logo}
            </span>
          ))}
        </div>
      </div>

      {/* Ticker 2: Stats */}
      <div 
        className="flex whitespace-nowrap overflow-hidden"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
      >
        <div className="flex animate-[scroll_25s_linear_infinite_reverse]">
          {[...stats, ...stats].map((stat, i) => (
            <span key={`stat-${i}`} className="mx-12 text-[#00FF87]/60 font-mono text-sm tracking-widest uppercase flex-shrink-0 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#C8F400] rounded-full"></div>
              {stat}
            </span>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </section>
  );
}
