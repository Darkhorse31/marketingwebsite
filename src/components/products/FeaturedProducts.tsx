"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlassCard } from "@/components/ui/GlassComponents";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedProducts() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.featured-card');

      cards.forEach((card: any, i: number) => {
        gsap.fromTo(card,
          { y: 150, opacity: 0, rotate: i % 2 === 0 ? -5 : 5 },
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            }
          }
        );
      });

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative w-full py-32 bg-luxury-bg text-vitamin-soft">
      <div className="container mx-auto px-4">
        <div className="text-center mb-24">
          <h2 className="font-serif text-4xl md:text-6xl mb-4 text-luxury-gold">Curated Collection</h2>
          <div className="w-24 h-[1px] bg-luxury-gold/50 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {[
            { title: "Luminous Night Oil", price: "$240", type: "Restoration" },
            { title: "Cellular Eye Contour", price: "$180", type: "Targeted Repair" },
            { title: "Botanical Cleansing Silk", price: "$95", type: "Purification" }
          ].map((item, i) => (
            <GlassCard key={i} className="featured-card group cursor-pointer p-6">
              <div className="relative w-full aspect-[3/4] mb-8 overflow-hidden bg-white/5 rounded-sm">
                {/* Subtle hover zoom on image placeholder container */}
                <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                  <div className="w-full h-[80%] absolute top-0 left-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>
                  <span className="font-serif text-6xl text-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">0{i+1}</span>
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-xs uppercase tracking-[0.2em] text-luxury-gold/70 mb-2">{item.type}</span>
                <h3 className="font-serif text-2xl mb-2 group-hover:text-luxury-gold transition-colors">{item.title}</h3>
                <span className="font-sans font-light opacity-60">{item.price}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
