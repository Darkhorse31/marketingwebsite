"use client";

import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useDropletStore } from '@/store/useDropletStore';

// Vertex shader
const vertexShader = `
  varying vec2 vTexCoord;
  void main() {
    vTexCoord = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader adapted from the metaball reference
const fragmentShader = `
precision mediump float;

const int TRAIL_LENGTH = 15;
const float EPS = 1e-4;
const int ITR = 16;
const float PI = acos(-1.0);

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uTargetPos;
uniform vec3 uColor;
uniform vec2 uPointerTrail[TRAIL_LENGTH];

varying vec2 vTexCoord;

float rnd3D(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453123);
}

float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);

    float a000 = rnd3D(i);
    float a100 = rnd3D(i + vec3(1.0, 0.0, 0.0));
    float a010 = rnd3D(i + vec3(0.0, 1.0, 0.0));
    float a110 = rnd3D(i + vec3(1.0, 1.0, 0.0));
    float a001 = rnd3D(i + vec3(0.0, 0.0, 1.0));
    float a101 = rnd3D(i + vec3(1.0, 0.0, 1.0));
    float a011 = rnd3D(i + vec3(0.0, 1.0, 1.0));
    float a111 = rnd3D(i + vec3(1.0, 1.0, 1.0));

    vec3 u = f * f * (3.0 - 2.0 * f);

    float k0 = a000;
    float k1 = a100 - a000;
    float k2 = a010 - a000;
    float k3 = a001 - a000;
    float k4 = a000 - a100 - a010 + a110;
    float k5 = a000 - a010 - a001 + a011;
    float k6 = a000 - a100 - a001 + a101;
    float k7 = -a000 + a100 + a010 - a110 + a001 - a101 - a011 + a111;

    return k0 + k1 * u.x + k2 * u.y + k3 *u.z + k4 * u.x * u.y + k5 * u.y * u.z + k6 * u.z * u.x + k7 * u.x * u.y * u.z;
}

// Camera
vec3 origin = vec3(0.0, 0.0, 1.0);
vec3 lookAt = vec3(0.0, 0.0, 0.0);
vec3 cDir = normalize(lookAt - origin);
vec3 cUp = vec3(0.0, 1.0, 0.0);
vec3 cSide = cross(cDir, cUp);

float smoothMin(float d1, float d2, float k) {
    float h = exp(-k * d1) + exp(-k * d2);
    return -log(h) / k;
}

vec3 translate(vec3 p, vec3 t) {
    return p - t;
}

float sdSphere(vec3 p, float s)
{
    return length(p) - s;
}

float map(vec3 p) {
    float baseRadius = 15e-3;
    float radius = baseRadius * float(TRAIL_LENGTH);
    float k = 5.0; // Smoothing factor
    float d = 1e5;

    // Trail logic (interactive pointer)
    for (int i = 0; i < TRAIL_LENGTH; i++) {
        float fi = float(i);
        vec2 pointerTrail = uPointerTrail[i] * uResolution / min(uResolution.x, uResolution.y);

        float sphere = sdSphere(
                translate(p, vec3(pointerTrail, .0)),
                radius - baseRadius * fi
            );

        d = smoothMin(d, sphere, k);
    }

    // Main Droplet Logic (Scroll Driven)
    // We offset the sphere by uTargetPos, taking care to map the world space
    // uTargetPos into screen coordinates relative to the resolution
    vec3 targetOffset = vec3(uTargetPos.x * 0.3, uTargetPos.y * 0.3, uTargetPos.z * 0.1);
    float mainDroplet = sdSphere(translate(p, targetOffset), 0.35);

    // Add some noise distortion to the main droplet to make it feel alive
    mainDroplet += noise3D(p * 5.0 + uTime) * 0.02;

    d = smoothMin(d, mainDroplet, k);

    return d;
}

vec3 generateNormal(vec3 p) {
    return normalize(vec3(
            map(p + vec3(EPS, 0.0, 0.0)) - map(p + vec3(-EPS, 0.0, 0.0)),
            map(p + vec3(0.0, EPS, 0.0)) - map(p + vec3(0.0, -EPS, 0.0)),
            map(p + vec3(0.0, 0.0, EPS)) - map(p + vec3(0.0, 0.0, -EPS))
        ));
}

