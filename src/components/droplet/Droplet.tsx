"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useDropletStore } from "@/store/useDropletStore";
import gsap from "gsap";

export default function Droplet() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  const activeTheme = useDropletStore(state => state.activeTheme);
  const ingredientTheme = useDropletStore(state => state.ingredientTheme);
  const quality = useDropletStore(state => state.quality);

  // Theme settings mapping
  const themeSettings = useMemo(() => {
    // Base defaults
    let color = new THREE.Color("#ffffff");
    let transmission = 1;
    let roughness = 0;
    let thickness = 1.5;
    let ior = 1.5;
    let scale = 1;

    // Adjust based on theme
    switch (activeTheme) {
      case 'Hero':
        color.set("#ffffff");
        transmission = 0.99;
        roughness = 0.05;
        thickness = 2;
        ior = 1.33; // Water
        scale = 1.2;
        break;
      case 'SignatureCollection':
        color.set("#fde047"); // Gold/Champagne tint
        transmission = 0.95;
        roughness = 0.1;
        thickness = 3;
        ior = 1.6; // Glass/Crystal
        scale = 1.5;
        break;
      case 'IngredientStory':
        // Handle ingredient specific colors
        switch (ingredientTheme) {
          case 'Rose': color.set("#fda4af"); break;
          case 'Lavender': color.set("#d8b4fe"); break;
          case 'VitaminC': color.set("#fdba74"); break;
          case 'Aloe': color.set("#86efac"); break;
          case 'Gold': color.set("#fef08a"); ior = 1.8; break;
        }
        transmission = 0.9;
        roughness = 0.15;
        thickness = 2.5;
        ior = 1.4;
        scale = 1.3;
        break;
      case 'ProductBenefits':
        color.set("#e0f2fe"); // Soft blue-white
        transmission = 0.99;
        roughness = 0.02;
        thickness = 1.5;
        ior = 1.45;
        scale = 1.1;
        break;
      case 'LifestyleGallery':
        color.set("#fef08a"); // Warm Beige / Pearl
        transmission = 0.8;
        roughness = 0.3; // More frosted/pearl
        thickness = 2;
        ior = 1.5;
        scale = 1.2;
        break;
      case 'Testimonials':
        color.set("#fef3c7");
        transmission = 0.9;
        roughness = 0.2;
        thickness = 1;
        ior = 1.4;
        scale = 0.8;
        break;
      case 'Footer':
        transmission = 0.5;
        roughness = 0.5;
        scale = 0; // Handled by gsap usually
        break;
      default:
        break;
    }

    // Scale adjustments for mobile
    if (quality === 'mobile') scale *= 0.6;
    else if (quality === 'tablet') scale *= 0.8;

    return { color, transmission, roughness, thickness, ior, scale };
  }, [activeTheme, ingredientTheme, quality]);

  // Animate material properties when theme changes
  useFrame((state, delta) => {
    if (materialRef.current) {
      // Smooth interpolation for color
      materialRef.current.color.lerp(themeSettings.color, delta * 2);

      // Smooth interpolation for other properties
      materialRef.current.transmission = THREE.MathUtils.lerp(materialRef.current.transmission, themeSettings.transmission, delta * 2);
      materialRef.current.roughness = THREE.MathUtils.lerp(materialRef.current.roughness, themeSettings.roughness, delta * 2);
      materialRef.current.thickness = THREE.MathUtils.lerp(materialRef.current.thickness, themeSettings.thickness, delta * 2);
      materialRef.current.ior = THREE.MathUtils.lerp(materialRef.current.ior, themeSettings.ior, delta * 2);
    }

    if (meshRef.current) {
      // Smooth scale interpolation
      const targetScale = themeSettings.scale;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 2);

      // Idle animation (wobble/breathing)
      const t = state.clock.getElapsedTime();

      // Wobble effect
      // Add a custom shader material for proper vertex displacement later if needed,
      // but simple rotation/position oscillation works well for MVP
      meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
      meshRef.current.rotation.x = Math.cos(t * 0.3) * 0.1;

      // Subtle float (only if we aren't heavily scrolling - could use isIdle state)
      const isIdle = useDropletStore.getState().isIdle;
      if (isIdle) {
         meshRef.current.position.y += Math.sin(t) * 0.002;
      }
    }
  });

  // Calculate resolution for transmission material based on quality
  const resolution = quality === 'mobile' ? 128 : quality === 'tablet' ? 256 : 512;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      {quality === 'mobile' ? (
        // Simple fallback material for mobile
        <meshPhysicalMaterial
          ref={materialRef}
          transparent
          opacity={0.9}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      ) : (
        // High quality transmission material
        <MeshTransmissionMaterial
          ref={materialRef}
          background={new THREE.Color("#ffffff")}
          samples={quality === 'desktop' ? 16 : 8}
          resolution={resolution}
          transmission={1}
          roughness={0}
          thickness={1.5}
          ior={1.5}
          chromaticAberration={0.06}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor="#ffffff"
        />
      )}
    </mesh>
  );
}
