import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#080A06] pt-24 pb-12 w-full rounded-t-[3.5rem] mt-12 relative border-t border-[#182015]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8">
        
        {/* Brand Column */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div>
            <h2 className="font-display font-bold text-4xl text-[#EEFCE8] mb-4">
              studyOS.
            </h2>
            <p className="font-body text-[#A4B49F] text-sm max-w-sm mb-6 leading-relaxed">
              The Academic Intelligence System for high-agency operators. Eliminate noise. Execute mastery.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#00FF87] rounded-full animate-pulse shadow-[0_0_10px_rgba(204,255,0,0.8)]" />
            <span className="font-mono text-xs text-[#EEFCE8] tracking-widest uppercase opacity-70">
              System Operational :: {new Date().getFullYear()}
            </span>
          </div>
        </div>

        {/* Nav Col 1 */}
        <div className="flex flex-col gap-4">
          <h4 className="font-mono font-bold text-[#C8F400] tracking-widest text-xs mb-2">INTELLIGENCE</h4>
          <a href="#" className="font-body text-sm text-[#A4B49F] hover:text-[#EEFCE8] transition-colors">Quant Finance</a>
          <a href="#" className="font-body text-sm text-[#A4B49F] hover:text-[#EEFCE8] transition-colors">ML Engineering</a>
          <a href="#" className="font-body text-sm text-[#A4B49F] hover:text-[#EEFCE8] transition-colors">Cybersecurity</a>
          <a href="#" className="font-body text-sm text-[#A4B49F] hover:text-[#EEFCE8] transition-colors">Web3 Infrastructure</a>
        </div>

        {/* Nav Col 2 */}
        <div className="flex flex-col gap-4">
          <h4 className="font-mono font-bold text-[#C8F400] tracking-widest text-xs mb-2">NETWORK</h4>
          <a href="#" className="font-body text-sm text-[#A4B49F] hover:text-[#EEFCE8] transition-colors">Verify Credentials</a>
          <a href="#" className="font-body text-sm text-[#A4B49F] hover:text-[#EEFCE8] transition-colors">Peer Validation</a>
          <a href="#" className="font-body text-sm text-[#A4B49F] hover:text-[#EEFCE8] transition-colors">Manifesto</a>
          <a href="#" className="font-body text-sm text-[#A4B49F] hover:text-[#EEFCE8] transition-colors">Operator Log</a>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-24 flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-[#182015]">
        <span className="font-body text-xs text-[#A4B49F]/50">
          © {new Date().getFullYear()} studyOS. Verified Intellectual Progress.
        </span>
        <div className="flex gap-6">
          <a href="#" className="font-body text-xs text-[#A4B49F]/50 hover:text-[#A4B49F] transition-colors">PRIVACY PROTOCOL</a>
          <a href="#" className="font-body text-xs text-[#A4B49F]/50 hover:text-[#A4B49F] transition-colors">TERMS OF EXECUTION</a>
        </div>
      </div>
    </footer>
  );
}
