'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnimatedBackground } from './AnimatedBackground';

interface EnhancedSectionProps {
  children: React.ReactNode;
  className?: string;
  backgroundVariant?: 'particles' | 'gradient' | 'waves' | 'geometric';
  withBackground?: boolean;
  delay?: number;
}

export function EnhancedSection({ 
  children, 
  className,
  backgroundVariant = 'particles',
  withBackground = false,
  delay = 0
}: EnhancedSectionProps) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: "easeOut"
      }
    }
  };

  const content = (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={cn("relative", className)}
    >
      {children}
    </motion.div>
  );

  if (withBackground) {
    return (
      <AnimatedBackground variant={backgroundVariant} className="relative">
        {content}
      </AnimatedBackground>
    );
  }

  return content;
}