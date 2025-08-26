'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuantumSparkProps {
  children: React.ReactNode;
  className?: string;
}

export function QuantumSpark({ children, className }: QuantumSparkProps) {
  const [sparks, setSparks] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const sparkId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleHoverStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create multiple sparks
    const newSparks = [];
    for (let i = 0; i < 5; i++) {
      newSparks.push({
        id: sparkId.current++,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        color: ['cyan', 'magenta', 'gold'][Math.floor(Math.random() * 3)]
      });
    }
    
    setSparks(prev => [...prev, ...newSparks]);
    
    // Remove sparks after animation
    setTimeout(() => {
      setSparks(prev => prev.filter(spark => !newSparks.some(newSpark => newSpark.id === spark.id)));
    }, 800);
  };
  
  return (
    <div
      ref={containerRef}
      className={`relative ${className || ''}`}
      onMouseEnter={handleHoverStart}
    >
      {/* Spark effects */}
      <AnimatePresence>
        {sparks.map(spark => (
          <motion.div
            key={spark.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: spark.x,
              top: spark.y,
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              background: spark.color === 'cyan' ? 'rgba(0, 255, 255, 0.8)' : 
                         spark.color === 'magenta' ? 'rgba(255, 0, 255, 0.8)' : 
                         'rgba(255, 215, 0, 0.8)',
              boxShadow: spark.color === 'cyan' ? '0 0 10px rgba(0, 255, 255, 0.8)' : 
                        spark.color === 'magenta' ? '0 0 10px rgba(255, 0, 255, 0.8)' : 
                        '0 0 10px rgba(255, 215, 0, 0.8)'
            }}
            initial={{ 
              scale: 0, 
              opacity: 0.8,
              x: 0,
              y: 0
            }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: 0,
              x: (Math.random() - 0.5) * 50,
              y: (Math.random() - 0.5) * 50
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut" 
            }}
          />
        ))}
      </AnimatePresence>
      
      {/* Prism-like refraction effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        whileHover={{
          background: 'linear-gradient(45deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1), rgba(255, 215, 0, 0.1))'
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Children content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}