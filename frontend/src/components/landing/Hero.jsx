import { useEffect, useRef } from 'react';
import { ParticleField } from './ParticleField';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Elements stagger entrance
      gsap.from('.hero-element', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.5 // Start after a shorter delay
      });

// Navbar logic relocated to Navbar.jsx
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full min-h-dvh overflow-hidden">
      {/* 3D Particle Field background */}
      <ParticleField />
      
      {/* Heavy gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-[#080A06] via-transparent to-transparent z-10 pointer-events-none" />

      {/* Navbar moved to global scope */}

      {/* Hero Content */}
      <div className="relative z-20 w-full h-full flex items-center justify-center md:justify-start pt-32 pb-20 px-6 md:pl-20 max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 text-center md:text-left items-center md:items-start max-w-4xl">
          <h2 className="hero-element font-display font-bold text-2xl md:text-[3.5rem] leading-none text-white tracking-tight uppercase">
            studyOS
          </h2>
          <h1 className="hero-element font-drama italic text-5xl md:text-[6.5rem] leading-[0.9] text-white">
            The Operator's <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-primary not-italic font-display uppercase tracking-tighter text-4xl md:text-[6rem]">Command-Layer</span>
          </h1>
          <p className="hero-element md:max-w-[600px] mt-4 font-body text-base md:text-xl text-[#A4B49F] leading-relaxed">
            Eliminate information asymmetry. Navigate high-leverage technical fields with data-dense intelligence briefs, verified resources, and immutable operator reputation.
          </p>
          <div className="hero-element mt-8 flex flex-col md:flex-row items-center gap-6">
            <button onClick={() => window.location.href = '/dashboard'} className="button-magnetic px-10 py-5 bg-gradient-primary text-[#080A06] font-mono font-bold uppercase tracking-widest text-base shadow-[0_0_20px_rgba(200,244,0,0.3)] hover:shadow-[0_0_30px_rgba(200,244,0,0.5)] transition duration-300">
              Become an Operator
            </button>
            <span className="text-xs md:text-sm font-mono tracking-widest text-warning px-5 py-3 border border-warning/30 rounded-full">
              SECURE CLEARANCE REQUIRED
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
