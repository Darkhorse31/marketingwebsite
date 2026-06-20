"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function IngredientStory() {
  const container = useRef<HTMLDivElement>(null);
  const leftCol = useRef<HTMLDivElement>(null);
  const rightCol = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!container.current) return;
    
    const ctx = gsap.context(() => {
      // Color Theme Morph Trigger (Lavender to Fresh)
      ScrollTrigger.create({
        trigger: container.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          gsap.to(document.documentElement, {
            "--bg-color": "var(--color-fresh-soft)",
            "--accent-color": "var(--color-fresh-primary)",
            duration: 1.5,
            ease: "power2.inOut"
          });
        },
        onLeaveBack: () => {
          gsap.to(document.documentElement, {
            "--bg-color": "var(--color-lavender-soft)",
            "--accent-color": "var(--color-lavender-primary)",
            duration: 1.5,
            ease: "power2.inOut"
          });
        }
      });

      // Pin Left Column, Scroll Right Column
      ScrollTrigger.create({
        trigger: container.current,
        start: "top top",
        end: "bottom bottom",
        pin: leftCol.current,
        pinSpacing: false
      });

      // Image Parallax within Right Column
      const images = gsap.utils.toArray('.ingredient-img');
      images.forEach((img: any) => {
        gsap.to(img, {
          y: -100,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
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
    <section ref={container} className="relative w-full flex flex-col md:flex-row pb-[20vh]">
      {/* Left Column - Pinned Text */}
      <div ref={leftCol} className="w-full md:w-1/2 h-screen flex flex-col justify-center px-10 md:px-20 z-10">
        <span className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">Raw Potency</span>
        <h2 className="font-serif text-5xl md:text-7xl mb-8 leading-tight">
          Nature&apos;s <br />
          <span className="italic text-gray-400">Architecture</span>
        </h2>
        <p className="font-sans font-light text-xl text-gray-600 max-w-md">
          We strip away the unnecessary, leaving only the most vital, resonant botanical extracts.
        </p>
      </div>

      {/* Right Column - Scrolling Images */}
      <div ref={rightCol} className="w-full md:w-1/2 flex flex-col gap-32 pt-[50vh] px-10 md:px-20 relative z-20">
        
        {/* Ingredient 1 */}
        <div className="relative w-full aspect-[3/4] glass-panel overflow-hidden group">
          <div className="absolute inset-0 ingredient-img scale-[1.2] flex items-center justify-center bg-black/5">
             <span className="font-serif text-2xl opacity-40">24k Gold Flakes</span>
          </div>
          <div className="absolute bottom-10 left-10 text-black">
             <h4 className="font-serif text-3xl mb-2">Cellular Gold</h4>
             <p className="font-sans text-sm font-light uppercase tracking-widest opacity-70">Anti-inflammatory</p>
          </div>
        </div>

        {/* Ingredient 2 */}
        <div className="relative w-full aspect-square glass-panel overflow-hidden group ml-auto md:w-4/5">
          <div className="absolute inset-0 ingredient-img scale-[1.2] flex items-center justify-center bg-black/5">
             <span className="font-serif text-2xl opacity-40">Aloe Vera Heart</span>
          </div>
          <div className="absolute bottom-10 left-10 text-black">
             <h4 className="font-serif text-3xl mb-2">Desert Aloe</h4>
             <p className="font-sans text-sm font-light uppercase tracking-widest opacity-70">Deep Hydration</p>
          </div>
        </div>

        {/* Ingredient 3 */}
        <div className="relative w-full aspect-[4/3] glass-panel overflow-hidden group">
          <div className="absolute inset-0 ingredient-img scale-[1.2] flex items-center justify-center bg-black/5">
             <span className="font-serif text-2xl opacity-40">Wild Honey</span>
          </div>
          <div className="absolute bottom-10 left-10 text-black">
             <h4 className="font-serif text-3xl mb-2">Manuka Nectar</h4>
             <p className="font-sans text-sm font-light uppercase tracking-widest opacity-70">Cell Repair</p>
          </div>
        </div>

      </div>
    </section>
  );
}
