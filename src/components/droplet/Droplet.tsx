"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useDropletStore } from "@/store/useDropletStore";
import gsap from "gsap";

export default function Droplet() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  const geometryRef = useRef<THREE.SphereGeometry>(null);
  const originalPositions = useRef<Float32Array | null>(null);

  const quality = useDropletStore(state => state.quality);
  // Use optimized segments for vertex animation performance
  const segments = quality === 'mobile' ? 32 : 48;

  // Create static teardrop shape on mount
  useEffect(() => {
    if (geometryRef.current) {
      const posAttribute = geometryRef.current.getAttribute('position');
      originalPositions.current = new Float32Array(posAttribute.array);

      for (let i = 0; i < posAttribute.count; i++) {
        const y = originalPositions.current[i * 3 + 1];
        if (y > 0) {
          // Pinch the top half to form a subtle teardrop
          const factor = 1 - (y * 0.35);
          originalPositions.current[i * 3 + 0] *= factor;
          originalPositions.current[i * 3 + 2] *= factor;
          // Elongate top slightly
          originalPositions.current[i * 3 + 1] *= 1.15;
        }
      }
      // Use set instead of copyArray to support InterleavedBufferAttribute type checking
      for (let i = 0; i < posAttribute.count * 3; i++) {
        posAttribute.array[i] = originalPositions.current[i];
      }
      posAttribute.needsUpdate = true;
      geometryRef.current.computeVertexNormals();
    }
  }, [segments]);

  const activeTheme = useDropletStore(state => state.activeTheme);
  const ingredientTheme = useDropletStore(state => state.ingredientTheme);

  // Theme settings mapping (Tuned for pure, physical water)
  const themeSettings = useMemo(() => {
    // Base defaults for pure water
    let color = new THREE.Color("#ffffff");
    let transmission = 1;
    let roughness = 0;
    // Lower thickness maintains legibility of text behind it while still acting as a lens
    let thickness = 0.5;
    let ior = 1.33; // Exact IOR of water
    // Scaled down 25% overall as requested for elegance
    let scale = 0.75;

    // Adjust based on theme - mostly just subtle color tinting, maintaining water physical properties
    switch (activeTheme) {
      case 'Hero':
        color.set("#ffffff");
        scale = 0.9;
        break;
      case 'SignatureCollection':
        color.set("#fffaeb"); // Extremely subtle warm tint
        scale = 1.1;
        break;
      case 'IngredientStory':
        // Handle ingredient specific colors - kept very pale to maintain water look
        switch (ingredientTheme) {
          case 'Rose': color.set("#fff0f5"); break;
          case 'Lavender': color.set("#f8f0ff"); break;
          case 'VitaminC': color.set("#fff8eb"); break;
          case 'Aloe': color.set("#f0fff4"); break;
          case 'Gold': color.set("#fffaeb"); ior = 1.35; break;
        }
        scale = 0.95;
        break;
      case 'ProductBenefits':
        color.set("#f0f8ff"); // Extremely subtle cool tint
        scale = 0.8;
        break;
      case 'LifestyleGallery':
        color.set("#fffcf0");
        scale = 0.9;
        break;
      case 'Testimonials':
        color.set("#ffffff");
        scale = 0.6;
        break;
      case 'Footer':
        transmission = 0.8;
        scale = 0;
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

      // Gentle rotation
      meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
      meshRef.current.rotation.x = Math.cos(t * 0.3) * 0.05;

      // Subtle float
      const isIdle = useDropletStore.getState().isIdle;
      if (isIdle) {
         meshRef.current.position.y = Math.sin(t) * 0.05;
      } else {
         meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, delta * 2);
      }
    }

    // Apply physical fluid surface wobble
    if (geometryRef.current && originalPositions.current) {
      const posAttribute = geometryRef.current.getAttribute('position');
      const t = state.clock.elapsedTime;

      for(let i = 0; i < posAttribute.count; i++) {
        const ox = originalPositions.current[i * 3 + 0];
        const oy = originalPositions.current[i * 3 + 1];
        const oz = originalPositions.current[i * 3 + 2];

        // Tiny organic surface wave
        const wobble = Math.sin(ox * 4 + t * 2) * Math.cos(oy * 4 + t * 2) * Math.sin(oz * 4 + t * 2) * 0.015;

        posAttribute.array[i * 3 + 0] = ox + ox * wobble;
        posAttribute.array[i * 3 + 1] = oy + oy * wobble;
        posAttribute.array[i * 3 + 2] = oz + oz * wobble;
      }
      posAttribute.needsUpdate = true;
      // computeVertexNormals required for correct refraction lighting updates
      geometryRef.current.computeVertexNormals();
    }
  });

  // Calculate resolution for transmission material based on quality
  const resolution = quality === 'mobile' ? 128 : quality === 'tablet' ? 256 : 512;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry ref={geometryRef} args={[1, segments, segments]} />
      {quality === 'mobile' ? (
        // Simple fallback material for mobile, tuned for clear water
        <meshPhysicalMaterial
          ref={materialRef}
          transparent
          opacity={0.3}
          roughness={0}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0}
          ior={1.33}
        />
      ) : (
        // High quality pure water transmission material
        <MeshTransmissionMaterial
          ref={materialRef}
          background={new THREE.Color("#ffffff")}
          samples={quality === 'desktop' ? 16 : 8}
          resolution={resolution}
          transmission={1}
          roughness={0}
          thickness={0.5}
          ior={1.33}
          chromaticAberration={0.01} // Almost none for pure water
          anisotropy={0.1}
          distortion={0.0} // Disable material-level distortion (we will use vertex displacement later for physical waves)
          distortionScale={0.0}
          temporalDistortion={0.0}
          clearcoat={1}
          clearcoatRoughness={0}
          attenuationDistance={2.0}
          attenuationColor="#ffffff"
        />
      )}
    </mesh>
  );
}
