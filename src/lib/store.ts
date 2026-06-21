import { create } from 'zustand';

interface LoadingState {
  progress: number;
  isLoaded: boolean;
  hasInteracted: boolean;
  setProgress: (progress: number) => void;
  setIsLoaded: (isLoaded: boolean) => void;
  setHasInteracted: (hasInteracted: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  progress: 0,
  isLoaded: false,
  hasInteracted: false,
  setProgress: (progress) => set({ progress }),
  setIsLoaded: (isLoaded) => set({ isLoaded }),
  setHasInteracted: (hasInteracted) => set({ hasInteracted }),
}));
