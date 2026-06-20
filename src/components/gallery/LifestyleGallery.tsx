"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LifestyleGallery() {
  const container = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!container.current) return;
    
    const ctx = gsap.context(() => {
      // Transition back to a softer theme for lifestyle
      ScrollTrigger.create({
        trigger: container.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          gsap.to(document.documentElement, {
            "--bg-color": "var(--color-rose-soft)",
            "--text-color": "#1a1a1a",
            duration: 1.5,
            ease: "power2.inOut"
          });
        },
        onLeaveBack: () => {
          gsap.to(document.documentElement, {
            "--bg-color": "var(--color-luxury-bg)",
            "--text-color": "var(--color-vitamin-soft)",
            duration: 1.5,
            ease: "power2.inOut"
          });
        }
      });

      // Parallax scrolling for columns
      const cols = gsap.utils.toArray('.gallery-col');
      cols.forEach((col: any, i: number) => {
        gsap.to(col, {
          y: i % 2 === 0 ? -150 : 150,
          ease: "none",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative w-full py-32 overflow-hidden bg-rose-soft">
      <div className="text-center mb-20 relative z-10">
        <h2 className="font-serif text-5xl md:text-7xl mb-4 text-gray-900">The Ritual</h2>
        <p className="font-sans font-light text-gray-500 uppercase tracking-widest text-sm">Aesthetic of Living</p>
      </div>

      <div ref={galleryRef} className="container mx-auto px-4 flex gap-4 md:gap-8 justify-center h-[150vh] overflow-hidden">
        
        {/* Column 1 - Downward motion */}
        <div className="gallery-col flex flex-col gap-4 md:gap-8 w-1/3 mt-[-10%]">
          {[1, 2, 3].map((item) => (
            <div key={`col1-${item}`} className="relative w-full aspect-[3/4] bg-white/40 backdrop-blur-sm overflow-hidden group rounded-lg">
              <div className="absolute inset-0 bg-black/5 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                 <span className="font-serif text-xl opacity-30">Spa Retreat</span>
              </div>
            </div>
          ))}
        </div>

        {/* Column 2 - Upward motion */}
        <div className="gallery-col flex flex-col gap-4 md:gap-8 w-1/3 mt-[10%]">
          {[4, 5, 6].map((item) => (
            <div key={`col2-${item}`} className="relative w-full aspect-[4/5] bg-white/60 backdrop-blur-sm overflow-hidden group rounded-lg">
              <div className="absolute inset-0 bg-black/5 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                 <span className="font-serif text-xl opacity-30">Natural Stone</span>
              </div>
            </div>
          ))}
        </div>

        {/* Column 3 - Downward motion */}
        <div className="gallery-col flex flex-col gap-4 md:gap-8 w-1/3 mt-[-5%]">
          {[7, 8, 9].map((item) => (
            <div key={`col3-${item}`} className="relative w-full aspect-square bg-white/50 backdrop-blur-sm overflow-hidden group rounded-lg">
              <div className="absolute inset-0 bg-black/5 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                 <span className="font-serif text-xl opacity-30">Candlelight</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
