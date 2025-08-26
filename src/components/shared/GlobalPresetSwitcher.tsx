'use client';

import { usePreset } from '@/hooks/use-preset';
import { PresetSwitcher } from './PresetSwitcher';

export function GlobalPresetSwitcher() {
  const { preset, setPreset } = usePreset();
  
  return (
    <PresetSwitcher 
      currentPreset={preset}
      onPresetChange={setPreset}
    />
  );
}