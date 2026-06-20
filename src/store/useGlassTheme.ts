import { create } from 'zustand';

interface GlassThemeState {
  tintColor: string;
  reflectionStrength: number;
  glowStrength: number;
  setGlassTheme: (theme: Partial<GlassThemeState>) => void;
}

export const useGlassTheme = create<GlassThemeState>((set) => ({
  tintColor: 'rgba(255, 255, 255, 0.05)', // Default subtle white
  reflectionStrength: 1.0,
  glowStrength: 1.0,
  setGlassTheme: (theme) => set((state) => ({ ...state, ...theme })),
}));
