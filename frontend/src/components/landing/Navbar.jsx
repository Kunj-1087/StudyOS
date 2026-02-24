import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-100 flex items-center justify-between px-8 py-4 rounded-full transition-all duration-300 w-[95%] max-w-5xl ${
        isScrolled 
          ? 'backdrop-blur-xl bg-[#080A06]/70 border border-white/10' 
          : 'border border-transparent'
      }`}
    >
      <div className="text-2xl font-bold tracking-tight text-text-primary font-display">
        studyOS.
      </div>
      <div className="hidden md:flex gap-10 text-base font-body text-[#A4B49F]">
        <a href="#intelligence" className="hover:text-white transition">Intelligence</a>
        <a href="#philosophy" className="hover:text-white transition">Protocol</a>
        <a href="#execution" className="hover:text-white transition">Execution</a>
      </div>
      <button onClick={() => window.location.href = '/dashboard'} className="px-6 py-2.5 text-sm font-mono font-bold tracking-wider text-[#080A06] bg-accent rounded-full hover:bg-white transition flex items-center gap-2 button-magnetic">
        ACCESS <span className="w-2.5 h-2.5 rounded-full bg-[#080A06] animate-pulse"></span>
      </button>
    </nav>
  );
}
