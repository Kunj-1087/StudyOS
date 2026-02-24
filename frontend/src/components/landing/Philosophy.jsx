import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Philosophy() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax background
      gsap.to(bgRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom", 
          end: "bottom top",
          scrub: true
        }
      });

      // Split text word by word manually to avoid splitting libraries for simplicity
      // and animate them
      const words = Array.from(textRef.current.querySelectorAll('.word'));
      gsap.from(words, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.04,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 70%",
          toggleActions: "play none none none"
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const line1 = "Most academic platforms focus on: shallow mass adoption.".split(" ");
  const line2Part1 = "We focus on: ".split(" ");
  const line2Part2 = "verifiable domain mastery.".split(" ");

  return (
    <section ref={containerRef} id="philosophy" className="relative w-full py-48 overflow-hidden bg-[#080A06] border-y border-[#182015]">
      {/* Background Texture Overlay */}
      <div 
        ref={bgRef}
        className="absolute -top-[20%] -left-[10%] w-[120%] h-[150%] opacity-10 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%) contrast(1.5)'
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center md:text-left" ref={textRef}>
        <p className="font-body text-[#A4B49F] text-2xl md:text-3xl leading-relaxed mb-6">
          {line1.map((word, i) => (
            <span key={i} className="word inline-block mr-[0.25em]">{word}</span>
          ))}
        </p>
        <h2 className="font-drama italic text-5xl md:text-7xl text-white leading-[1.1]">
          {line2Part1.map((word, i) => (
            <span key={`p1-${i}`} className="word inline-block mr-[0.25em]">{word}</span>
          ))}
          <strong className="text-[#C8F400] font-black not-italic tracking-tight">
            {line2Part2.map((word, i) => (
              <span key={`p2-${i}`} className="word inline-block mr-[0.25em]">{word}</span>
            ))}
          </strong>
        </h2>
      </div>
    </section>
  );
}
