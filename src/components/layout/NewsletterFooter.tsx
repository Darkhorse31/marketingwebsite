"use client";

import { useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Extracted Custom Cursor for performance to prevent full component re-renders
const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 12}px, ${e.clientY - 12}px, 0)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={cursorRef}
      className="fixed top-0 left-0 w-6 h-6 rounded-full border border-gray-400 pointer-events-none z-[9999] mix-blend-difference transition-transform duration-75 ease-out hidden md:flex items-center justify-center will-change-transform"
    >
      <div className="w-1 h-1 bg-white rounded-full"></div>
    </div>
  );
};

export default function NewsletterFooter() {
  const container = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useLayoutEffect(() => {
    if (!container.current) return;
    
    const ctx = gsap.context(() => {
      // Parallax Footer Reveal
      gsap.fromTo(".footer-content",
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: container.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true
          }
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <CustomCursor />

      <section ref={container} className="relative w-full min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-end pt-32 clip-path-footer z-20">
        
        {/* Scene 13: Newsletter */}
        <div className="footer-content container mx-auto px-4 flex flex-col items-center text-center mb-32">
          <span className="text-sm uppercase tracking-[0.4em] text-white/50 mb-6">Join the Circle</span>
          <h2 className="font-serif text-5xl md:text-7xl mb-8">Access the Unseen</h2>
          <p className="font-sans font-light text-white/60 max-w-md mb-12">
            Subscribe for private releases, masterclasses, and an intimate look at our botanical curation.
          </p>
          
          <form ref={formRef} className="w-full max-w-lg relative group">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="w-full bg-transparent border-b border-white/20 pb-4 text-center text-xl font-light focus:outline-none focus:border-white transition-colors"
            />
            <button type="button" className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-6 h-6" />
            </button>
          </form>
        </div>

        {/* Scene 14: Footer */}
        <footer className="footer-content border-t border-white/10 pt-16 pb-8 w-full">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
            
            <div className="flex flex-col items-center md:items-start">
              <span className="font-serif text-4xl tracking-widest mb-2">L&apos;AURA</span>
              <span className="font-sans text-xs uppercase tracking-widest text-white/40">Paris • Grasse</span>
            </div>

            <div className="flex gap-16 font-sans text-sm font-light uppercase tracking-widest text-white/60">
              <div className="flex flex-col gap-4">
                <a href="#" className="hover:text-white transition-colors">Collections</a>
                <a href="#" className="hover:text-white transition-colors">Ingredients</a>
                <a href="#" className="hover:text-white transition-colors">Philosophy</a>
              </div>
              <div className="flex flex-col gap-4">
                <a href="#" className="hover:text-white transition-colors">Journal</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
                <a href="#" className="hover:text-white transition-colors">Legal</a>
              </div>
            </div>

          </div>
          
          <div className="container mx-auto px-4 mt-24 text-center font-sans text-xs text-white/20 uppercase tracking-widest">
            © {new Date().getFullYear()} L&apos;Aura Beauty. All Rights Reserved. Designed for Exhibition.
          </div>
        </footer>
        
      </section>
      
      <style jsx>{`
        .clip-path-footer {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
      `}</style>
    </>
  );
}
