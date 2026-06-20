"use client";

import React, { useRef, useState, useEffect, ElementType } from 'react';
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useGlassTheme } from '@/store/useGlassTheme';

type GlassSurfaceProps<T extends ElementType = "div"> = {
  as?: T;
  children: React.ReactNode;
  className?: string;
  borderRadius?: string;
  interactive?: boolean;
} & React.ComponentPropsWithoutRef<T>;

export default function GlassSurface<T extends ElementType = "div">({
  as,
  children,
  className,
  borderRadius = '24px',
  interactive = false,
  ...props
}: GlassSurfaceProps<T>) {
  const Component = as ? motion(as as string) : motion.div;
  const ref = useRef<HTMLDivElement>(null);
  const { tintColor } = useGlassTheme();

  // Framer Motion 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  // Specular Highlight Movement
  const highlightX = useTransform(mouseXSpring, [-0.5, 0.5], ["-100%", "200%"]);
  const highlightY = useTransform(mouseYSpring, [-0.5, 0.5], ["-100%", "200%"]);

  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !ref.current || isMobile) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize to -0.5 to 0.5
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (!interactive || isMobile) return;
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Idle floating animation
  const idleAnimation = {
    y: interactive ? [0, -4, 0] : 0,
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  };

  return (
    <Component
      ref={ref}
      className={cn("relative group transform-gpu perspective-[1200px]", className)}
      style={{
        borderRadius,
        rotateX: interactive && !isMobile ? rotateX : 0,
        rotateY: interactive && !isMobile ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      animate={!isHovered ? idleAnimation : { y: -8 }} // Float up slightly on hover
      onMouseMove={handleMouseMove as any}
      onMouseEnter={() => interactive && !isMobile && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      {...(props as any)}
    >
      {/* Container to clip internal layers */}
      <div
        className="absolute inset-0 overflow-hidden transform-gpu"
        style={{ borderRadius }}
      >
          {/* Layer 1 & 2: Backdrop Blur & Refraction Distortion (using custom SVG filter) */}
          <div
             className="absolute inset-0 backdrop-blur-2xl bg-white/[0.02]"
             style={{ filter: "url(#liquid-refraction) url(#glass-caustics)" }}
          />

          {/* Layer 3: Dynamic Tint / Overlay */}
          <div
             className="absolute inset-0 transition-colors duration-700 ease-out"
             style={{ backgroundColor: tintColor, opacity: isHovered ? 0.8 : 0.5 }}
          />

          {/* Layer 4: Inner Highlight (Top/Left light wrap) */}
          <div
             className="absolute inset-0 rounded-[inherit] border border-white/20 pointer-events-none mix-blend-overlay"
             style={{ boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.4)" }}
          />

          {/* Layer 5: Inner Shadow (Bottom right depth) */}
          <div
             className="absolute inset-0 rounded-[inherit] pointer-events-none"
             style={{ boxShadow: "inset 0 -2px 10px rgba(0, 0, 0, 0.1)" }}
          />

          {/* Layer 6: Dynamic Specular Reflection (moves with mouse) */}
          {interactive && !isMobile && (
              <motion.div
                 className="absolute w-[150%] h-[150%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_60%)] pointer-events-none mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                 style={{
                    top: "-25%", left: "-25%",
                    x: highlightX, y: highlightY
                 }}
              />
          )}

          {/* Layer 7: Noise Texture (for realism) */}
          <div
             className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
          />
      </div>

      {/* Soft Ambient Outer Glow / Shadow */}
      <div
        className={cn(
          "absolute inset-0 -z-10 transition-all duration-700 pointer-events-none",
          isHovered ? "blur-xl opacity-60 scale-105" : "blur-lg opacity-30 scale-100"
        )}
        style={{ backgroundColor: tintColor, borderRadius }}
      />

      {/* Layer 8: Content Container (Floating above the glass backplate) */}
      <div className="relative z-10 w-full h-full" style={{ transform: "translateZ(20px)" }}>
         {children}
      </div>

    </Component>
  );
}
