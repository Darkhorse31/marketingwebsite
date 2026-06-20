"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDropletStore } from "@/store/useDropletStore";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollPath() {
  const proxyRef = useRef({ x: 0, y: 0, z: 0 });
  const { setTargetPosition, setVisible } = useDropletStore();

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Initially hide droplet in hero section
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "100vh top",
        onEnter: () => setVisible(false),
        onLeave: () => setVisible(true),
        onEnterBack: () => setVisible(false),
      });

      // Master Timeline for Droplet Path mapped to total scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "100vh top", // Start after Hero
          end: "bottom bottom",
          scrub: 1.5,
          onUpdate: () => {
             // Sync GSAP proxy object to Zustand store on every scrub update
             setTargetPosition([proxyRef.current.x, proxyRef.current.y, proxyRef.current.z]);
          }
        }
      });

      // Define the elegant, mathematical bezier-like path down the page
      // Because we use "scrub", the duration acts as a relative distance ratio
      tl.to(proxyRef.current, { x: 1.5, y: -1, z: -2, duration: 1, ease: "sine.inOut" }) // Brand Philosophy
        .to(proxyRef.current, { x: -2, y: 0, z: 1, duration: 1.5, ease: "power1.inOut" }) // Signature Collection (orbits)
        .to(proxyRef.current, { x: 0, y: -2, z: 0, duration: 1, ease: "sine.inOut" }) // Ingredient Story
        .to(proxyRef.current, { x: 2, y: 1, z: -1, duration: 1, ease: "power2.inOut" }) // Product Benefits
        .to(proxyRef.current, { x: 0, y: 0, z: 2, duration: 1.5, ease: "power1.inOut" }) // Luxury Packaging (comes close to camera)
        .to(proxyRef.current, { x: -1.5, y: -1, z: 0, duration: 1, ease: "sine.inOut" }) // Featured Products
        .to(proxyRef.current, { x: 1.5, y: -2, z: -3, duration: 1, ease: "sine.inOut" }) // Lifestyle Gallery
        .to(proxyRef.current, { x: 0, y: 0, z: 0, duration: 1, ease: "power2.inOut" }) // Customer Experience
        .to(proxyRef.current, { x: -2, y: 1, z: -1, duration: 1, ease: "sine.inOut" }) // Brand Story
        .to(proxyRef.current, { x: 2, y: -1, z: -2, duration: 1, ease: "power1.inOut" }) // Awards
        .to(proxyRef.current, { x: 0, y: 0, z: 1.5, duration: 1.5, ease: "power3.inOut" }) // Final Collection
        .to(proxyRef.current, { x: 0, y: -1, z: -5, duration: 1, ease: "power1.in" }); // Footer (drifts away)

    });

    return () => ctx.revert();
  }, [setTargetPosition, setVisible]);

  return null; // This component is pure logic, no DOM rendering
}
