"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function SignatureCollection() {
  const container = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!container.current) return;
    
    const ctx = gsap.context(() => {
      // Color Theme Morph Trigger (Rose to Lavender)
      ScrollTrigger.create({
        trigger: container.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          gsap.to(document.documentElement, {
            "--bg-color": "var(--color-lavender-soft)",
            "--accent-color": "var(--color-lavender-primary)",
            duration: 1.5,
            ease: "power2.inOut"
          });
        },
        onLeaveBack: () => {
          gsap.to(document.documentElement, {
            "--bg-color": "var(--color-rose-soft)",
            "--accent-color": "var(--color-rose-primary)",
            duration: 1.5,
            ease: "power2.inOut"
          });
        }
      });

      // Horizontal Scroll for Products
      const products = gsap.utils.toArray('.product-card');
      
      gsap.to(products, {
        xPercent: -100 * (products.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          pin: true,
          scrub: 1,
          end: () => "+=" + (container.current?.offsetWidth || 0) * 2
        }
      });

      // Title Parallax
      gsap.to(titleRef.current, {
        x: 300,
        opacity: 0,
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "center top",
          scrub: true
        }
      });

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative w-full h-screen overflow-hidden flex flex-col justify-center">
      <div className="absolute top-20 left-10 md:left-20 z-10 pointer-events-none">
        <h2 ref={titleRef} className="font-serif text-6xl md:text-9xl text-black/10 whitespace-nowrap">
          Signature Collection
        </h2>
      </div>

      <div ref={productsRef} className="flex w-[300vw] h-[60vh] items-center relative z-20 mt-20">
        {/* Product 1 */}
        <div className="product-card w-screen flex flex-col md:flex-row items-center justify-center px-10 md:px-32 h-full gap-10">
          <div className="w-full md:w-1/2 h-[50vh] md:h-[80%] glass-panel rounded-t-full relative overflow-hidden group shadow-2xl border-white/40">
             <Image
               src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop"
               alt="Midnight Orchid Serum"
               fill
               className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 opacity-90"
               sizes="(max-width: 768px) 100vw, 50vw"
             />
             <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700"></div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <span className="text-sm uppercase tracking-widest text-gray-500">01 / The Elixir</span>
            <h3 className="font-serif text-5xl">Midnight Orchid</h3>
            <p className="font-sans font-light text-gray-600 max-w-md">
              Extracted during the twilight hours, this serum locks in temporal moisture and reverses environmental stress.
            </p>
          </div>
        </div>

        {/* Product 2 */}
        <div className="product-card w-screen flex flex-col md:flex-row items-center justify-center px-10 md:px-32 h-full gap-10">
          <div className="w-full md:w-1/2 h-[50vh] md:h-[80%] glass-panel rounded-b-full relative overflow-hidden group shadow-2xl border-white/40">
             <Image
               src="https://images.unsplash.com/photo-1615397323214-cb962ea53787?q=80&w=1000&auto=format&fit=crop"
               alt="Provencal Mist"
               fill
               className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 opacity-90"
               sizes="(max-width: 768px) 100vw, 50vw"
             />
             <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700"></div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <span className="text-sm uppercase tracking-widest text-gray-500">02 / The Essence</span>
            <h3 className="font-serif text-5xl">Provencal Mist</h3>
            <p className="font-sans font-light text-gray-600 max-w-md">
              A restorative aura mist that calms the senses and prepares the canvas for ultimate hydration.
            </p>
          </div>
        </div>

        {/* Product 3 */}
        <div className="product-card w-screen flex flex-col md:flex-row items-center justify-center px-10 md:px-32 h-full gap-10">
          <div className="w-full md:w-1/2 h-[50vh] md:h-[80%] glass-panel rounded-[100px] relative overflow-hidden group shadow-2xl border-white/40">
             <Image
               src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1000&auto=format&fit=crop"
               alt="Crushed Pearl Cream"
               fill
               className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 opacity-90"
               sizes="(max-width: 768px) 100vw, 50vw"
             />
             <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700"></div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <span className="text-sm uppercase tracking-widest text-gray-500">03 / The Seal</span>
            <h3 className="font-serif text-5xl">Crushed Pearl</h3>
            <p className="font-sans font-light text-gray-600 max-w-md">
              Luminous and weightless. Infused with micro-pearls to reflect light and blur imperfections instantly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
