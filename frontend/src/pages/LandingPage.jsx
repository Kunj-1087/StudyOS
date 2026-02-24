import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import CustomCursor from '../components/landing/CustomCursor';
import Navbar from '../components/landing/Navbar';
import PageLoader from '../components/landing/PageLoader';
import Hero from '../components/landing/Hero';
import SocialProofBar from '../components/landing/SocialProofBar';
import Features from '../components/landing/Features';
import Philosophy from '../components/landing/Philosophy';
import ProtocolCards from '../components/landing/ProtocolCards';
import Stats from '../components/landing/Stats';
import Faq from '../components/landing/Faq';
import FinalCta from '../components/landing/FinalCta';
import Footer from '../components/landing/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Smooth scroll (Lenis) setup
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Sync Lenis with GSAP Ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Global smooth navigation for anchor links
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');
      if (!target) return;
      const hash = target.getAttribute('href');
      if (hash && hash.startsWith('#')) {
        e.preventDefault();
        lenis.scrollTo(hash);
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <>
      <CustomCursor />
      
      {!isLoaded && <PageLoader onComplete={() => setIsLoaded(true)} />}

      <div style={{ opacity: isLoaded ? 1 : 0 }} className="transition-opacity duration-500">
        <Navbar />
        <Hero />
        <SocialProofBar />
        <Features />
        <Philosophy />
        <ProtocolCards />
        <Stats />
        <Faq />
        <FinalCta />
        <Footer />
      </div>
    </>
  );
}
