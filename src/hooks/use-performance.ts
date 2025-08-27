'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface PerformanceOptions {
  enableRAF?: boolean;
  throttleTime?: number;
  enableGPUAcceleration?: boolean;
}

export function usePerformance(options: PerformanceOptions = {}) {
  const {
    enableRAF = true,
    throttleTime = 16,
    enableGPUAcceleration = true
  } = options;

  const [isOptimized, setIsOptimized] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Request animation frame hook for smooth animations
  const useRAF = useCallback((callback: () => void, deps: any[] = []) => {
    useEffect(() => {
      if (!enableRAF) {
        callback();
        return;
      }

      const now = performance.now();
      if (now - lastUpdateRef.current < throttleTime) {
        return;
      }

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        lastUpdateRef.current = performance.now();
        callback();
      });

      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }, deps);
  }, [enableRAF, throttleTime]);

  // GPU acceleration utilities
  const getGPUStyles = useCallback((): React.CSSProperties => {
    if (!enableGPUAcceleration) return {};

    return {
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      perspective: '1000px',
      willChange: 'transform'
    };
  }, [enableGPUAcceleration]);

  // Optimize scrolling performance
  const optimizeScrolling = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Add passive event listeners for better scroll performance
    const passiveSupported = (() => {
      let passiveSupported = false;
      try {
        const options = Object.defineProperty({}, 'passive', {
          get() {
            passiveSupported = true;
            return false;
          }
        });
        window.addEventListener('test', null as any, options);
      } catch (err) {}
      return passiveSupported;
    })();

    const eventOptions = passiveSupported ? { passive: true } : false;

    // Set smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.overscrollBehavior = 'none';

    return () => {
      document.documentElement.style.scrollBehavior = '';
      document.body.style.overscrollBehavior = '';
    };
  }, []);

  // Frame-rate monitoring
  const [fps, setFps] = useState(60);
  const fpsCounterRef = useRef(0);
  const fpsStartTimeRef = useRef(performance.now());

  const measureFPS = useCallback(() => {
    fpsCounterRef.current++;
    const now = performance.now();
    
    if (now - fpsStartTimeRef.current >= 1000) {
      setFps(Math.round((fpsCounterRef.current * 1000) / (now - fpsStartTimeRef.current)));
      fpsCounterRef.current = 0;
      fpsStartTimeRef.current = now;
    }

    requestAnimationFrame(measureFPS);
  }, []);

  // Initialize performance optimizations
  useEffect(() => {
    const cleanup = optimizeScrolling();
    measureFPS();
    setIsOptimized(true);

    return () => {
      cleanup?.();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [optimizeScrolling, measureFPS]);

  // Throttle function for expensive operations
  const throttle = useCallback((func: Function, limit: number) => {
    let inThrottle: boolean;
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Debounce function for resize events
  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function(this: any, ...args: any[]) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }, []);

  return {
    isOptimized,
    fps,
    useRAF,
    getGPUStyles,
    throttle,
    debounce,
    optimizeScrolling
  };
}

// Utility function for creating smooth transitions
export const smoothTransition = {
  duration: 0.3,
  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  type: "spring" as const,
  stiffness: 300,
  damping: 30
};

// Utility function for buttery smooth easing
export const butterySmooth = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];