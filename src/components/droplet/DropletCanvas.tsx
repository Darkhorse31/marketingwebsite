"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import { useDropletStore, DeviceQuality } from "@/store/useDropletStore";
import DropletController from "./DropletController";
import { Environment, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";

export default function DropletCanvas() {
  const setQuality = useDropletStore((state) => state.setQuality);
  const quality = useDropletStore((state) => state.quality);

  useEffect(() => {
    // Basic quality detection based on screen width
    // In a real app, might want more robust GPU detection
    const handleResize = () => {
      const width = window.innerWidth;
      let newQuality: DeviceQuality = 'desktop';
      if (width < 768) newQuality = 'mobile';
      else if (width < 1024) newQuality = 'tablet';
      setQuality(newQuality);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setQuality]);

  // Configure DPR and effects based on quality
  const maxDpr = quality === 'mobile' ? 1 : quality === 'tablet' ? 1.5 : 2;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, maxDpr]}
        gl={{
          antialias: quality !== 'mobile',
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <AdaptiveDpr pixelated={quality === 'mobile'} />
        <AdaptiveEvents />

        {/* Crisp Water Lighting */}
        <ambientLight intensity={0.8} color="#ffffff" />
        {/* Main highlight light (simulating sun/key light for a sharp specular hit) */}
        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
        {/* Soft fill light */}
        <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#e0f2fe" />

        {/* Clean environment for realistic reflections, avoiding heavy studio contrast */}
        <Environment preset="city" environmentIntensity={0.5} />

        {/* The actual droplet and its animation controller */}
        <DropletController />

        {/* Post-processing (Disable on mobile) - Bloom removed to prevent glowing bulb effect */}
        {quality === 'desktop' && (
            <EffectComposer>
              <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={1.5} height={480} />
            </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
