import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import gsap from 'gsap';

export default function Faq() {
  const faqs = [
    {
      q: "Is this just another bootcamp or course aggregator?",
      a: "No. Bootcamps provide structured hand-holding for mass cohorts. Course aggregators sell you disjointed videos. StudyOS is an Academic Intelligence System—a command-layer offering deep, verified intelligence briefs, tactical maps, and market demand stats for independent operators."
    },
    {
      q: "How exactly do you verify 'XP' and operator reputation?",
      a: "Progress is recorded through completion of domain execution phases, verified project submissions, and peer validations from the community. Your operator ID becomes an immutable record of your intellectual capability, bypassing superficial resumes."
    },
    {
      q: "Which specific technical domains are covered?",
      a: "Currently, our intelligence briefs cover Tier-1 high-leverage domains: Machine Learning Engineering, Quantitative Finance, Cybersecurity, and Web3 Infrastructure. We only add domains with provable asymmetric market demand."
    },
    {
      q: "Who is the ideal 'Operator' for StudyOS?",
      a: "High-agency students and self-directed professionals. If you need someone to nag you to do your homework, this isn't for you. If you need pure signal, raw market data, and the tactical steps to master complex systems, you are an Operator."
    },
    {
      q: "How do I secure clearance?",
      a: "Clearance is granted by creating an Operator Profile. Upon verification, you gain immediate access to the intelligence network and can begin tracking your progression."
    }
  ];

  return (
    <section className="py-32 px-6 max-w-4xl mx-auto bg-[#080A06] z-20 relative">
      <div className="text-center mb-16">
        <h2 className="font-display font-bold text-4xl md:text-5xl text-[#EEFCE8] uppercase tracking-tighter mb-4">
          Intelligence Protocol <span className="text-[#C8F400]">// FAQ</span>
        </h2>
        <p className="font-mono text-sm text-[#A4B49F] tracking-widest uppercase">
          Eliminating Operational Uncertainty
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {faqs.map((faq, i) => (
          <FaqItem key={i} question={faq.q} answer={faq.a} num={i + 1} />
        ))}
      </div>
    </section>
  );
}

const FaqItem = ({ question, answer, num }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(contentRef.current, { height: 'auto', duration: 0.3, ease: 'power2.out' });
      gsap.to(contentRef.current, { opacity: 1, duration: 0.2, delay: 0.1 });
    } else {
      gsap.to(contentRef.current, { opacity: 0, duration: 0.2 });
      gsap.to(contentRef.current, { height: 0, duration: 0.3, ease: 'power2.out' });
    }
  }, [isOpen]);

  return (
    <div className="border border-[#182015] bg-[#0D110C] rounded-2xl overflow-hidden hover:border-[#C8F400]/30 transition-colors">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 md:p-8 flex items-center justify-between group"
      >
        <div className="flex items-center gap-6">
          <span className="font-mono text-[#FFB800] text-sm opacity-50 group-hover:opacity-100 transition-opacity">
            {num.toString().padStart(2, '0')}
          </span>
          <span className="font-display font-bold text-[#EEFCE8] text-lg md:text-xl group-hover:text-[#C8F400] transition-colors">
            {question}
          </span>
        </div>
        <Plus className={`w-6 h-6 text-[#A4B49F] group-hover:text-[#C8F400] transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
      </button>
      <div ref={contentRef} className="h-0 opacity-0 overflow-hidden px-6 md:px-8 pb-0">
        <div className="pb-8 font-body text-[#A4B49F] leading-relaxed max-w-[800px] border-t border-[#182015] pt-6 mt-2">
          {answer}
        </div>
      </div>
    </div>
  );
};
