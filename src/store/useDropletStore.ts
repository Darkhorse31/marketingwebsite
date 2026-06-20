import { create } from 'zustand';
import * as THREE from 'three';

interface DropletState {
  color: THREE.Color;
  targetPosition: THREE.Vector3;
  targetScale: number;
  isHovered: boolean;
  isVisible: boolean;
  scrollProgress: number;
  setColor: (colorHex: string) => void;
  setTargetPosition: (pos: [number, number, number]) => void;
  setTargetScale: (scale: number) => void;
  setHovered: (hovered: boolean) => void;
  setVisible: (visible: boolean) => void;
  setScrollProgress: (progress: number) => void;
}

export const useDropletStore = create<DropletState>((set) => ({
  color: new THREE.Color('#fdf2f8'), // Default soft rose
  targetPosition: new THREE.Vector3(0, 0, 0),
  targetScale: 1,
  isHovered: false,
  isVisible: false, // Initially hidden during Hero section
  scrollProgress: 0,
  setColor: (colorHex) => set(() => {
    return { color: new THREE.Color(colorHex) };
  }),
  setTargetPosition: (pos) => set({ targetPosition: new THREE.Vector3(...pos) }),
  setTargetScale: (scale) => set({ targetScale: scale }),
  setHovered: (hovered) => set({ isHovered: hovered }),
  setVisible: (visible) => set({ isVisible: visible }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
}));
