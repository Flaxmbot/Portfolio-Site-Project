'use client';

import React, { useRef, useEffect, useState } from 'react';
import { usePreset } from '@/hooks/use-preset';

interface FullPageQuantumBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export function FullPageQuantumBackground({ className, children }: FullPageQuantumBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState(0);
  const animationFrameIdRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const { preset } = usePreset();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create quantum threads
    const threads: Array<{
      x: number;
      y: number;
      length: number;
      angle: number;
      speed: number;
      color: string;
      width: number;
      pulseOffset: number;
    }> = [];
    
    // Initialize threads
    const initThreads = () => {
      threads.length = 0;
      // Adjust thread count based on preset and device performance
      let threadCount;
      if (preset === 'cosmic') {
        threadCount = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 7000)); // Reduced from 100
      } else {
        threadCount = Math.min(50, Math.floor((window.innerWidth * window.innerHeight) / 10000)); // Reduced from 70
      }
      
      for (let i = 0; i < threadCount; i++) {
        // Adjust colors based on preset
        let color;
        if (preset === 'cosmic') {
          color = ['cyan', 'magenta', 'purple'][Math.floor(Math.random() * 3)];
        } else {
          color = ['cyan', 'magenta', 'gold'][Math.floor(Math.random() * 3)];
        }
        
        threads.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          length: Math.random() * 100 + 50,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.5 + 0.1,
          color,
          width: Math.random() * 2 + 1,
          pulseOffset: Math.random() * Math.PI * 2
        });
      }
    };
    
    initThreads();
    
    // Draw quantum threads
    const drawThreads = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Draw subtle gradient background
      const gradient = ctx.createRadialGradient(
        window.innerWidth / 2,
        window.innerHeight / 2,
        0,
        window.innerWidth / 2,
        window.innerHeight / 2,
        Math.max(window.innerWidth, window.innerHeight) / 2
      );
      
      // Adjust background based on preset
      if (preset === 'cosmic') {
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
      } else {
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Draw threads
      threads.forEach(thread => {
        // Update position
        thread.x += Math.cos(thread.angle) * thread.speed;
        thread.y += Math.sin(thread.angle) * thread.speed;
        
        // Add gravity effect
        thread.angle += Math.sin(time * 0.5 + thread.pulseOffset) * 0.02;
        
        // Wrap around edges
        if (thread.x < -thread.length) thread.x = window.innerWidth + thread.length;
        if (thread.x > window.innerWidth + thread.length) thread.x = -thread.length;
        if (thread.y < -thread.length) thread.y = window.innerHeight + thread.length;
        if (thread.y > window.innerHeight + thread.length) thread.y = -thread.length;
        
        // Calculate end point
        const endX = thread.x + Math.cos(thread.angle) * thread.length;
        const endY = thread.y + Math.sin(thread.angle) * thread.length;
        
        // Create gradient for thread
        const threadGradient = ctx.createLinearGradient(thread.x, thread.y, endX, endY);
        
        // Set colors based on thread type and preset
        let startColor, endColor;
        switch (thread.color) {
          case 'cyan':
            startColor = `rgba(0, 255, 255, ${0.3 + Math.sin(time + thread.pulseOffset) * 0.2})`;
            endColor = `rgba(0, 100, 255, ${0.1 + Math.sin(time + thread.pulseOffset + Math.PI) * 0.1})`;
            break;
          case 'magenta':
            startColor = `rgba(255, 0, 255, ${0.3 + Math.sin(time + thread.pulseOffset) * 0.2})`;
            endColor = `rgba(255, 0, 100, ${0.1 + Math.sin(time + thread.pulseOffset + Math.PI) * 0.1})`;
            break;
          case 'gold':
            startColor = `rgba(255, 215, 0, ${0.3 + Math.sin(time + thread.pulseOffset) * 0.2})`;
            endColor = `rgba(255, 165, 0, ${0.1 + Math.sin(time + thread.pulseOffset + Math.PI) * 0.1})`;
            break;
          case 'purple':
            startColor = `rgba(128, 0, 128, ${0.3 + Math.sin(time + thread.pulseOffset) * 0.2})`;
            endColor = `rgba(75, 0, 130, ${0.1 + Math.sin(time + thread.pulseOffset + Math.PI) * 0.1})`;
            break;
          default:
            startColor = `rgba(0, 255, 255, ${0.3 + Math.sin(time + thread.pulseOffset) * 0.2})`;
            endColor = `rgba(0, 100, 255, ${0.1 + Math.sin(time + thread.pulseOffset + Math.PI) * 0.1})`;
        }
        
        threadGradient.addColorStop(0, startColor);
        threadGradient.addColorStop(0.5, startColor.replace(/\d+(\.\d+)?\)/, '0.5)'));
        threadGradient.addColorStop(1, endColor);
        
        // Draw thread
        ctx.beginPath();
        ctx.moveTo(thread.x, thread.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = threadGradient;
        ctx.lineWidth = thread.width;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Simplified glow effect for better performance
        // Removed duplicate stroke with shadow for performance
      });
      
      // Draw quantum nodes
      threads.forEach(thread => {
        // Draw node at start
        const pulse = Math.sin(time * 2 + thread.pulseOffset) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(thread.x, thread.y, 2 + pulse * 3, 0, Math.PI * 2);
        
        // Adjust node colors based on preset
        let nodeColor;
        if (thread.color === 'cyan') {
          nodeColor = 'rgba(0, 255, 255, 0.8)';
        } else if (thread.color === 'magenta') {
          nodeColor = 'rgba(255, 0, 255, 0.8)';
        } else if (thread.color === 'gold') {
          nodeColor = 'rgba(255, 215, 0, 0.8)';
        } else {
          nodeColor = 'rgba(128, 0, 128, 0.8)';
        }
        
        ctx.fillStyle = nodeColor;
        ctx.fill();
        
        // Simplified glow effect for node for better performance
        // Removed shadow effects for performance
      });
    };
    
    // Animation loop with frame rate limiting
    const animate = (timestamp: number) => {
      // Limit to ~30fps to reduce CPU usage
      if (timestamp - lastFrameTimeRef.current < 30) {
        animationFrameIdRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastFrameTimeRef.current = timestamp;
      setTime(prev => prev + 0.01);
      drawThreads();
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [preset]); // Reinitialize when preset changes
  
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className || ''}`} style={{ zIndex: -1 }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}