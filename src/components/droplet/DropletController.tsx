"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Droplet from "./Droplet";
import ParticleTrail from "./ParticleTrail";
import { useDropletStore } from "@/store/useDropletStore";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function DropletController() {
  const groupRef = useRef<THREE.Group>(null);

  // Physics parameters
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));
  const currentPos = useRef(new THREE.Vector3(0, 0, 0));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));

  const activeTheme = useDropletStore(state => state.activeTheme);
  const setIsIdle = useDropletStore(state => state.setIsIdle);

  // Track scroll speed for physics
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const setScrollProgress = useDropletStore(state => state.setScrollProgress);

  useEffect(() => {
    // Register scroll progress listener and calculate 3D path based on scroll depth
    const handleScroll = () => {
      setIsIdle(false);

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setIsIdle(true);
      }, 150); // 150ms without scroll = idle

      // Calculate overall scroll progress (0 to 1)
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

      setScrollProgress(progress);

      // Calculate target 3D position based on scroll progress
      // Map scroll progress to a beautiful curved path through the screen space

      // Hero section (progress 0 - 0.1): Start center, slightly elevated
      // Signature (progress 0.1 - 0.2): Move right
      // Ingredients (progress 0.2 - 0.5): Weave left and right
      // Benefits/Products (progress 0.5 - 0.8): Center loops
      // End (progress 0.8 - 1.0): Fade/Dissolve center

      const theme = useDropletStore.getState().activeTheme;

      let tx = 0;
      let ty = 0;
      let tz = 0;

      // X Path (Left / Right weaving)
      tx = Math.sin(progress * Math.PI * 6) * 1.5;

      // Y Path (Vertical movement is mostly handled by the fixed canvas,
      // but we can add small vertical offsets so it feels like it's drifting)
      ty = Math.cos(progress * Math.PI * 8) * 0.5;

      // Z Path (Depth weaving)
      tz = Math.sin(progress * Math.PI * 4) * 2 - 1;

      // Section-specific overrides
      if (theme === 'Hero') {
        tx = 0; ty = 0; tz = 0; // Centered
      } else if (theme === 'SignatureCollection') {
        tx = 1.5; // Offset to right
        tz = 1;   // Bring forward
      } else if (theme === 'Footer') {
        tx = 0; ty = -2; tz = -2; // Sink and fade
      }

      // Update target pos
      targetPos.current.set(tx, ty, tz);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial trigger
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [setIsIdle, setScrollProgress]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // We will implement complex GSAP MotionPath later,
    // for now we use a simple spring physics approach to follow targetPos

    // Calculate spring physics
    const springStrength = 4.0; // Higher = tighter follow
    const damping = 0.8; // Higher = less bounce

    // Force = spring * distance
    const force = new THREE.Vector3().subVectors(targetPos.current, currentPos.current).multiplyScalar(springStrength);

    // Apply force to velocity, apply damping
    velocity.current.add(force.multiplyScalar(delta));
    velocity.current.multiplyScalar(damping);

    // Apply velocity to position
    currentPos.current.add(velocity.current);

    // Apply position to group
    groupRef.current.position.copy(currentPos.current);

    // Apply squash and stretch based on velocity
    const speed = velocity.current.length();
    // Move scale stretching to the inner Droplet component if needed,
    // or apply uniform scaling here
  });

  return (
    <group ref={groupRef}>
      <Droplet />
      <ParticleTrail parentVelocity={velocity} />
    </group>
  );
}
