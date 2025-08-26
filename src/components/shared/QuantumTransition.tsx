'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useSearchParams } from 'next/navigation';

interface QuantumTransitionProps {
  children: React.ReactNode;
}

export function QuantumTransition({ children }: QuantumTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Trigger transition on path change
    const handleTransition = () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1500);
    };
    
    handleTransition();
  }, [pathname, searchParams]);
  
  return (
    <>
      {/* Portal transition effect */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Crystalline light structures */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  background: `radial-gradient(circle, 
                    ${i % 3 === 0 ? 'rgba(0, 255, 255, 0.8)' : 
                      i % 3 === 1 ? 'rgba(255, 0, 255, 0.8)' : 
                      'rgba(255, 215, 0, 0.8)'}, 
                    transparent)`,
                  width: `${Math.random() * 100 + 50}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ 
                  scale: 0, 
                  opacity: 0,
                  rotate: 0
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                  rotate: 360
                }}
                transition={{ 
                  duration: 1.5, 
                  delay: i * 0.05,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* Portal effect */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="rounded-full border-4 border-cyan-400"
                style={{
                  width: 100,
                  height: 100
                }}
                initial={{ 
                  scale: 0,
                  borderWidth: 0
                }}
                animate={{ 
                  scale: [0, 1, 30],
                  borderWidth: [0, 4, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-magenta-400"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [0, 1, 30],
                  }}
                  transition={{ 
                    duration: 1.5,
                    delay: 0.2,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Page content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { delay: 0.5 }
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        {children}
      </motion.div>
    </>
  );
}