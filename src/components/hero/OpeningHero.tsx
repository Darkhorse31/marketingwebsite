"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function OpeningHero() {
  const container = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!container.current) return;

    const ctx = gsap.context(() => {
      // Floating animation for bottle
      gsap.to(bottleRef.current, {
        y: -20,
        rotation: 1,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Ambient particle movement
      gsap.to(".particle", {
        y: "random(-50, 50)",
        x: "random(-50, 50)",
        rotation: "random(-180, 180)",
        opacity: "random(0.3, 0.8)",
        duration: "random(4, 8)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 2,
          each: 0.2
        }
      });

      // Scroll triggered parallax
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        }
      });

      tl.to(bottleRef.current, { y: 200, scale: 1.1, opacity: 0 }, 0)
        .to(textRef.current, { y: -100, opacity: 0 }, 0)
        .to(particlesRef.current, { y: -150, opacity: 0 }, 0);

      // Intro animation
      gsap.from(bottleRef.current, {
        y: 100,
        opacity: 0,
        duration: 2,
        ease: "power3.out",
        delay: 0.2
      });

      gsap.from(".hero-text-line", {
        y: 50,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.5
      });

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-rose-soft">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,var(--color-rose-primary)_0%,transparent_60%)] opacity-30 mix-blend-multiply" />

      {/* Particles */}
      <div ref={particlesRef} className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 rounded-full bg-white/60 backdrop-blur-sm blur-[1px]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `scale(${Math.random() * 2 + 0.5})`
            }}
          />
        ))}
      </div>

      <div className="relative z-20 container mx-auto px-4 flex flex-col items-center justify-center h-full">
        <div ref={bottleRef} className="relative w-64 h-96 md:w-80 md:h-[30rem] mb-8 will-change-transform">
          {/* Using a placeholder for now, replace with actual luxury product image */}
          <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-2xl overflow-hidden flex items-center justify-center glass-panel">
            <span className="font-serif text-2xl text-black/50">L&apos;AURA</span>
          </div>
          {/* <Image src="/images/hero-bottle.png" alt="Aura Luxury Serum" fill className="object-contain drop-shadow-2xl" priority /> */}
        </div>

        <div ref={textRef} className="text-center z-30">
          <h1 className="hero-text-line font-serif text-5xl md:text-8xl tracking-tighter text-gray-900 mb-4">
            Essence of <span className="italic font-light">Purity</span>
          </h1>
          <p className="hero-text-line text-lg md:text-xl text-gray-600 max-w-md mx-auto font-sans font-light tracking-wide">
            A cinematic journey through nature&apos;s most precious ingredients, distilled for your skin.
          </p>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center opacity-70">
        <span className="text-xs uppercase tracking-[0.2em] mb-2">Discover</span>
        <div className="w-[1px] h-12 bg-black/30 overflow-hidden relative">
            <div className="w-full h-full bg-black absolute top-0 left-0 animate-[scroll_2s_ease-in-out_infinite]" style={{ animationFillMode: 'both' }}></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
            0% { transform: translateY(-100%); }
            50% { transform: translateY(0%); }
            100% { transform: translateY(100%); }
        }
      `}</style>
    </section>
  );
}
