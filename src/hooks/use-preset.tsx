'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PresetMode = 'simple' | 'enhanced' | 'dynamic' | 'minimal' | 'cosmic';

interface PresetContextType {
  preset: PresetMode;
  setPreset: (preset: PresetMode) => void;
  isEnhanced: boolean;
  isDynamic: boolean;
  isMinimal: boolean;
}

const PresetContext = createContext<PresetContextType | undefined>(undefined);

export function PresetProvider({ children }: { children: ReactNode }) {
  const [preset, setPresetState] = useState<PresetMode>('simple');

  // Load preset from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ui-preset') as PresetMode;
    if (saved && ['simple', 'enhanced', 'dynamic', 'minimal', 'cosmic'].includes(saved)) {
      setPresetState(saved);
    }
  }, []);

  const setPreset = (newPreset: PresetMode) => {
    setPresetState(newPreset);
    localStorage.setItem('ui-preset', newPreset);
  };

  const value = {
    preset,
    setPreset,
    isEnhanced: preset === 'enhanced' || preset === 'dynamic',
    isDynamic: preset === 'dynamic',
    isMinimal: preset === 'minimal'
  };

  return (
    <PresetContext.Provider value={value}>
      {children}
    </PresetContext.Provider>
  );
}

export function usePreset() {
  const context = useContext(PresetContext);
  if (!context) {
    throw new Error('usePreset must be used within a PresetProvider');
  }
  return context;
}