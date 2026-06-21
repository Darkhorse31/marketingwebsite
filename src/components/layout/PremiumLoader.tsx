"use client";

import { useEffect, useRef, useState } from "react";
import { useLoadingStore } from "@/lib/store";
import { useProgress } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";

// Custom shader material for the organic liquid droplet
const dropletVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float uTime;

  // Simplex 3D Noise
  // by Ian McEwan, Ashima Arts
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //  x0 = x0 - 0.0 + 0.0 * C
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    // Permutations
    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients
    // ( N*N points uniformly over a square, mapped onto an octahedron.)
    float n_ = 1.0/7.0; // N=7
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vNormal = normal;

    vec3 pos = position;
    // Add organic displacement using simplex noise
    float noiseFreq = 2.0;
    float noiseAmp = 0.15;
    vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y * noiseFreq + uTime * 0.5, pos.z * noiseFreq);
    pos += normal * snoise(noisePos) * noiseAmp;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const dropletFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float uTime;
  uniform vec3 uColor;

  void main() {
    // Basic fresnel effect for glass/liquid look
    vec3 viewDirection = normalize(cameraPosition - vNormal);
    float fresnel = dot(viewDirection, vNormal);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 3.0);

    // Add a soft iridescence or caustics effect
    vec3 iridescentColor = vec3(0.98, 0.9, 0.95); // soft rose/pearl

    // Base liquid color mixing
    vec3 finalColor = mix(uColor, iridescentColor, fresnel * 0.8);

    // Add some soft lighting
    vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
    float diffuse = max(dot(vNormal, lightDirection), 0.0);
    finalColor += diffuse * 0.2;

    // Specular highlight
    vec3 reflectDir = reflect(-lightDirection, vNormal);
    float specular = pow(max(dot(viewDirection, reflectDir), 0.0), 32.0);
    finalColor += specular * 0.5;

    gl_FragColor = vec4(finalColor, 0.9); // Slight transparency
  }
`;

function LiquidDroplet() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.5}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={dropletVertexShader}
        fragmentShader={dropletFragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#fbcfe8") } // Rose primary color
        }}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function PremiumLoader() {
  const [showButton, setShowButton] = useState(false);
  const [internalProgress, setInternalProgress] = useState(0);
  const { isLoaded, setIsLoaded, setHasInteracted } = useLoadingStore();
  const { progress } = useProgress();

  // Custom asset loading tracker
  useEffect(() => {
    // In a real scenario, this would track actual assets.
    // Drei's useProgress tracks Three.js assets.
    // We combine it with a timed fake progress to ensure a minimum display time
    // and smooth out the progression for a better UX.
    let start = 0;
    const duration = 2500; // Minimum 2.5s loading time for cinematic effect
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const timeProgress = Math.min((elapsed / duration) * 100, 100);

      // The true progress is whichever is higher, our timed minimum or the actual loaded assets
      // (assuming Drei progress is 100 eventually)
      // For images/videos, we'd add custom tracking here. For now, we simulate a smooth ramp up.
      const currentProgress = Math.max(timeProgress, progress);

      if (currentProgress >= 100) {
        setInternalProgress(100);
        setShowButton(true);
        clearInterval(interval);
      } else {
        setInternalProgress(currentProgress);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [progress]);

  const handleEnter = () => {
    // Animate out
    setIsLoaded(true);
    setHasInteracted(true);
  };

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-rose-soft overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,var(--color-rose-primary)_0%,transparent_50%)] opacity-20 mix-blend-multiply" />

          {/* WebGL Canvas */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <LiquidDroplet />
            </Canvas>
          </div>

          <div className="relative z-20 flex flex-col items-center justify-center w-full h-full p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="font-serif text-3xl md:text-5xl tracking-widest text-black/80 uppercase">Aura</h1>
            </motion.div>

            <div className="absolute bottom-20 flex flex-col items-center">
              <div className="w-48 h-[1px] bg-black/10 overflow-hidden mb-4 relative">
                <motion.div
                  className="h-full bg-black/50"
                  initial={{ width: 0 }}
                    animate={{ width: `${internalProgress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>

              <div className="text-xs font-sans tracking-[0.2em] text-black/40 h-6">
                {!showButton ? (
                  <span>LOADING {Math.floor(internalProgress)}%</span>
                ) : (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onClick={handleEnter}
                    className="hover:text-black transition-colors duration-300 pointer-events-auto cursor-pointer pb-1 border-b border-transparent hover:border-black/30"
                  >
                    ENTER EXPERIENCE
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
