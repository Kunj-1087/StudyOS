import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCta() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="px-6 py-24 bg-[#080A06]">
      <div 
        ref={containerRef} 
        className="w-full max-w-7xl mx-auto rounded-[3rem] p-16 md:p-32 flex flex-col items-center justify-center text-center bg-gradient-primary relative overflow-hidden"
      >
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(to_right,currentColor_1px,transparent_1px)] bg-size-[40px_40px] text-[#080A06]" />
        
        <div className="relative z-10 font-mono text-base tracking-[0.2em] uppercase text-[#080A06]/60 font-bold mb-6 mt-4">
          Clearance required
        </div>

        <h2 className="relative z-10 font-drama text-5xl md:text-7xl italic text-[#080A06] font-black leading-none mb-6">
          Become an <span className="not-italic font-display">Operator.</span>
        </h2>
        
        <p className="relative z-10 max-w-2xl mx-auto font-body text-xl md:text-2xl text-[#080A06]/80 mb-10 leading-relaxed">
          Discard surface-level networking. Enter the only command-layer built for executing high-leverage technical and financial pathways.
        </p>
        
        <button onClick={() => window.location.href = '/dashboard'} className="relative z-10 px-12 py-6 bg-[#080A06] text-transparent bg-clip-text bg-gradient-primary font-mono text-lg font-bold tracking-widest uppercase rounded-full hover:scale-105 transition-all shadow-2xl button-magnetic">
          Create Identity Profile
        </button>
      </div>
    </section>
  );
}
