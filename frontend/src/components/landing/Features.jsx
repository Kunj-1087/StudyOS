import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DiagnosticShuffler = () => {
  const [items, setItems] = useState([
    { label: 'NOISE REDUCTION', status: 'ACTIVE', color: 'text-[#C8F400]' },
    { label: 'SIGNAL EXTRACTION', status: 'VERIFIED', color: 'text-[#00FF87]' },
    { label: 'ASYMMETRY DELTA', status: 'OPTIMAL', color: 'text-white' }
  ]);
  const containerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev => {
        const next = [...prev];
        const first = next.shift();
        next.push(first);
        return next;
      });
      
      gsap.fromTo(containerRef.current, 
        { rotateX: 20 },
        { rotateX: 0, duration: 0.6, ease: 'back.out(1.5)' }
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="bg-[#0D110C] border border-[#C8F400]/10 rounded-[2rem] shadow-xl p-8 flex flex-col h-[450px] justify-between relative"
      style={{ perspective: '800px' }}
    >
      <div>
        <h3 className="font-display font-bold text-[#EEFCE8] text-[1.4rem] mb-3">Elimination of Information Asymmetry</h3>
        <p className="font-body text-[#A4B49F] text-[1rem] leading-relaxed">
          Provides a single, authoritative command-layer over fragmented, low-signal information environments.
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        {items.map((item, i) => (
          <div key={`${item.label}-${i}`} className="flex justify-between items-center bg-[#080A06] p-5 border border-[#182015] rounded-xl">
            <span className="font-mono text-sm tracking-widest text-[#A4B49F]">{item.label}</span>
            <span className={`font-mono text-sm font-bold tracking-widest ${item.color} flex items-center gap-3`}>
              <div className={`w-2 h-2 rounded-full ${item.color.replace('text', 'bg')}`}></div>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TelemetryTypewriter = () => {
  const [text, setText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  
  const messages = [
    "INITIATING OPERATOR IDENTITY...",
    "VERIFYING INTELLECTUAL PROGRESS...",
    "ACQUIRING COMMUNITY SIGNALS...",
    "CREDENTIAL LAYER ESTABLISHED."
  ];

  useEffect(() => {
    let currentText = '';
    let charIndex = 0;
    let typingInterval;
    let isMounted = true;

    const scramble = async () => {
      if (!isMounted) return;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
      for(let i=0; i<10; i++) {
        setText(Array.from({length: 20}).map(() => chars[Math.floor(Math.random() * chars.length)]).join(''));
        await new Promise(r => setTimeout(r, 40));
      }
      typeText();
    };

    const typeText = () => {
      const target = messages[messageIndex];
      currentText = '';
      typingInterval = setInterval(() => {
        if (!isMounted) return;
        currentText += target[charIndex];
        setText(currentText);
        charIndex++;
        if (charIndex >= target.length) {
          clearInterval(typingInterval);
          setTimeout(() => {
            if (isMounted) {
              setMessageIndex((prev) => (prev + 1) % messages.length);
            }
          }, 2000);
        }
      }, 30);
    };

    scramble();
    return () => {
      isMounted = false;
      clearInterval(typingInterval);
    };
  }, [messageIndex]);

  return (
    <div className="bg-[#0D110C] border border-[#C8F400]/10 rounded-[2rem] shadow-xl p-8 flex flex-col h-[450px] justify-between">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2.5 h-2.5 bg-[#FFB800] rounded-full animate-pulse"></div>
          <span className="font-mono text-xs text-[#FFB800] tracking-widest uppercase">Live Network Log</span>
        </div>
        <h3 className="font-display font-bold text-[#EEFCE8] text-[1.4rem] mb-3">Verifiable Operator Identity</h3>
        <p className="font-body text-[#A4B49F] text-[1rem] leading-relaxed">
          Create a credential layer based on a persistent, immutable record of intellectual progress and validated contributions.
        </p>
      </div>

      <div className="bg-[#080A06] border border-[#182015] rounded-xl p-6 h-[140px] font-mono text-base text-[#C8F400] relative overflow-hidden flex items-start">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />
        <span className="opacity-70 mt-1">&gt; </span><span className="ml-2 mt-1 leading-snug">{text}</span><span className="inline-block w-2.5 bg-[#C8F400] animate-pulse ml-1 h-[1.2em] mt-1 align-middle"></span>
      </div>
    </div>
  );
};

const SignalGraph = () => {
  const pathRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const length = pathRef.current.getTotalLength();
      gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
      
      ScrollTrigger.create({
        trigger: pathRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.to(pathRef.current, {
            strokeDashoffset: 0,
            duration: 2,
            ease: "power2.out"
          });
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#0D110C] border border-[#C8F400]/10 rounded-[2rem] shadow-xl p-8 flex flex-col h-[450px] justify-between group">
      <div>
        <h3 className="font-display font-bold text-[#EEFCE8] text-[1.4rem] mb-3">High-Density Domain Intelligence</h3>
        <p className="font-body text-[#A4B49F] text-[1rem] leading-relaxed">
          Structured "Intelligence Briefs" that are deeper and more tactical than generic roadmaps.
        </p>
      </div>

      <div className="relative h-[220px] w-full flex items-end mt-4">
        <div className="absolute top-0 left-4 text-[#A4B49F] font-mono text-[11px] tracking-widest">DOMAIN_SKILL_INDEX : MARKET_DEMAND_CURVE</div>
        
        {/* Graph Area */}
        <div className="w-[110%] h-[90%] relative group -left-4">
          <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible absolute bottom-0 left-0">
            {/* Grid lines */}
            <line x1="0" y1="25" x2="300" y2="25" stroke="#182015" strokeWidth="1" strokeDasharray="4 4"/>
            <line x1="0" y1="50" x2="300" y2="50" stroke="#182015" strokeWidth="1" strokeDasharray="4 4"/>
            <line x1="0" y1="75" x2="300" y2="75" stroke="#182015" strokeWidth="1" strokeDasharray="4 4"/>
            
            {/* Graph Path */}
            <path 
              ref={pathRef}
              d="M0 90 Q 20 80, 50 85 T 100 60 T 150 70 T 200 30 T 250 40 T 300 10" 
              fill="none" 
              stroke="url(#gradient)" 
              strokeWidth="4"
            />
            
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C8F400" />
                <stop offset="100%" stopColor="#00FF87" />
              </linearGradient>
            </defs>

            {/* Glowing Points */}
            <circle cx="200" cy="30" r="5" fill="#00FF87" className="group-hover:animate-pulse transition-all cursor-pointer" />
            <circle cx="300" cy="10" r="5" fill="#C8F400" className="group-hover:animate-pulse transition-all cursor-pointer" />
          </svg>
          
          {/* Tooltip on hover */}
          <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[#182015] border border-[#C8F400]/30 p-3 rounded -translate-y-4 font-mono text-sm text-[#EEFCE8] shadow-xl">
            <span className="text-[#00FF87]">XP:</span> 14,250<br/>
            <span className="text-[#C8F400]">LVL:</span> EXPERT
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Features() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="intelligence" className="relative w-full py-32 px-6 max-w-7xl mx-auto bg-[#080A06] z-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="feature-card"><DiagnosticShuffler /></div>
        <div className="feature-card"><TelemetryTypewriter /></div>
        <div className="feature-card"><SignalGraph /></div>
      </div>
    </section>
  );
}
