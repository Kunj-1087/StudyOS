import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Stats() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const counters = gsap.utils.toArray('.stat-number');
      
      counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        gsap.to(counter, {
          textContent: target,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: counter,
            start: "top 85%",
          }
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const statsList = [
    { value: 14200, label: 'VERIFIED OPERATORS', prefix: '' },
    { value: 98, label: 'SIGNAL PURITY (%)', prefix: '' },
    { value: 384, label: 'INTEL BRIEFS LIVE', prefix: '' },
    { value: 3, label: 'TIER-1 DOMAINS', prefix: '' }
  ];

  return (
    <section ref={containerRef} className="py-24 px-6 bg-[#0D110C] border-y border-[#182015] relative z-10 mx-auto max-w-[95%] rounded-[3rem] -translate-y-12 shadow-2xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-7xl mx-auto md:divide-x md:divide-[#182015]">
        {statsList.map((stat, i) => (
          <div key={i} className="flex flex-col items-center justify-center relative overflow-hidden">
            <h4 className="font-display font-bold text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-primary tabular-nums tracking-tighter">
              {stat.prefix}<span className="stat-number" data-target={stat.value}>0</span>
            </h4>
            <span className="font-mono text-xs text-[#C8F400] uppercase tracking-widest mt-4 text-center">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
