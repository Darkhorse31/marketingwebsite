"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDropletStore } from "@/store/useDropletStore";

gsap.registerPlugin(ScrollTrigger);

export default function ProductBenefits() {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const setActiveTheme = useDropletStore((state) => state.setActiveTheme);

  useLayoutEffect(() => {
    if (!container.current) return;
    
    const ctx = gsap.context(() => {
      // Set Droplet Theme Trigger
      ScrollTrigger.create({
        trigger: container.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveTheme('ProductBenefits'),
        onEnterBack: () => setActiveTheme('ProductBenefits'),
      });

      // Text Scale and Fade
      gsap.fromTo(textRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 80%",
            end: "center center",
            scrub: true
          }
        }
      );

      // Benefit Items Stagger
      const items = gsap.utils.toArray('.benefit-item');
      gsap.fromTo(items,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container.current,
            start: "center 80%",
          }
        }
      );

    }, container);

    return () => ctx.revert();
  }, [setActiveTheme]);

  return (
    <section ref={container} className="relative w-full min-h-screen flex flex-col items-center justify-center py-32 px-4">
      <div ref={textRef} className="text-center mb-20 max-w-4xl mx-auto">
        <h2 className="font-serif text-5xl md:text-8xl mb-6">Visible Transformation</h2>
        <p className="font-sans text-xl text-gray-600 font-light">
          A metamorphosis of texture, tone, and vitality.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto w-full">
        {[
          { title: "Radiance", desc: "Illuminates from within using micro-optic technology." },
          { title: "Elasticity", desc: "Restores the skin's architectural bounce and firmness." },
          { title: "Clarity", desc: "Purifies pores and evens chromatic pigmentation." }
        ].map((benefit, i) => (
          <div key={i} className="benefit-item flex flex-col items-center text-center p-8 glass-panel rounded-3xl">
            <div className="w-16 h-16 rounded-full border border-black/10 flex items-center justify-center mb-6">
              <span className="font-serif text-xl italic">{i + 1}</span>
            </div>
            <h3 className="font-serif text-3xl mb-4">{benefit.title}</h3>
            <p className="font-sans font-light text-gray-600">{benefit.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
