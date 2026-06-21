"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function LuxuryPackaging() {
  const container = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!container.current) return;
    
    const ctx = gsap.context(() => {
      // Theme Transition to Luxury (Black/Gold)
      ScrollTrigger.create({
        trigger: container.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          gsap.to(document.documentElement, {
            "--bg-color": "var(--color-luxury-bg)",
            "--text-color": "var(--color-vitamin-soft)",
            duration: 1.5,
            ease: "power2.inOut"
          });
        },
        onLeaveBack: () => {
          gsap.to(document.documentElement, {
            "--bg-color": "var(--color-vitamin-soft)",
            "--text-color": "#1a1a1a",
            duration: 1.5,
            ease: "power2.inOut"
          });
        }
      });

      // Mask reveal animation
      gsap.to(maskRef.current, {
        clipPath: "circle(150% at 50% 50%)",
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 1,
        }
      });

      // Text reveal
      gsap.fromTo(textRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "+=50%",
            scrub: true
          }
        }
      );

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative w-full h-screen bg-luxury-bg overflow-hidden flex items-center justify-center">
      {/* Masked Background Image representing packaging textures */}
      <div 
        ref={maskRef} 
        className="absolute inset-0 z-0"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      >
        <Image
          src="/images/packaging.png"
          alt="Sculpted Glass Packaging"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      </div>

      <div ref={textRef} className="relative z-10 text-center px-4 max-w-3xl mix-blend-difference text-white">
        <span className="text-sm uppercase tracking-[0.4em] text-luxury-gold mb-6 block">The Vessel</span>
        <h2 className="font-serif text-5xl md:text-8xl mb-8">Sculpted Glass</h2>
        <p className="font-sans font-light text-xl opacity-80">
          Heavy, sustainable glass. Hand-polished caps. Every detail designed to elevate your daily ritual.
        </p>
      </div>
    </section>
  );
}
