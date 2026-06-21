"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1616394584738-fc6e612e71c9?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1608248593842-8021b191ab6e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555820585-c5ae44394b79?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1615397323214-cb962ea53787?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=800&auto=format&fit=crop"
];

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
          {[0, 1, 2].map((i) => (
            <div key={`col1-${i}`} className="relative w-full aspect-[3/4] bg-white/40 backdrop-blur-sm overflow-hidden group rounded-lg">
              <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-700">
                 <Image src={IMAGES[i]} alt={`Lifestyle gallery ${i}`} fill className="object-cover opacity-90" sizes="(max-width: 768px) 30vw, 25vw" />
                 <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Column 2 - Upward motion */}
        <div className="gallery-col flex flex-col gap-4 md:gap-8 w-1/3 mt-[10%]">
          {[3, 4, 5].map((i) => (
            <div key={`col2-${i}`} className="relative w-full aspect-[4/5] bg-white/60 backdrop-blur-sm overflow-hidden group rounded-lg">
              <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-700">
                 <Image src={IMAGES[i]} alt={`Lifestyle gallery ${i}`} fill className="object-cover opacity-90" sizes="(max-width: 768px) 30vw, 25vw" />
                 <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Column 3 - Downward motion */}
        <div className="gallery-col flex flex-col gap-4 md:gap-8 w-1/3 mt-[-5%]">
          {[6, 7, 8].map((i) => (
            <div key={`col3-${i}`} className="relative w-full aspect-square bg-white/50 backdrop-blur-sm overflow-hidden group rounded-lg">
              <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-700">
                 <Image src={IMAGES[i]} alt={`Lifestyle gallery ${i}`} fill className="object-cover opacity-90" sizes="(max-width: 768px) 30vw, 25vw" />
                 <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors duration-500"></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
