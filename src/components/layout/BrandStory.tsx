"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BrandStory() {
  const container = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!container.current) return;

    const ctx = gsap.context(() => {
      // Parallax text
      gsap.fromTo(".story-text",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: container.current,
            start: "top 60%",
            end: "center center",
            scrub: true
          }
        }
      );

      // Image Scale
      gsap.to(imageRef.current, {
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative w-full py-32 flex flex-col items-center bg-white text-black overflow-hidden">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        <div className="relative w-full h-[80vh] overflow-hidden rounded-t-[100px] rounded-bl-[100px]">
          <div ref={imageRef} className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        </div>

        <div className="flex flex-col justify-center pr-10">
          <span className="story-text text-sm uppercase tracking-[0.3em] text-gray-500 mb-8 block">Heritage</span>
          <h2 className="story-text font-serif text-5xl md:text-7xl mb-10 leading-tight">
            Born from <br />
            <span className="italic text-gray-400">Botanical Mastery</span>
          </h2>
          <div className="story-text space-y-6 text-gray-600 font-light text-lg">
            <p>
              Decades ago, in the serene valleys of Grasse, our founder sought a different kind of luxury—one that didn&apos;t just mask the skin, but healed it fundamentally.
            </p>
            <p>
              It began with a single drop of hand-pressed rose oil. Today, that same devotion to artisanal extraction defines every formula we create. No shortcuts. No synthetic compromises.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
