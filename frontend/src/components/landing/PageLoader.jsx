import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function PageLoader({ onComplete }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete });
      
      const chars = gsap.utils.toArray('.char');
      
      tl.to(containerRef.current, { autoAlpha: 1, duration: 0 })
        .from(chars, {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out'
        })
        .to(chars, {
          scale: 0.8,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.inOut',
          delay: 0.3
        })
        .to(containerRef.current, {
          autoAlpha: 0,
          duration: 0.4,
          ease: 'power2.inOut'
        });
    }, containerRef);
    return () => ctx.revert();
  }, [onComplete]);

  const text = "studyOS.";

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[99999] bg-[#080A06] flex items-center justify-center invisible flex-col"
    >
      <div className="flex font-display font-bold text-6xl md:text-8xl tracking-tight text-[#EEFCE8]">
        {text.split('').map((char, i) => (
          <span key={i} className="char inline-block">{char}</span>
        ))}
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#C8F400] animate-pulse"></span>
        <span className="font-mono text-[10px] text-[#C8F400] tracking-widest uppercase">
          Initializing Operator Layer...
        </span>
      </div>
    </div>
  );
}
