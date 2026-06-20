import { create } from 'zustand';

export type SectionTheme =
  | 'Hero'
  | 'SignatureCollection'
  | 'IngredientStory'
  | 'ProductBenefits'
  | 'ProductCollection'
  | 'LifestyleGallery'
  | 'Testimonials'
  | 'BrandStory'
  | 'Newsletter'
  | 'Footer';

export type IngredientTheme = 'Rose' | 'Lavender' | 'VitaminC' | 'Aloe' | 'Gold' | 'None';

export type DeviceQuality = 'mobile' | 'tablet' | 'desktop';

interface DropletState {
  activeTheme: SectionTheme;
  ingredientTheme: IngredientTheme;
  scrollProgress: number;
  quality: DeviceQuality;
  isIdle: boolean;

  // Actions
  setActiveTheme: (theme: SectionTheme) => void;
  setIngredientTheme: (theme: IngredientTheme) => void;
  setScrollProgress: (progress: number) => void;
  setQuality: (quality: DeviceQuality) => void;
  setIsIdle: (isIdle: boolean) => void;
}

export const useDropletStore = create<DropletState>((set) => ({
  activeTheme: 'Hero',
  ingredientTheme: 'None',
  scrollProgress: 0,
  quality: 'desktop',
  isIdle: true,

  setActiveTheme: (theme) => set({ activeTheme: theme }),
  setIngredientTheme: (theme) => set({ ingredientTheme: theme }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setQuality: (quality) => set({ quality }),
  setIsIdle: (isIdle) => set({ isIdle }),
}));
