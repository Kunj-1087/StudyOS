import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;

    const ctx = gsap.context(() => {
      let mouseX = 0, mouseY = 0;
      let ringX = 0, ringY = 0;

      const handleMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Zero lag dot
        gsap.set(dot, { x: mouseX, y: mouseY });
      };

      const animateRing = () => {
        // Lerp lag for ring
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        gsap.set(ring, { x: ringX, y: ringY });
        requestAnimationFrame(animateRing);
      };

      const handleMousedown = () => {
        gsap.to(dot, { scale: 0.6, duration: 0.15 });
      };
      const handleMouseup = () => {
        gsap.to(dot, { scale: 1, duration: 0.15 });
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mousedown', handleMousedown);
      window.addEventListener('mouseup', handleMouseup);
      
      requestAnimationFrame(animateRing);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousedown', handleMousedown);
        window.removeEventListener('mouseup', handleMouseup);
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block"></div>
      <div ref={ringRef} className="cursor-ring hidden md:block"></div>
    </>
  );
}
