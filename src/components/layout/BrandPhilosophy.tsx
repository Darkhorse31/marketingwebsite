"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BrandPhilosophy() {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!container.current) return;

    const ctx = gsap.context(() => {
      // Pin the section
      ScrollTrigger.create({
        trigger: container.current,
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 1,
        id: "philosophy-pin"
      });

      // Text reveal animation
      const chars = gsap.utils.toArray('.reveal-text span');
      gsap.fromTo(chars,
        { opacity: 0.1, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top center",
            end: "center center",
            scrub: 1,
          }
        }
      );

      // Image parallax and scale inside the pin
      gsap.fromTo(imageRef.current,
        { scale: 1.2, y: 100 },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );

    }, container);

    return () => ctx.revert();
  }, []);

  // Split text helper for animation
  const text = "We believe luxury is not just a label, but a feeling. An ethereal connection between earth's raw beauty and your skin's natural resonance.";
  const words = text.split(" ");

  return (
    <section ref={container} className="relative w-full h-screen bg-rose-soft flex items-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
         <div ref={imageRef} className="w-[120%] h-[120%] -left-[10%] -top-[10%] absolute">
            {/* Abstract background for philosophy, replacing with a soft gradient for now */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-rose-primary/20 backdrop-blur-3xl mix-blend-overlay"></div>
         </div>
      </div>

      <div className="container mx-auto px-4 z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div ref={textRef} className="reveal-text font-serif text-3xl md:text-5xl leading-tight text-gray-900 max-w-2xl">
          {words.map((word, i) => (
            <span key={i} className="inline-block mr-[0.25em]">{word}</span>
          ))}
        </div>

        <div className="flex flex-col space-y-6 md:pl-12 opacity-80">
          <p className="font-sans text-lg font-light leading-relaxed text-gray-700">
            Every drop is meticulously crafted. We source only the rarest botanicals, harmonizing them with advanced cellular science.
          </p>
          <div className="w-12 h-[1px] bg-black/40"></div>
          <p className="font-sans text-sm uppercase tracking-widest text-gray-500">
            The Art of Formulation
          </p>
        </div>
      </div>
    </section>
  );
}
