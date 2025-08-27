'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePreset } from '@/hooks/use-preset';

interface CursorTrail {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export function QuantumCursor() {
  const { preset } = usePreset();
  const [trails, setTrails] = useState<CursorTrail[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const trailId = useRef(0);
  
  // Use motion values for smooth cursor following
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  // Add spring animation for ultra-fast, ultra-smooth following
  const springX = useSpring(cursorX, { stiffness: 800, damping: 30, mass: 0.05 });
  const springY = useSpring(cursorY, { stiffness: 800, damping: 30, mass: 0.05 });
  
  // Hide quantum cursor for now
  const shouldShow = false; // preset === 'quantum' || preset === 'cosmic' || preset === 'enhanced';
  
  // Optimized mouse move handler with throttling
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!shouldShow) return;
    
    // Update motion values for smooth cursor following
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    setIsVisible(true);
    
    // Debug log to verify events are firing (uncomment to debug)
    // console.log('Quantum cursor move:', e.clientX, e.clientY, 'shouldShow:', shouldShow);
  }, [shouldShow, cursorX, cursorY]);

  // Optimized trail creation with throttling
  const handleTrailCreation = useCallback((e: MouseEvent) => {
    if (!shouldShow) return;
    
    // Create new trail with enhanced visibility
    const newTrail: CursorTrail = {
      id: trailId.current++,
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 4 + 3, // Slightly larger trails
      opacity: Math.random() * 0.4 + 0.2 // More visible trails
    };
    
    setTrails(prev => {
      // Limit trails to improve performance
      const newTrails = [...prev, newTrail];
      return newTrails.length > 8 ? newTrails.slice(-8) : newTrails;
    });
    
    // Remove trail after shorter animation for more responsive feel
    setTimeout(() => {
      setTrails(prev => prev.filter(trail => trail.id !== newTrail.id));
    }, 500);
  }, [shouldShow]);

  useEffect(() => {
    if (!shouldShow) {
      setIsVisible(false);
      setTrails([]);
      return;
    }

    // Don't hide default cursor - let both cursors be visible

    let lastTrailTime = 0;
    
    const throttledMouseMove = (e: MouseEvent) => {
      handleMouseMove(e);
      
      // Throttle trail creation for ultra-fast responsiveness
      const now = performance.now();
      if (now - lastTrailTime > 40) { // Further reduced to 40ms for ultra-fast trail creation
        lastTrailTime = now;
        handleTrailCreation(e);
      }
    };
    
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    
    const handleMouseEnter = () => {
      setIsVisible(true);
    };
    
    // Use passive listeners for better performance and attach to window for global coverage
    window.addEventListener('mousemove', throttledMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [shouldShow, handleMouseMove, handleTrailCreation]);
  
  // Don't render if not in quantum/cosmic mode
  if (!shouldShow) return null;
  
  return (
    <div className="quantum-cursor-container">
      {/* Cursor trails */}
      {trails.map(trail => (
        <motion.div
          key={trail.id}
          className="fixed pointer-events-none rounded-full quantum-cursor transform-gpu will-change-transform"
          style={{
            x: trail.x - trail.size / 2,
            y: trail.y - trail.size / 2,
            width: trail.size,
            height: trail.size,
            background: `radial-gradient(circle, rgba(0, 255, 255, ${trail.opacity}), transparent)`,
            zIndex: 99999
          }}
          initial={{ 
            scale: 0, 
            opacity: trail.opacity 
          }}
          animate={{ 
            scale: [0, 1, 0.8],
            opacity: 0
          }}
          transition={{ 
            duration: 0.5, 
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      ))}
      
      {/* Main cursor */}
      {isVisible && (
        <motion.div
          className="fixed pointer-events-none rounded-full quantum-cursor border border-cyan-400/60 transform-gpu will-change-transform"
          style={{
            x: springX,
            y: springY,
            width: 16,
            height: 16,
            translateX: '-50%',
            translateY: '-50%',
            background: 'radial-gradient(circle, rgba(0, 255, 255, 0.25), transparent 70%)',
            backdropFilter: 'blur(1px)',
            zIndex: 99999
          }}
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
          }}
          exit={{ scale: 0 }}
          transition={{ 
            scale: { duration: 0.1, ease: "easeOut" }
          }}
        >
          {/* Inner glow with optimized animation */}
          <motion.div 
            className="absolute inset-0 rounded-full bg-cyan-400/20" 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Center dot */}
          <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
        </motion.div>
      )}
    </div>
  );
}