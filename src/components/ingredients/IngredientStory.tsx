"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDropletStore, IngredientTheme } from "@/store/useDropletStore";

gsap.registerPlugin(ScrollTrigger);

export default function IngredientStory() {
  const container = useRef<HTMLDivElement>(null);
  const leftCol = useRef<HTMLDivElement>(null);

  const setActiveTheme = useDropletStore(state => state.setActiveTheme);
  const setIngredientTheme = useDropletStore(state => state.setIngredientTheme);

  useLayoutEffect(() => {
    if (!container.current) return;
    
    const ctx = gsap.context(() => {
      // Overall Section Trigger
      ScrollTrigger.create({
        trigger: container.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveTheme('IngredientStory'),
        onEnterBack: () => setActiveTheme('IngredientStory'),
      });

      // Pin Left Column
      ScrollTrigger.create({
        trigger: container.current,
        start: "top top",
        end: "bottom bottom",
        pin: leftCol.current,
        pinSpacing: false
      });

      // Map individual ingredients
      const items = gsap.utils.toArray('.ingredient-item') as HTMLElement[];

      items.forEach((item) => {
        const theme = item.getAttribute('data-theme') as IngredientTheme;

        ScrollTrigger.create({
          trigger: item,
          start: "top center",
          end: "bottom center",
          onEnter: () => setIngredientTheme(theme),
          onEnterBack: () => setIngredientTheme(theme),
        });

        // Parallax image
        const img = item.querySelector('.ingredient-img');
        if (img) {
          gsap.to(img, {
            y: -100,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          });
        }
      });

    }, container);

    return () => ctx.revert();
  }, [setActiveTheme, setIngredientTheme]);

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

      {/* Right Column - Scrolling Narrative */}
      <div className="w-full md:w-1/2 flex flex-col gap-[30vh] pt-[50vh] pb-[50vh] px-10 md:px-20 relative z-20">
        
        <div className="ingredient-item relative w-full h-[60vh] glass-panel overflow-hidden group flex items-center justify-center" data-theme="Rose">
          <div className="absolute inset-0 ingredient-img scale-[1.2] bg-rose-100 flex items-center justify-center">
             <span className="font-serif text-2xl opacity-40 text-rose-800">Damascus Rose</span>
          </div>
          <div className="absolute bottom-10 left-10 text-black z-10">
             <h4 className="font-serif text-3xl mb-2">Damascus Rose</h4>
             <p className="font-sans text-sm font-light uppercase tracking-widest opacity-70">Vitality & Bloom</p>
          </div>
        </div>

        <div className="ingredient-item relative w-full h-[60vh] glass-panel overflow-hidden group ml-auto md:w-4/5 flex items-center justify-center" data-theme="Lavender">
          <div className="absolute inset-0 ingredient-img scale-[1.2] bg-purple-100 flex items-center justify-center">
             <span className="font-serif text-2xl opacity-40 text-purple-800">French Lavender</span>
          </div>
          <div className="absolute bottom-10 left-10 text-black z-10">
             <h4 className="font-serif text-3xl mb-2">French Lavender</h4>
             <p className="font-sans text-sm font-light uppercase tracking-widest opacity-70">Calm & Restore</p>
          </div>
        </div>

        <div className="ingredient-item relative w-full h-[60vh] glass-panel overflow-hidden group flex items-center justify-center" data-theme="VitaminC">
          <div className="absolute inset-0 ingredient-img scale-[1.2] bg-orange-100 flex items-center justify-center">
             <span className="font-serif text-2xl opacity-40 text-orange-800">Vitamin C Core</span>
          </div>
          <div className="absolute bottom-10 left-10 text-black z-10">
             <h4 className="font-serif text-3xl mb-2">Vitamin C Core</h4>
             <p className="font-sans text-sm font-light uppercase tracking-widest opacity-70">Radiance & Glow</p>
          </div>
        </div>

        <div className="ingredient-item relative w-full h-[60vh] glass-panel overflow-hidden group ml-auto md:w-4/5 flex items-center justify-center" data-theme="Aloe">
          <div className="absolute inset-0 ingredient-img scale-[1.2] bg-green-100 flex items-center justify-center">
             <span className="font-serif text-2xl opacity-40 text-green-800">Desert Aloe</span>
          </div>
          <div className="absolute bottom-10 left-10 text-black z-10">
             <h4 className="font-serif text-3xl mb-2">Desert Aloe</h4>
             <p className="font-sans text-sm font-light uppercase tracking-widest opacity-70">Deep Hydration</p>
          </div>
        </div>

        <div className="ingredient-item relative w-full h-[60vh] glass-panel overflow-hidden group flex items-center justify-center" data-theme="Gold">
          <div className="absolute inset-0 ingredient-img scale-[1.2] bg-yellow-100 flex items-center justify-center">
             <span className="font-serif text-2xl opacity-40 text-yellow-800">Cellular Gold</span>
          </div>
          <div className="absolute bottom-10 left-10 text-black z-10">
             <h4 className="font-serif text-3xl mb-2">Cellular Gold</h4>
             <p className="font-sans text-sm font-light uppercase tracking-widest opacity-70">Anti-inflammatory</p>
          </div>
        </div>

      </div>
    </section>
  );
}
