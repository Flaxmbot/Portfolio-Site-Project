'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, MoveRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Floating element component with parallax effect
function FloatingElement({ 
  children, 
  delay = 0, 
  amplitude = 20,
  className 
}: { 
  children: React.ReactNode; 
  delay?: number; 
 amplitude?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 200, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 20 });
  
  const rotateX = useTransform(springY, [-0.5, 0.5], [amplitude, -amplitude]);
 const rotateY = useTransform(springX, [-0.5, 0.5], [-amplitude, amplitude]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      mouseX.set(x);
      mouseY.set(y);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);
  
  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={cn('will-change-transform', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.8, 
          delay,
          ease: "easeOut"
        } 
      }}
    >
      {children}
    </motion.div>
  );
}

// Text morphing component
function MorphingText({ texts }: { texts: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [texts.length]);
  
  return (
    <div className="relative h-[1.2em] overflow-hidden">
      {texts.map((text, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: index === currentIndex ? 1 : 0,
            y: index === currentIndex ? 0 : -20,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {text}
        </motion.div>
      ))}
    </div>
  );
}

// Holographic text component
function HolographicText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-lg blur opacity-75 animate-pulse"></div>
      <div className="relative bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
        {children}
      </div>
    </div>
  );
}

// Particle system component using only CSS
function ParticleSystem() {
  return (
    <div className="absolute inset-0 -z-20 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-purple-500 opacity-20"
          style={{
            width: `${Math.random() * 10 + 2}px`,
            height: `${Math.random() * 10 + 2}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

export function EnhancedHero() {
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 0.01);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  // Time-based color shifting
  const hue = 200 + Math.sin(time) * 60;
  
  return (
    <section className="relative text-center py-28 md:py-40 min-h-[80vh] flex flex-col justify-center items-center overflow-hidden">
      {/* Particle Background */}
      <ParticleSystem />
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 50%, hsla(${hue}, 80%, 50%, 0.3), transparent 70%)`
        }}
      />
      
      <div className="container mx-auto px-4 z-10 relative">
        {/* Floating Title */}
        <div className="pointer-events-none">
          <HolographicText className="text-5xl md:text-7xl font-headline font-bold mb-6">
            Aether Portfolio
          </HolographicText>
        </div>
        
        {/* Morphing Subtitle */}
        <FloatingElement delay={0.3} amplitude={8}>
          <div className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto text-muted-foreground">
            Crafting <span className="text-primary font-semibold">Ideas</span> into Digital <span className="text-accent font-semibold">Impact</span>
          </div>
        </FloatingElement>
        
        {/* Dynamic Description */}
        <FloatingElement delay={0.5} amplitude={6}>
          <div className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">
            <MorphingText texts={[
              "Where creativity meets technology",
              "Building tomorrow's digital experiences",
              "Innovating beyond imagination",
              "Transforming visions into reality"
            ]} />
          </div>
        </FloatingElement>
        
        {/* Interactive Buttons */}
        <FloatingElement delay={0.7} amplitude={5}>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.9 } }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Link href="/projects" className="relative flex items-center font-medium">
                Explore Our Work
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.button>
            
            <motion.button
              className="group relative px-8 py-4 border-2 border-purple-500 rounded-full overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 1.1 } }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <Link href="/proposal" className="relative flex items-center font-medium">
                Generate Proposal
                <MoveRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.button>
          </div>
        </FloatingElement>
        
        {/* Floating Orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20 blur-xl"
            style={{
              background: `radial-gradient(circle, hsl(${hue + i * 30}, 80%, 60%), transparent)`,
              width: `${50 + i * 20}px`,
              height: `${50 + i * 20}px`,
              top: `${20 + i * 15}%`,
              left: `${10 + i * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ 
          delay: 1.5,
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <div className="w-8 h-12 rounded-full border-2 border-purple-400 flex justify-center p-1">
          <motion.div
            className="w-2 h-2 bg-purple-400 rounded-full"
            animate={{ y: [0, 20, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}