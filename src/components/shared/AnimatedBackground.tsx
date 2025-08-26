'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBackgroundProps {
  variant?: 'particles' | 'gradient' | 'waves' | 'geometric';
  preset?: 'simple' | 'enhanced' | 'dynamic' | 'minimal' | 'cosmic';
  className?: string;
  children?: React.ReactNode;
}

export function AnimatedBackground({
  variant = 'particles',
  preset,
  className,
  children
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      hue: number;
      pulseSpeed: number;
      pulsePhase: number;
    }> = [];

    // Initialize particles
    const initParticles = () => {
      particles = [];
      
      // If preset is provided, use preset-specific particle initialization
      if (preset) {
        // Different particle counts for different presets
        let particleCount;
        switch (preset) {
          case 'simple':
            particleCount = 20; // Fewer particles for simple preset
            break;
          case 'enhanced':
            particleCount = 60; // More particles for enhanced preset
            break;
          case 'dynamic':
            particleCount = 50;
            break;
          case 'minimal':
            particleCount = 15; // Very few particles for minimal preset
            break;
          case 'cosmic':
            particleCount = 45;
            break;
          default:
            particleCount = 40;
        }
        
        for (let i = 0; i < particleCount; i++) {
          // Different properties based on preset
          let hue, size, opacity, pulseSpeed;
          switch (preset) {
            case 'simple':
              hue = 0; // White particles for simple preset
              size = Math.random() * 2 + 2; // Larger particles
              opacity = Math.random() * 0.2 + 0.05; // More subtle opacity
              pulseSpeed = Math.random() * 0.005 + 0.001; // Slower pulsing
              break;
            case 'enhanced':
              hue = Math.random() * 60 + 260; // Purple to blue range
              size = Math.random() * 3 + 1;
              opacity = Math.random() * 0.6 + 0.2; // More opaque
              pulseSpeed = Math.random() * 0.03 + 0.01; // Faster pulsing
              break;
            case 'dynamic':
              hue = Math.random() * 40 + 200; // Teal to blue range
              size = Math.random() * 4 + 1;
              opacity = Math.random() * 0.5 + 0.1;
              pulseSpeed = Math.random() * 0.04 + 0.015; // Very dynamic pulsing
              break;
            case 'minimal':
              hue = Math.random() * 20 + 200; // Cool blue range
              size = Math.random() * 1 + 0.5; // Very small particles
              opacity = Math.random() * 0.1 + 0.02; // Very subtle
              pulseSpeed = Math.random() * 0.002 + 0.0005; // Very slow pulsing
              break;
            case 'cosmic':
              hue = Math.random() * 60 + 260; // Purple to blue cosmic range
              size = Math.random() * 2.5 + 1;
              opacity = Math.random() * 0.4 + 0.1;
              pulseSpeed = Math.random() * 0.025 + 0.008; // Cosmic pulsing
              break;
            default:
              hue = Math.random() * 60 + 260;
              size = Math.random() * 3 + 1;
              opacity = Math.random() * 0.5 + 0.1;
              pulseSpeed = Math.random() * 0.02 + 0.005;
          }
          
          particles.push({
            x: Math.random() * canvas.offsetWidth,
            y: Math.random() * canvas.offsetHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size,
            opacity,
            hue,
            // Add pulsing effect
            pulseSpeed,
            pulsePhase: Math.random() * Math.PI * 2
          });
        }
      } else {
        // Fallback to variant-based initialization
        // Different particle counts for different variants
        let particleCount;
        switch (variant) {
          case 'particles':
            particleCount = 50;
            break;
          case 'gradient':
            particleCount = 30;
            break;
          case 'waves':
            particleCount = 40;
            break;
          case 'geometric':
            particleCount = 35;
            break;
          default:
            particleCount = 40;
        }
        
        for (let i = 0; i < particleCount; i++) {
          // Different properties based on variant
          let hue, size, opacity, pulseSpeed;
          switch (variant) {
            case 'particles':
              hue = Math.random() * 60 + 260; // Purple to blue range
              size = Math.random() * 3 + 1;
              opacity = Math.random() * 0.5 + 0.1;
              pulseSpeed = Math.random() * 0.02 + 0.005;
              break;
            case 'gradient':
              hue = Math.random() * 40 + 180; // Blue to teal range
              size = Math.random() * 2 + 0.5;
              opacity = Math.random() * 0.3 + 0.05;
              pulseSpeed = Math.random() * 0.01 + 0.002;
              break;
            case 'waves':
              hue = Math.random() * 40 + 200; // Teal to blue range
              size = Math.random() * 4 + 1;
              opacity = Math.random() * 0.4 + 0.1;
              pulseSpeed = Math.random() * 0.03 + 0.01;
              break;
            case 'geometric':
              hue = Math.random() * 30 + 240; // Blue to indigo range
              size = Math.random() * 2.5 + 0.8;
              opacity = Math.random() * 0.6 + 0.15;
              pulseSpeed = Math.random() * 0.015 + 0.003;
              break;
            default:
              hue = Math.random() * 60 + 260;
              size = Math.random() * 3 + 1;
              opacity = Math.random() * 0.5 + 0.1;
              pulseSpeed = Math.random() * 0.02 + 0.005;
          }
          
          particles.push({
            x: Math.random() * canvas.offsetWidth,
            y: Math.random() * canvas.offsetHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size,
            opacity,
            hue,
            // Add pulsing effect
            pulseSpeed,
            pulsePhase: Math.random() * Math.PI * 2
          });
        }
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      particles.forEach((particle, index) => {
        // Update position with different movement patterns based on variant
        switch (variant) {
          case 'particles':
            particle.x += particle.vx;
            particle.y += particle.vy;
            break;
          case 'gradient':
            // Slower, more fluid movement
            particle.x += particle.vx * 0.7;
            particle.y += particle.vy * 0.7;
            break;
          case 'waves':
            // Wave-like movement
            particle.x += particle.vx * 1.2;
            particle.y += Math.sin(timeRef.current * 0.5 + particle.x * 0.01) * 0.8;
            break;
          case 'geometric':
            // More structured movement
            particle.x += particle.vx * 0.9;
            particle.y += particle.vy * 0.9;
            break;
          default:
            particle.x += particle.vx;
            particle.y += particle.vy;
        }
        
        // Update pulsing effect with variant-specific patterns
        let pulseSpeed;
        switch (variant) {
          case 'particles':
            pulseSpeed = particle.pulseSpeed;
            break;
          case 'gradient':
            pulseSpeed = particle.pulseSpeed * 0.7;
            break;
          case 'waves':
            pulseSpeed = particle.pulseSpeed * 1.3;
            break;
          case 'geometric':
            pulseSpeed = particle.pulseSpeed * 0.9;
            break;
          default:
            pulseSpeed = particle.pulseSpeed;
        }
        
        particle.pulsePhase += pulseSpeed;
        const pulseSize = Math.sin(particle.pulsePhase) * 0.5 + 1;
        const currentSize = particle.size * pulseSize;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.offsetWidth;
        if (particle.x > canvas.offsetWidth) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.offsetHeight;
        if (particle.y > canvas.offsetHeight) particle.y = 0;
        
        // Draw particle with glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
        
        // Create radial gradient for glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, currentSize * 2
        );
        gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 70%, ${particle.opacity * 0.8})`);
        gradient.addColorStop(0.5, `hsla(${particle.hue}, 70%, 60%, ${particle.opacity * 0.4})`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 60%, 50%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw connections with varying opacity
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            
            // Calculate connection opacity based on distance and particle opacities
            const connectionOpacity = 0.15 * (1 - distance / 120) *
              ((particle.opacity + otherParticle.opacity) / 2);
              
            ctx.strokeStyle = `hsla(${(particle.hue + otherParticle.hue) / 2}, 70%, 60%, ${connectionOpacity})`;
            ctx.lineWidth = 0.8 * (1 - distance / 120);
            ctx.stroke();
          }
        });
      });
    };

    const drawGradient = () => {
      const time = timeRef.current;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // Create layered animated gradients with different colors for this variant
      const centerX = canvas.offsetWidth / 2;
      const centerY = canvas.offsetHeight / 2;
      const radius = Math.max(canvas.offsetWidth, canvas.offsetHeight) / 2;
      
      // Primary radial gradient with teal/cyan colors
      const primaryGradient = ctx.createRadialGradient(
        centerX + Math.sin(time * 0.5) * 60,
        centerY + Math.cos(time * 0.3) * 60,
        0,
        centerX,
        centerY,
        radius
      );
      
      primaryGradient.addColorStop(0, `hsla(${180 + Math.sin(time * 0.8) * 10}, 85%, 70%, 0.2)`);
      primaryGradient.addColorStop(0.3, `hsla(${170 + Math.cos(time * 0.6) * 15}, 80%, 60%, 0.12)`);
      primaryGradient.addColorStop(0.6, `hsla(${160 + Math.sin(time * 0.4) * 12}, 75%, 50%, 0.06)`);
      primaryGradient.addColorStop(1, 'hsla(150, 70%, 40%, 0.02)');
      
      ctx.fillStyle = primaryGradient;
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // Secondary overlay with different movement patterns
      const secondaryGradient = ctx.createRadialGradient(
        centerX + Math.sin(time * 0.9) * 100,
        centerY + Math.cos(time * 0.7) * 100,
        0,
        centerX,
        centerY,
        radius * 1.2
      );
      
      secondaryGradient.addColorStop(0, `hsla(${190 + Math.cos(time * 0.5) * 8}, 90%, 75%, 0.1)`);
      secondaryGradient.addColorStop(0.4, `hsla(${180 + Math.sin(time * 0.7) * 12}, 85%, 65%, 0.07)`);
      secondaryGradient.addColorStop(0.8, `hsla(${170 + Math.cos(time * 0.3) * 10}, 80%, 55%, 0.04)`);
      secondaryGradient.addColorStop(1, 'hsla(160, 75%, 45%, 0)');
      
      ctx.fillStyle = secondaryGradient;
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      ctx.globalCompositeOperation = 'source-over';
    };

    const drawWaves = () => {
      const time = timeRef.current;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // Draw multiple wave layers with enhanced effects and different colors
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.offsetHeight / 2);
        
        // Create more complex wave patterns with variant-specific parameters
        for (let x = 0; x <= canvas.offsetWidth; x += 6) {
          const y = canvas.offsetHeight / 2 +
            Math.sin((x * 0.012) + (time * 0.002 * (1.2 + i * 0.3))) * (30 + i * 12) +
            Math.sin((x * 0.018) + (time * 0.002 * 1.6)) * (25 + i * 8) +
            Math.sin((x * 0.025) + (time * 0.002 * 2.4)) * (15 + i * 4);
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(canvas.offsetWidth, canvas.offsetHeight);
        ctx.lineTo(0, canvas.offsetHeight);
        ctx.closePath();
        
        // Create more vibrant gradients with teal/blue colors for this variant
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.offsetHeight);
        const hue = 180 + i * 8; // Teal to blue range
        gradient.addColorStop(0, `hsla(${hue}, 85%, 70%, 0.05)`);
        gradient.addColorStop(0.2, `hsla(${hue + 5}, 80%, 65%, 0.08)`);
        gradient.addColorStop(0.5, `hsla(${hue + 10}, 75%, 60%, 0.11)`);
        gradient.addColorStop(0.8, `hsla(${hue + 15}, 70%, 55%, 0.14)`);
        gradient.addColorStop(1, `hsla(${hue + 20}, 65%, 50%, 0.16)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add more prominent particle effects on waves
        for (let j = 0; j < 7; j++) {
          const waveX = (canvas.offsetWidth / 7) * j + Math.sin(time * 0.002 * 0.7 + j) * 25;
          const waveY = canvas.offsetHeight / 2 +
            Math.sin((waveX * 0.012) + (time * 0.002 * (1.2 + i * 0.3))) * (30 + i * 12) +
            Math.sin((waveX * 0.018) + (time * 0.002 * 1.6)) * (25 + i * 8);
              
          ctx.beginPath();
          ctx.arc(waveX, waveY, 3 + i * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue + 10}, 90%, 75%, 0.4)`;
          ctx.fill();
        }
      }
    };

    const drawGeometric = () => {
      const time = timeRef.current;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // Draw rotating geometric shapes with enhanced effects and variant-specific parameters
      for (let i = 0; i < 15; i++) {
        const x = (canvas.offsetWidth / 3) * (1 + Math.cos(time * 0.4 + i * 0.4));
        const y = (canvas.offsetHeight / 3) * (1 + Math.sin(time * 0.2 + i * 0.3));
        const size = 12 + Math.sin(time * 1.2 + i) * 6;
        const rotation = time * 0.3 + i * 0.4;
        const sides = 3 + (i % 5); // Varying polygon sides (3-7 sides)
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // Draw polygon with gradient stroke and variant-specific colors
        ctx.beginPath();
        for (let j = 0; j < sides; j++) {
          const angle = (j / sides) * Math.PI * 2;
          const px = Math.cos(angle) * size;
          const py = Math.sin(angle) * size;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        
        // Create gradient for stroke with indigo/purple colors for this variant
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.5);
        const hue = 240 + i * 6; // Indigo to purple range
        gradient.addColorStop(0, `hsla(${hue}, 85%, 75%, 0.25)`);
        gradient.addColorStop(0.4, `hsla(${hue + 10}, 80%, 70%, 0.18)`);
        gradient.addColorStop(0.7, `hsla(${hue + 20}, 75%, 65%, 0.12)`);
        gradient.addColorStop(1, `hsla(${hue + 30}, 70%, 60%, 0.06)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add inner glow effect with different parameters
        if (i % 2 === 0) {
          ctx.beginPath();
          for (let j = 0; j < sides; j++) {
            const angle = (j / sides) * Math.PI * 2;
            const px = Math.cos(angle) * (size * 0.7);
            const py = Math.sin(angle) * (size * 0.7);
            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          
          ctx.fillStyle = `hsla(${hue + 15}, 90%, 80%, 0.15)`;
          ctx.fill();
        }
        
        ctx.restore();
      }
      
      // Add connecting lines between nearby shapes with different parameters
      for (let i = 0; i < 15; i++) {
        const x1 = (canvas.offsetWidth / 3) * (1 + Math.cos(time * 0.4 + i * 0.4));
        const y1 = (canvas.offsetHeight / 3) * (1 + Math.sin(time * 0.2 + i * 0.3));
        
        for (let j = i + 1; j < 15; j++) {
          const x2 = (canvas.offsetWidth / 3) * (1 + Math.cos(time * 0.4 + j * 0.4));
          const y2 = (canvas.offsetHeight / 3) * (1 + Math.sin(time * 0.2 + j * 0.3));
          
          const dx = x1 - x2;
          const dy = y1 - y2;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only draw connections for nearby shapes with different distance threshold
          if (distance < 180) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            
            const hue = 250 + ((i + j) % 8) * 8;
            const opacity = 0.15 * (1 - distance / 180);
            
            ctx.strokeStyle = `hsla(${hue}, 75%, 65%, ${opacity})`;
            ctx.lineWidth = 0.7 * (1 - distance / 180);
            ctx.stroke();
          }
        }
      }
    };

    // Preset-specific animation functions
    const drawParticlesSimple = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // Fewer, larger particles with subtle movement
      particles.forEach((particle) => {
        // Slow, floating movement
        particle.x += particle.vx * 0.3;
        particle.y += particle.vy * 0.3;
        
        // Gentle pulsing
        particle.pulsePhase += particle.pulseSpeed * 0.5;
        const pulseSize = Math.sin(particle.pulsePhase) * 0.2 + 1;
        const currentSize = particle.size * pulseSize;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.offsetWidth;
        if (particle.x > canvas.offsetWidth) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.offsetHeight;
        if (particle.y > canvas.offsetHeight) particle.y = 0;
        
        // Draw simple particles with soft glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
        
        // Soft white glow for simple preset
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, currentSize * 3
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity * 0.6})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${particle.opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
      });
    };

    const drawParticlesEnhanced = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // More particles with stronger connections
      particles.forEach((particle, index) => {
        // Standard particle movement
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Enhanced pulsing
        particle.pulsePhase += particle.pulseSpeed * 1.2;
        const pulseSize = Math.sin(particle.pulsePhase) * 0.8 + 1;
        const currentSize = particle.size * pulseSize;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.offsetWidth;
        if (particle.x > canvas.offsetWidth) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.offsetHeight;
        if (particle.y > canvas.offsetHeight) particle.y = 0;
        
        // Draw particle with glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
        
        // Create radial gradient for glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, currentSize * 2
        );
        gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 70%, ${particle.opacity * 0.8})`);
        gradient.addColorStop(0.5, `hsla(${particle.hue}, 70%, 60%, ${particle.opacity * 0.4})`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 60%, 50%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw enhanced connections with higher opacity
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Closer connection distance for enhanced preset
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            
            // Higher opacity connections
            const connectionOpacity = 0.25 * (1 - distance / 150) *
              ((particle.opacity + otherParticle.opacity) / 2);
              
            ctx.strokeStyle = `hsla(${(particle.hue + otherParticle.hue) / 2}, 70%, 60%, ${connectionOpacity})`;
            ctx.lineWidth = 1.2 * (1 - distance / 150);
            ctx.stroke();
          }
        });
      });
    };

    const drawWavesDynamic = () => {
      const time = timeRef.current;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // More dynamic waves with faster movement and brighter colors
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.offsetHeight / 2);
        
        // Faster, more complex wave patterns
        for (let x = 0; x <= canvas.offsetWidth; x += 4) {
          const y = canvas.offsetHeight / 2 +
            Math.sin((x * 0.015) + (time * 0.003 * (1.5 + i * 0.4))) * (35 + i * 15) +
            Math.sin((x * 0.025) + (time * 0.003 * 2.0)) * (30 + i * 10) +
            Math.sin((x * 0.04) + (time * 0.003 * 3.0)) * (20 + i * 5);
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(canvas.offsetWidth, canvas.offsetHeight);
        ctx.lineTo(0, canvas.offsetHeight);
        ctx.closePath();
        
        // Vibrant gradients with higher opacity for dynamic preset
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.offsetHeight);
        const hue = 200 + i * 12; // Blue to purple range
        gradient.addColorStop(0, `hsla(${hue}, 90%, 75%, 0.1)`);
        gradient.addColorStop(0.3, `hsla(${hue + 10}, 85%, 70%, 0.15)`);
        gradient.addColorStop(0.6, `hsla(${hue + 20}, 80%, 65%, 0.2)`);
        gradient.addColorStop(1, `hsla(${hue + 30}, 75%, 60%, 0.25)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // More prominent particle effects on waves
        for (let j = 0; j < 9; j++) {
          const waveX = (canvas.offsetWidth / 9) * j + Math.sin(time * 0.003 * 1.0 + j) * 30;
          const waveY = canvas.offsetHeight / 2 +
            Math.sin((waveX * 0.015) + (time * 0.003 * (1.5 + i * 0.4))) * (35 + i * 15) +
            Math.sin((waveX * 0.025) + (time * 0.003 * 2.0)) * (30 + i * 10);
              
          ctx.beginPath();
          ctx.arc(waveX, waveY, 4 + i * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue + 15}, 95%, 80%, 0.6)`;
          ctx.fill();
        }
      }
    };

    const drawGradientMinimal = () => {
      const time = timeRef.current;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // Very subtle gradient shifts for minimal preset
      const centerX = canvas.offsetWidth / 2;
      const centerY = canvas.offsetHeight / 2;
      const radius = Math.max(canvas.offsetWidth, canvas.offsetHeight) / 2;
      
      // Gentle radial gradient with minimal movement
      const primaryGradient = ctx.createRadialGradient(
        centerX + Math.sin(time * 0.2) * 20,
        centerY + Math.cos(time * 0.15) * 20,
        0,
        centerX,
        centerY,
        radius
      );
      
      primaryGradient.addColorStop(0, `hsla(220, 30%, 90%, 0.05)`);
      primaryGradient.addColorStop(0.5, `hsla(210, 25%, 85%, 0.03)`);
      primaryGradient.addColorStop(1, `hsla(200, 20%, 80%, 0.01)`);
      
      ctx.fillStyle = primaryGradient;
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // Secondary subtle overlay
      const secondaryGradient = ctx.createRadialGradient(
        centerX + Math.sin(time * 0.1) * 30,
        centerY + Math.cos(time * 0.08) * 30,
        0,
        centerX,
        centerY,
        radius * 1.2
      );
      
      secondaryGradient.addColorStop(0, `hsla(230, 35%, 95%, 0.03)`);
      secondaryGradient.addColorStop(0.7, `hsla(220, 30%, 90%, 0.02)`);
      secondaryGradient.addColorStop(1, `hsla(210, 25%, 85%, 0)`);
      
      ctx.fillStyle = secondaryGradient;
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      ctx.globalCompositeOperation = 'source-over';
    };

    const drawGeometricCosmic = () => {
      const time = timeRef.current;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // Cosmic geometric shapes with star-like effects
      for (let i = 0; i < 20; i++) {
        const x = (canvas.offsetWidth / 4) * (1 + Math.cos(time * 0.002 * 0.6 + i * 0.5));
        const y = (canvas.offsetHeight / 4) * (1 + Math.sin(time * 0.002 * 0.4 + i * 0.3));
        const size = 8 + Math.sin(time * 0.002 * 1.5 + i) * 5;
        const rotation = time * 0.002 * 0.4 + i * 0.5;
        const sides = 4 + (i % 5); // Varying polygon sides (4-8 sides)
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // Draw polygon with cosmic colors
        ctx.beginPath();
        for (let j = 0; j < sides; j++) {
          const angle = (j / sides) * Math.PI * 2;
          const px = Math.cos(angle) * size;
          const py = Math.sin(angle) * size;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        
        // Create gradient for stroke with cosmic colors
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.5);
        const hue = 260 + i * 3; // Purple to blue range for cosmic effect
        gradient.addColorStop(0, `hsla(${hue}, 90%, 80%, 0.3)`);
        gradient.addColorStop(0.5, `hsla(${hue + 15}, 85%, 75%, 0.2)`);
        gradient.addColorStop(1, `hsla(${hue + 30}, 80%, 70%, 0.1)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Add inner glow effect
        if (i % 4 === 0) {
          ctx.beginPath();
          for (let j = 0; j < sides; j++) {
            const angle = (j / sides) * Math.PI * 2;
            const px = Math.cos(angle) * (size * 0.6);
            const py = Math.sin(angle) * (size * 0.6);
            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          
          ctx.fillStyle = `hsla(${hue + 10}, 95%, 85%, 0.2)`;
          ctx.fill();
        }
        
        ctx.restore();
      }
      
      // Add star-like twinkling effects
      for (let i = 0; i < 30; i++) {
        const x = (canvas.offsetWidth / 6) * (1 + Math.cos(time * 0.002 * 0.8 + i * 0.7));
        const y = (canvas.offsetHeight / 6) * (1 + Math.sin(time * 0.002 * 0.6 + i * 0.4));
        
        // Twinkling effect
        const twinkle = Math.sin(time * 0.002 * 2 + i) * 0.5 + 0.5;
        const size = 1 + twinkle * 2;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(270, 100%, 90%, ${0.4 * twinkle})`;
        ctx.fill();
      }
      
      // Add connecting lines between nearby shapes
      for (let i = 0; i < 20; i++) {
        const x1 = (canvas.offsetWidth / 4) * (1 + Math.cos(time * 0.002 * 0.6 + i * 0.5));
        const y1 = (canvas.offsetHeight / 4) * (1 + Math.sin(time * 0.002 * 0.4 + i * 0.3));
        
        for (let j = i + 1; j < 20; j++) {
          const x2 = (canvas.offsetWidth / 4) * (1 + Math.cos(time * 0.002 * 0.6 + j * 0.5));
          const y2 = (canvas.offsetHeight / 4) * (1 + Math.sin(time * 0.002 * 0.4 + j * 0.3));
          
          const dx = x1 - x2;
          const dy = y1 - y2;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only draw connections for nearby shapes
          if (distance < 200) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            
            const hue = 270 + ((i + j) % 6) * 5;
            const opacity = 0.1 * (1 - distance / 200);
            
            ctx.strokeStyle = `hsla(${hue}, 80%, 70%, ${opacity})`;
            ctx.lineWidth = 0.4 * (1 - distance / 200);
            ctx.stroke();
          }
        }
      }
    };

    
        const animate = () => {
          timeRef.current = Date.now() * 0.001; // Update time reference
          
          // If preset is provided, use preset-specific animations
          if (preset) {
            switch (preset) {
              case 'simple':
                // Minimal particles for simple preset
                drawParticlesSimple();
                break;
              case 'enhanced':
                // Enhanced particles with more connections
                drawParticlesEnhanced();
                break;
              case 'dynamic':
                // Dynamic waves with more movement
                drawWavesDynamic();
                break;
              case 'minimal':
                // Subtle gradient shifts
                drawGradientMinimal();
                break;
              case 'cosmic':
                // Cosmic geometric patterns
                drawGeometricCosmic();
                break;
              default:
                drawParticles();
            }
          } else {
            // Fallback to variant-based animations
            switch (variant) {
              case 'particles':
                drawParticles();
                break;
              case 'gradient':
                drawGradient();
                break;
              case 'waves':
                drawWaves();
                break;
              case 'geometric':
                drawGeometric();
                break;
            }
          }
          
          animationRef.current = requestAnimationFrame(animate);
        };
    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [variant, preset]);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.6 }}
      />
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}