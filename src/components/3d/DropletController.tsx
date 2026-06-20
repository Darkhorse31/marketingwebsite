"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDropletStore } from "@/store/useDropletStore";

gsap.registerPlugin(ScrollTrigger);

// This component acts as a central hub to trigger state changes in the droplet
// based on DOM elements, keeping the individual components clean.
export default function DropletController() {
  const { setColor, setTargetScale } = useDropletStore();

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Define color zones mapped to DOM sections
      const colorZones = [
        { selector: ".bg-rose-soft", color: "#fdf2f8" }, // Soft Pink
        { selector: ".bg-lavender-soft", color: "#ddd6fe" }, // Lavender
        { selector: ".bg-fresh-soft", color: "#bbf7d0" }, // Mint Green
        { selector: ".bg-luxury-bg", color: "#d4af37" }, // Gold (for Black Luxury Bg)
        { selector: ".bg-vitamin-soft", color: "#fde68a" }, // Warm Golden Tint
        { selector: ".bg-black", color: "#ffffff" }, // Clear/White
      ];

      colorZones.forEach((zone) => {
        const elements = gsap.utils.toArray(zone.selector);
        elements.forEach((el: any) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top center",
            end: "bottom center",
            onEnter: () => setColor(zone.color),
            onEnterBack: () => setColor(zone.color),
          });
        });
      });

      // Special Interactions (e.g. slowing down / enlarging near products)
      const products = gsap.utils.toArray('.product-card, .featured-card');
      products.forEach((product: any) => {
         ScrollTrigger.create({
            trigger: product,
            start: "top center",
            end: "bottom center",
            onEnter: () => setTargetScale(1.5), // Enlarge slightly
            onLeave: () => setTargetScale(1.0), // Return to normal
            onEnterBack: () => setTargetScale(1.5),
            onLeaveBack: () => setTargetScale(1.0),
         });
      });

    });

    return () => ctx.revert();
  }, [setColor, setTargetScale]);

  return null;
}
