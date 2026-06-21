"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useDropletStore } from "@/store/useDropletStore";

const PARTICLE_COUNT = 150;

export default function ParticleTrail({ parentVelocity }: { parentVelocity: React.MutableRefObject<THREE.Vector3> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const quality = useDropletStore(state => state.quality);
  const ingredientTheme = useDropletStore(state => state.ingredientTheme);

  // Track individual particle data
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      position: new THREE.Vector3(0, -100, 0), // Start hidden
      velocity: new THREE.Vector3(),
      life: 0,
      maxLife: Math.random() * 2 + 1,
      scale: Math.random() * 0.05 + 0.01
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Base colors for particles based on theme
  const particleColor = useMemo(() => {
    switch(ingredientTheme) {
      case 'Rose': return new THREE.Color("#fca5a5");
      case 'Lavender': return new THREE.Color("#d8b4fe");
      case 'VitaminC': return new THREE.Color("#fcd34d");
      case 'Aloe': return new THREE.Color("#86efac");
      case 'Gold': return new THREE.Color("#fef08a");
      default: return new THREE.Color("#ffffff");
    }
  }, [ingredientTheme]);

  const particleIndex = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    if (quality === 'mobile') return; // Disable particles on mobile entirely

    // Emit new particles if we are moving
    const speed = parentVelocity.current.length();

    if (speed > 0.01) {
      // Emit rate based on speed
      const emitCount = Math.floor(speed * 10);
      for (let i = 0; i < emitCount; i++) {
        const p = particles[particleIndex.current];
        // Start at current droplet position (relative to group, which is 0,0,0)
        p.position.set(
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2
        );
        // Inherit inverted velocity + random spread
        p.velocity.copy(parentVelocity.current).multiplyScalar(-0.5).add(
          new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            Math.random() * 0.5, // Drift up
            (Math.random() - 0.5) * 0.5
          )
        );
        p.life = p.maxLife;

        particleIndex.current = (particleIndex.current + 1) % PARTICLE_COUNT;
      }
    }

    // Update all particles
    particles.forEach((p, i) => {
      if (p.life > 0) {
        p.life -= delta;
        p.position.add(p.velocity.clone().multiplyScalar(delta));

        // Drag/fade
        p.velocity.multiplyScalar(0.95);

        const scale = p.scale * (p.life / p.maxLife);
        dummy.position.copy(p.position);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      } else {
        // Hide
        dummy.position.set(0, -100, 0);
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (quality === 'mobile') return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={particleColor} transparent opacity={0.6} />
    </instancedMesh>
  );
}
