'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CursorTrail {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export function QuantumCursor() {
  const [trails, setTrails] = useState<CursorTrail[]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const trailId = useRef(0);
  const lastPositions = useRef<{ x: number; y: number }[]>([]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setPosition(newPosition);
      setIsVisible(true);
      
      // Add to last positions
      lastPositions.current.push(newPosition);
      if (lastPositions.current.length > 10) {
        lastPositions.current.shift();
      }
      
      // Create new trail
      const newTrail: CursorTrail = {
        id: trailId.current++,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 10 + 5,
        opacity: Math.random() * 0.5 + 0.3
      };
      
      setTrails(prev => [...prev, newTrail]);
      
      // Remove trail after animation
      setTimeout(() => {
        setTrails(prev => prev.filter(trail => trail.id !== newTrail.id));
      }, 1000);
    };
    
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  // Calculate velocity for size effect
  const velocity = lastPositions.current.length > 1 ? 
    Math.sqrt(
      Math.pow(lastPositions.current[lastPositions.current.length - 1].x - lastPositions.current[0].x, 2) +
      Math.pow(lastPositions.current[lastPositions.current.length - 1].y - lastPositions.current[0].y, 2)
    ) / 10 : 0;
  
  return (
    <>
      {/* Cursor trails */}
      {trails.map(trail => (
        <motion.div
          key={trail.id}
          className="fixed pointer-events-none rounded-full z-50"
          style={{
            left: trail.x,
            top: trail.y,
            width: trail.size,
            height: trail.size,
            background: `radial-gradient(circle, rgba(0, 255, 255, ${trail.opacity}), transparent)`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ 
            scale: 0, 
            opacity: trail.opacity 
          }}
          animate={{ 
            scale: [0, 1, 0.5],
            opacity: 0
          }}
          transition={{ 
            duration: 1, 
            ease: "easeOut" 
          }}
        />
      ))}
      
      {/* Main cursor */}
      {isVisible && (
        <motion.div
          className="fixed pointer-events-none rounded-full z-50 border-2 border-cyan-400"
          style={{
            left: position.x,
            top: position.y,
            width: 20 + velocity,
            height: 20 + velocity,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(0, 255, 255, 0.2), transparent 70%)'
          }}
          initial={{ scale: 0.8 }}
          animate={{ 
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 0.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-pulse" />
        </motion.div>
      )}
    </>
  );
}