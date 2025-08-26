'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { usePreset } from '@/hooks/use-preset';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function TiltCard({ children, className, disabled = false }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isEnhanced, isDynamic } = usePreset();
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(ySpring, [-0.5, 0.5], ['12deg', '-12deg']);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ['-12deg', '12deg']);

  // Only apply tilt effects in enhanced modes and when not disabled
  const shouldUseTilt = (isEnhanced || isDynamic) && !disabled;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current || !shouldUseTilt) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (!shouldUseTilt) return;
    x.set(0);
    y.set(0);
  };

  if (!shouldUseTilt) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={className}
      initial={{ rotateX: 0, rotateY: 0 }}
      whileHover={{ 
        scale: isDynamic ? 1.02 : 1.01,
        transition: { duration: 0.2 }
      }}
    >
      <div style={{ transform: 'translateZ(50px)' }}>
        {children}
      </div>
    </motion.div>
  );
}