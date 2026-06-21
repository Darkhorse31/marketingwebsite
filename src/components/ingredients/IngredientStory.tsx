"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

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
        <div className="relative w-full aspect-[3/4] rounded-2xl glass-panel overflow-hidden group border-white/40">
          <div className="absolute inset-0 ingredient-img scale-110 group-hover:scale-100 transition-transform duration-1000">
             <Image
               src="https://images.unsplash.com/photo-1616394584738-fc6e612e71c9?q=80&w=1000&auto=format&fit=crop"
               alt="Cellular Gold"
               fill
               className="object-cover"
               sizes="(max-width: 768px) 100vw, 50vw"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
          </div>
          <div className="absolute bottom-10 left-10 text-white z-10 drop-shadow-md">
             <h4 className="font-serif text-3xl mb-2">Cellular Gold</h4>
             <p className="font-sans text-sm font-light uppercase tracking-widest opacity-90">Anti-inflammatory</p>
          </div>
        </div>

        {/* Ingredient 2 */}
        <div className="relative w-full aspect-square rounded-2xl glass-panel overflow-hidden group ml-auto md:w-4/5 border-white/40">
          <div className="absolute inset-0 ingredient-img scale-110 group-hover:scale-100 transition-transform duration-1000">
             <Image
               src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop"
               alt="Desert Aloe"
               fill
               className="object-cover"
               sizes="(max-width: 768px) 100vw, 40vw"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
          </div>
          <div className="absolute bottom-10 left-10 text-white z-10 drop-shadow-md">
             <h4 className="font-serif text-3xl mb-2">Desert Aloe</h4>
             <p className="font-sans text-sm font-light uppercase tracking-widest opacity-90">Deep Hydration</p>
          </div>
        </div>

        {/* Ingredient 3 */}
        <div className="relative w-full aspect-[4/3] rounded-2xl glass-panel overflow-hidden group border-white/40">
          <div className="absolute inset-0 ingredient-img scale-110 group-hover:scale-100 transition-transform duration-1000">
             <Image
               src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1000&auto=format&fit=crop"
               alt="Manuka Nectar"
               fill
               className="object-cover"
               sizes="(max-width: 768px) 100vw, 50vw"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
          </div>
          <div className="absolute bottom-10 left-10 text-white z-10 drop-shadow-md">
             <h4 className="font-serif text-3xl mb-2">Manuka Nectar</h4>
             <p className="font-sans text-sm font-light uppercase tracking-widest opacity-90">Cell Repair</p>
          </div>
        </div>

      </div>
    </section>
  );
}
