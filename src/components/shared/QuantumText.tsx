'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface QuantumTextProps {
  children: string;
  className?: string;
  variant?: 'heading' | 'subheading' | 'body';
  as?: keyof JSX.IntrinsicElements;
}

export function QuantumText({
  children,
  className,
  variant = 'heading',
  as: Component = 'h1'
}: QuantumTextProps) {
  const [displayText, setDisplayText] = useState(children);
  const [isMultiverse, setIsMultiverse] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Variant styles
  const variantClasses = {
    heading: 'text-4xl md:text-6xl font-bold',
    subheading: 'text-2xl md:text-3xl font-semibold',
    body: 'text-lg md:text-xl'
  };
  
  // Multiverse versions of the text
  const multiverseVersions = [
    children,
    children.split('').reverse().join(''),
    children.split(' ').reverse().join(' '),
    children.replace(/[aeiou]/gi, '*'),
    children.replace(/[bcdfghjklmnpqrstvwxyz]/gi, '•')
  ];
  
  useEffect(() => {
    // Set up multiverse effect
    intervalRef.current = setInterval(() => {
      setIsMultiverse(true);
      
      // Randomly select a multiverse version
      const randomVersion = multiverseVersions[Math.floor(Math.random() * multiverseVersions.length)];
      setDisplayText(randomVersion);
      
      // Return to normal after a short time
      setTimeout(() => {
        setIsMultiverse(false);
        setDisplayText(children);
      }, 100);
    }, 5000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [children]);
  
  return (
    <motion.div
      className={cn('relative', variantClasses[variant], className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Photon trails */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 blur-xl animate-pulse" />
      
      {/* Main text with gradient */}
      <Component className={cn(
        "relative bg-clip-text text-transparent bg-gradient-to-r",
        isMultiverse 
          ? "from-cyan-300 via-magenta-300 to-yellow-300" 
          : "from-cyan-400 via-blue-400 to-purple-400"
      )}>
        {displayText}
      </Component>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-lg blur-lg"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.02, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Multiverse echo effect */}
      {isMultiverse && (
        <motion.div
          className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-magenta-400 via-purple-400 to-cyan-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <Component>{displayText}</Component>
        </motion.div>
      )}
    </motion.div>
  );
}