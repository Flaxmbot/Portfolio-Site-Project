'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface QuantumBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export function QuantumBackground({ className, children }: QuantumBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState(0);
  const animationFrameIdRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
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
      const threadCount = Math.min(70, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 7000));
      
      for (let i = 0; i < threadCount; i++) {
        threads.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          length: Math.random() * 100 + 50,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.5 + 0.1,
          color: ['cyan', 'magenta', 'gold'][Math.floor(Math.random() * 3)],
          width: Math.random() * 2 + 1,
          pulseOffset: Math.random() * Math.PI * 2
        });
      }
    };
    
    initThreads();
    
    // Draw quantum threads
    const drawThreads = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // Draw subtle gradient background
      const gradient = ctx.createRadialGradient(
        canvas.offsetWidth / 2,
        canvas.offsetHeight / 2,
        0,
        canvas.offsetWidth / 2,
        canvas.offsetHeight / 2,
        Math.max(canvas.offsetWidth, canvas.offsetHeight) / 2
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // Draw threads
      threads.forEach(thread => {
        // Update position
        thread.x += Math.cos(thread.angle) * thread.speed;
        thread.y += Math.sin(thread.angle) * thread.speed;
        
        // Add gravity effect
        thread.angle += Math.sin(time * 0.5 + thread.pulseOffset) * 0.02;
        
        // Wrap around edges
        if (thread.x < -thread.length) thread.x = canvas.offsetWidth + thread.length;
        if (thread.x > canvas.offsetWidth + thread.length) thread.x = -thread.length;
        if (thread.y < -thread.length) thread.y = canvas.offsetHeight + thread.length;
        if (thread.y > canvas.offsetHeight + thread.length) thread.y = -thread.length;
        
        // Calculate end point
        const endX = thread.x + Math.cos(thread.angle) * thread.length;
        const endY = thread.y + Math.sin(thread.angle) * thread.length;
        
        // Create gradient for thread
        const threadGradient = ctx.createLinearGradient(thread.x, thread.y, endX, endY);
        
        // Set colors based on thread type
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
        
        // Draw glow
        ctx.shadowColor = thread.color === 'cyan' ? 'cyan' : thread.color === 'magenta' ? 'magenta' : 'gold';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
      
      // Draw quantum nodes
      threads.forEach(thread => {
        // Draw node at start
        const pulse = Math.sin(time * 2 + thread.pulseOffset) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(thread.x, thread.y, 2 + pulse * 3, 0, Math.PI * 2);
        ctx.fillStyle = thread.color === 'cyan' ? 'rgba(0, 255, 255, 0.8)' : 
                        thread.color === 'magenta' ? 'rgba(255, 0, 255, 0.8)' : 
                        'rgba(255, 215, 0, 0.8)';
        ctx.fill();
        
        // Draw glow for node
        ctx.shadowColor = thread.color === 'cyan' ? 'cyan' : thread.color === 'magenta' ? 'magenta' : 'gold';
        ctx.shadowBlur = 10 + pulse * 10;
        ctx.fill();
        ctx.shadowBlur = 0;
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
  }, []);
  
  return (
    <div className={`relative overflow-hidden ${className || ''}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}