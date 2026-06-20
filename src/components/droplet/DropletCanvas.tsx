"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import { useDropletStore, DeviceQuality } from "@/store/useDropletStore";
import DropletController from "./DropletController";
import { Environment, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing";

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

        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow={quality === 'desktop'} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />

        <Environment preset="studio" />

        {/* The actual droplet and its animation controller */}
        <DropletController />

        {/* Post-processing (Disable on mobile) */}
        {quality !== 'mobile' && (
          quality === 'desktop' ? (
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.5}
                luminanceSmoothing={0.9}
                intensity={1.5}
                levels={8}
                mipmapBlur
              />
              <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
            </EffectComposer>
          ) : (
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.5}
                luminanceSmoothing={0.9}
                intensity={0.5}
                levels={8}
                mipmapBlur
              />
            </EffectComposer>
          )
        )}
      </Canvas>
    </div>
  );
}
