import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GraphicOne = () => (
  <svg viewBox="0 0 200 200" className="w-[80%] h-[80%] opacity-80 animate-spin-slow">
    <circle cx="100" cy="100" r="90" fill="none" stroke="#00FF87" strokeWidth="2" strokeDasharray="10 15" />
    <circle cx="100" cy="100" r="60" fill="none" stroke="#C8F400" strokeWidth="2" strokeDasharray="5 10" />
    <path d="M100 20 L180 100 L100 180 L20 100 Z" fill="none" stroke="#A4B49F" strokeWidth="1" />
  </svg>
);

const GraphicTwo = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let scanY = 0;
    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw dot grid
      ctx.fillStyle = '#182015';
      for(let x=0; x<canvas.width; x+=20) {
        for(let y=0; y<canvas.height; y+=20) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI*2);
          ctx.fill();
        }
      }

      // Draw scanline
      ctx.fillStyle = '#C8F400';
      ctx.fillRect(0, scanY, canvas.width, 2);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.fillRect(0, scanY - 20, canvas.width, 20);

      scanY += 2;
      if (scanY > canvas.height) scanY = 0;

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} width={300} height={300} className="w-[80%] h-[80%] rounded shadow-[0_0_30px_rgba(0,240,255,0.1)]" />;
};

const GraphicThree = () => {
  const waveRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const len = waveRef.current.getTotalLength();
      gsap.set(waveRef.current, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(waveRef.current, {
        strokeDashoffset: 0,
        duration: 2,
        ease: "none",
        repeat: -1
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <svg viewBox="0 0 300 100" className="w-[90%] h-[40%]">
      <path 
        ref={waveRef}
        d="M 0 50 L 50 50 L 60 20 L 70 80 L 80 50 L 220 50 L 230 15 L 245 90 L 255 50 L 300 50" 
        fill="none" 
        stroke="#00FF87" 
        strokeWidth="3" 
        style={{ filter: "drop-shadow(0 0 8px rgba(204,255,0,0.6))" }}
      />
    </svg>
  );
};

export default function ProtocolCards() {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.protocol-card');
      
      cards.forEach((card, index) => {
        if (index === 0) return; // First card is already visible
        
        const previousCard = cards[index - 1];

        gsap.to(previousCard, {
          scale: 0.92,
          opacity: 0.4,
          filter: 'blur(8px)',
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "top top",
            scrub: true,
          }
        });
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const protocols = [
    {
      num: '01',
      title: 'Initialize Profile',
      desc: 'Connect your identity to the network. Upload your existing intelligence or start from scratch. Your operator ID becomes your central command node.',
      Graphic: GraphicOne
    },
    {
      num: '02',
      title: 'Analyze Demand',
      desc: 'Scan high-leverage domains via real-time market data. StudyOS extracts signal from noise, mapping out precise paths to technical mastery.',
      Graphic: GraphicTwo
    },
    {
      num: '03',
      title: 'Execute Action',
      desc: 'Verify your progress, log your XP, and prove competency. Each completed node builds an immutable layer of reputation within the ecosystem.',
      Graphic: GraphicThree
    }
  ];

  return (
    <section id="execution" className="bg-[#080A06]" ref={containerRef}>
      {protocols.map((p, i) => (
        <div key={i} className="protocol-card min-h-[100dvh] w-full flex items-center justify-center sticky top-0 px-6">
          <div className="w-full max-w-5xl bg-[#0D110C] border border-[#182015] rounded-[3rem] p-12 md:p-24 shadow-2xl overflow-hidden relative">
            
            {/* Background glowing orb */}
            <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-[#C8F400]/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10 w-full h-full">
              
              <div className="flex flex-col justify-center gap-6">
                <span className="font-mono text-[#C8F400] text-xl tracking-widest uppercase.">PROTOCOL_{p.num}</span>
                <h3 className="font-display font-bold text-5xl md:text-6xl text-[#EEFCE8] uppercase tracking-tighter">
                  {p.title}
                </h3>
                <p className="font-body text-[#A4B49F] text-lg max-w-[400px] leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="flex items-center justify-center relative aspect-square md:aspect-auto">
                {/* Decorative brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#182015]"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#182015]"></div>
                
                <p.Graphic />
              </div>
            </div>

          </div>
        </div>
      ))}
    </section>
  );
}
