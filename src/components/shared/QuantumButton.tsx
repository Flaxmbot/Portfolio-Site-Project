'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface QuantumButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  href?: string;
  [key: string]: any;
}

export function QuantumButton({
  children,
  className,
  variant = 'primary',
  onClick,
  href,
  ...props
}: QuantumButtonProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick();
    
    // Create ripple effect
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = {
        id: rippleId.current++,
        x,
        y
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    }
  };
  
  // Determine base classes based on variant
  const baseClasses = "relative overflow-hidden px-6 py-3 rounded-lg font-medium transition-all duration-300";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-cyan-500/30",
    secondary: "bg-gradient-to-r from-magenta-500 to-purple-500 text-white hover:from-magenta-600 hover:to-purple-600 shadow-lg hover:shadow-magenta-500/30",
    outline: "border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
  };
  
  const Component = href ? 'a' : 'button';
  
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="inline-block"
    >
      <Component
        ref={buttonRef}
        onClick={handleClick}
        href={href}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        {/* Ripple effects */}
        <AnimatePresence>
          {ripples.map(ripple => (
            <motion.div
              key={ripple.id}
              className="absolute rounded-full bg-white/30"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 0,
                height: 0
              }}
              initial={{ 
                width: 0, 
                height: 0, 
                opacity: 0.7,
                x: -0,
                y: -0
              }}
              animate={{ 
                width: 300, 
                height: 300, 
                opacity: 0,
                x: -150,
                y: -150
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
        
        {/* Button content */}
        <span className="relative z-10 flex items-center">
          {children}
        </span>
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </Component>
    </motion.div>
  );
}