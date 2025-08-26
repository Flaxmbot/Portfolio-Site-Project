'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Palette, Sparkles, Zap, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as Popover from '@radix-ui/react-popover';
import * as Tooltip from '@radix-ui/react-tooltip';

export type PresetMode = 'simple' | 'enhanced' | 'dynamic' | 'minimal' | 'cosmic';

interface PresetSwitcherProps {
  currentPreset: PresetMode;
  onPresetChange: (preset: PresetMode) => void;
  className?: string;
}

const presets = [
  {
    id: 'simple' as const,
    name: 'Simple',
    description: 'Clean and minimal design',
    icon: Settings,
    color: 'text-gray-500'
  },
  {
    id: 'enhanced' as const,
    name: 'Enhanced',
    description: 'Animated backgrounds and effects',
    icon: Sparkles,
    color: 'text-purple-500'
  },
  {
    id: 'dynamic' as const,
    name: 'Dynamic',
    description: 'Full animations and interactions',
    icon: Zap,
    color: 'text-blue-500'
  },
  {
    id: 'minimal' as const,
    name: 'Minimal',
    description: 'Ultra-clean interface',
    icon: Palette,
    color: 'text-green-500'
  },
  {
    id: 'cosmic' as const,
    name: 'Cosmic',
    description: 'Starry night theme with cosmic effects',
    icon: Sparkles,
    color: 'text-indigo-500'
  }
];

export function PresetSwitcher({ currentPreset, onPresetChange, className }: PresetSwitcherProps) {
  const [open, setOpen] = useState(false);
  const currentPresetData = presets.find(p => p.id === currentPreset) || presets[0];
  const CurrentIcon = currentPresetData.icon;

  return (
    <Tooltip.Provider>
      <div className={cn('fixed bottom-6 right-6 z-50', className)}>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Popover.Trigger asChild>
                <Button
                  className={cn(
                    'h-12 w-12 rounded-full shadow-lg backdrop-blur-sm bg-background/80 border-2 transition-all duration-300 hover:scale-110',
                    currentPresetData.color,
                    open && 'scale-110'
                  )}
                >
                  <CurrentIcon className="h-5 w-5" />
                </Button>
              </Popover.Trigger>
            </Tooltip.Trigger>
            <Tooltip.Content
              side="left"
              className="bg-background border rounded-md px-3 py-2 text-sm shadow-md"
            >
              Switch UI Preset ({currentPresetData.name})
            </Tooltip.Content>
          </Tooltip.Root>

          <Popover.Content
            side="left"
            align="end"
            className="w-64 p-4 bg-background border rounded-lg shadow-xl backdrop-blur-sm"
            sideOffset={8}
          >
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-foreground">UI Presets</h3>
              <div className="grid gap-2">
                {presets.map((preset) => {
                  const Icon = preset.icon;
                  const isActive = currentPreset === preset.id;
                  
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onPresetChange(preset.id);
                        setOpen(false);
                      }}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-md text-left transition-all duration-200 hover:bg-accent',
                        isActive && 'bg-accent border border-primary/20'
                      )}
                    >
                      <Icon className={cn('h-4 w-4', preset.color)} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{preset.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {preset.description}
                        </div>
                      </div>
                      {isActive && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </Popover.Content>
        </Popover.Root>
      </div>
    </Tooltip.Provider>
  );
}