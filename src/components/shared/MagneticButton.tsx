'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useMagnetic } from '@/hooks/use-magnetic';
import { usePreset } from '@/hooks/use-preset';

interface MagneticButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
  disabled?: boolean;
}

export function MagneticButton({ children, disabled = false, ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { x, y, handleMouseMove, handleMouseLeave } = useMagnetic(ref);
  const { isEnhanced, isDynamic } = usePreset();

  // Only apply magnetic effects in enhanced or dynamic modes
  const shouldUseMagnetic = (isEnhanced || isDynamic) && !disabled;

  if (!shouldUseMagnetic) {
    return (
      <Button ref={ref} {...props}>
        {children}
      </Button>
    );
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      <Button ref={ref} {...props}>
        {children}
      </Button>
    </motion.div>
  );
}