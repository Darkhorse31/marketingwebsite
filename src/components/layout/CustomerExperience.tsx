"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CustomerExperience() {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!container.current) return;
    
    const ctx = gsap.context(() => {
      // Horizontal text scroll
      gsap.to(textRef.current, {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      // Card elevation
      gsap.fromTo(cardRef.current,
        { y: 100, opacity: 0, rotateX: 20 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top center",
          }
        }
      );

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative w-full py-40 overflow-hidden bg-rose-soft flex flex-col items-center justify-center perspective-[1000px]">
      
      {/* Background scrolling text */}
      <div className="absolute top-1/2 left-0 w-[200%] -translate-y-1/2 pointer-events-none opacity-5">
        <h2 ref={textRef} className="font-serif text-[15vw] whitespace-nowrap">
          UNCOMPROMISING QUALITY • ETHICAL SOURCING • CLINICAL RESULTS • 
        </h2>
      </div>

      <div ref={cardRef} className="relative z-10 glass-panel p-16 md:p-24 max-w-4xl mx-4 text-center rounded-[40px]">
        <div className="w-12 h-12 mx-auto mb-8 text-rose-primary opacity-60">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <p className="font-serif text-2xl md:text-4xl leading-relaxed mb-10 text-gray-800">
          &quot;The most transformative experience my skin has ever known. It feels less like a product and more like a rebirth.&quot;
        </p>
        <div className="flex flex-col items-center">
          <span className="font-sans font-medium text-sm tracking-widest uppercase text-gray-900 mb-1">Eleanor V.</span>
          <span className="font-sans font-light text-xs text-gray-500">Global Editor, VOGUE</span>
        </div>
      </div>
    </section>
  );
}