vec3 dropletColor(vec3 normal, vec3 rayDir) {
    vec3 reflectDir = reflect(rayDir, normal);

    float noisePosTime = noise3D(reflectDir * 2.0 + uTime);
    float noiseNegTime = noise3D(reflectDir * 2.0 - uTime);

    // Dynamic tinting based on active section uColor
    vec3 baseColor1 = mix(vec3(0.1765, 0.1255, 0.2275), uColor, 0.5) * noisePosTime;
    vec3 baseColor2 = mix(vec3(0.4118, 0.4118, 0.4157), uColor, 0.5) * noiseNegTime;

    float intensity = 2.0;
    vec3 color = (baseColor1 + baseColor2) * intensity;

    // Fake specular highlight / fresnel
    float fresnel = pow(1.0 - max(dot(normal, -rayDir), 0.0), 3.0);
    color += vec3(1.0) * fresnel * 0.5;

    return color;
}

void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);

    // Orthographic Camera
    vec3 ray = origin + cSide * p.x + cUp * p.y;
    vec3 rayDirection = cDir;

    float dist = 0.0;

    for (int i = 0; i < ITR; ++i) {
        dist = map(ray);
        ray += rayDirection * dist;
        if (dist < EPS) break;
    }

    vec3 color = vec3(0.0);
    float alpha = 0.0;

    if (dist < EPS) {
        vec3 normal = generateNormal(ray);
        color = dropletColor(normal, rayDirection);
        alpha = 1.0;
    }

    vec3 finalColor = pow(color, vec3(2.0)); // Adjusted gamma for softness

    gl_FragColor = vec4(finalColor, alpha);
}
`;

function ShaderMetaball() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { targetPosition, color, isVisible } = useDropletStore();

  const TRAIL_LENGTH = 15;
  const pointerTrailRef = useRef(Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector2(0, 0)));
  const targetPointer = useRef(new THREE.Vector2(0, 0));

  // Smoothly interpolated target position
  const currentTargetPos = useRef(new THREE.Vector3(0, 0, 0));
  const currentColor = useRef(new THREE.Color('#fdf2f8'));

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(typeof window !== 'undefined' ? window.innerWidth : 1000, typeof window !== 'undefined' ? window.innerHeight : 1000) },
    uTargetPos: { value: new THREE.Vector3(0, 0, 0) },
    uColor: { value: new THREE.Color('#fdf2f8') },
    uPointerTrail: { value: Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector2(0, 0)) }
  }), []);

  useEffect(() => {
    const handleResize = () => {
      if (materialRef.current) {
        materialRef.current.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      // Normalize pointer coordinates to -1 to 1 for the shader
      targetPointer.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handlePointerMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, []);

  useFrame((state) => {
    if (!materialRef.current || !meshRef.current) return;

    // Time
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    // Smooth position and color interpolations
    currentTargetPos.current.lerp(targetPosition, 0.05);
    currentColor.current.lerp(color, 0.05);

    materialRef.current.uniforms.uTargetPos.value.copy(currentTargetPos.current);
    materialRef.current.uniforms.uColor.value.copy(currentColor.current);

    // Update trail
    const trail = pointerTrailRef.current;

    // First element follows pointer smoothly
    trail[0].lerp(targetPointer.current, 0.2);

    // Rest of the elements follow the previous one
    for (let i = 1; i < TRAIL_LENGTH; i++) {
        trail[i].lerp(trail[i - 1], 0.4);
    }

    materialRef.current.uniforms.uPointerTrail.value = trail;

    // Visibility toggle (using scale to hide completely when in Hero section)
    const targetScale = isVisible ? 1 : 0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export default function DropletCanvas() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 z-50 w-full h-full" style={{ pointerEvents: "none" }}>
      {/* Orthographic Camera is ideal for full screen quad shaders */}
      <Canvas dpr={isMobile ? [1, 1] : [1, 2]} orthographic camera={{ position: [0, 0, 1], left: -1, right: 1, top: 1, bottom: -1, near: 0.1, far: 10 }}>
        <ShaderMetaball />
      </Canvas>
    </div>
  );
}
