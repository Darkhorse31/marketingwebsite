"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Awards() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const ctx = gsap.context(() => {
      const badges = gsap.utils.toArray('.award-badge');

      gsap.fromTo(badges,
        { scale: 0, opacity: 0, rotation: -45 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1,
          ease: "back.out(1.5)",
          stagger: 0.2,
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
    <section ref={container} className="relative w-full py-32 bg-white flex flex-col items-center border-t border-black/5">
      <div className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl mb-4">Recognized Excellence</h2>
      </div>

      <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-80">
        {['Allure Best of Beauty', 'Vogue Beauty Awards', 'Harper\'s Bazaar', 'Cosmopolitan Elite'].map((award, i) => (
          <div key={i} className="award-badge flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border border-black/20 flex items-center justify-center mb-4">
              <span className="font-serif text-2xl italic">{(new Date().getFullYear()) - (i % 3)}</span>
            </div>
            <span className="font-sans text-sm uppercase tracking-widest text-center max-w-[120px]">{award}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
