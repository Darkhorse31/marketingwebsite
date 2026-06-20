"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FinalCollection() {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!container.current) return;

    const ctx = gsap.context(() => {
      // Pin and expand video/image
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1
        }
      });

      tl.to(videoRef.current, {
        width: "100%",
        height: "100vh",
        borderRadius: "0px",
        ease: "none"
      })
      .to(textRef.current, { opacity: 1, y: 0 }, "-=0.5");

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">

      <div ref={videoRef} className="relative w-[60%] h-[60vh] rounded-[40px] overflow-hidden will-change-transform z-0">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616082408435-081cb9fce0fa?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center brightness-50"></div>
         {/* Could be replaced with a looping cinematic video */}
      </div>

      <div ref={textRef} className="absolute z-10 text-center text-white opacity-0 translate-y-10 pointer-events-none">
        <h2 className="font-serif text-6xl md:text-9xl mb-6 drop-shadow-2xl">The Complete Aura</h2>
        <p className="font-sans font-light text-xl tracking-widest uppercase">Experience the full collection</p>
      </div>

    </section>
  );
}
