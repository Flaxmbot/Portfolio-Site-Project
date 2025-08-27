'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useMagnetic } from '@/hooks/use-magnetic';
import { usePreset } from '@/hooks/use-preset';
import { usePerformance, smoothTransition } from '@/hooks/use-performance';

interface MagneticButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
  disabled?: boolean;
}

export function MagneticButton({ children, disabled = false, ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { x, y, handleMouseMove, handleMouseLeave } = useMagnetic(ref);
  const { isEnhanced, isDynamic } = usePreset();
  const { getGPUStyles } = usePerformance();

  // Only apply magnetic effects in enhanced or dynamic modes
  const shouldUseMagnetic = (isEnhanced || isDynamic) && !disabled;

  if (!shouldUseMagnetic) {
    return (
      <Button 
        ref={ref} 
        {...props}
        className={`${props.className || ''} transform-gpu will-change-transform transition-all duration-200`}
        style={{ ...getGPUStyles(), ...props.style }}
      >
        {children}
      </Button>
    );
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y, ...getGPUStyles() }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25, 
        mass: 0.1,
        restDelta: 0.001
      }}
      className="inline-block transform-gpu will-change-transform"
    >
      <Button 
        ref={ref} 
        {...props}
        className={`${props.className || ''} transform-gpu will-change-transform transition-all duration-200`}
        style={{ ...getGPUStyles(), ...props.style }}
      >
        {children}
      </Button>
    </motion.div>
  );
}