'use client';

import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { usePerformance } from '@/hooks/use-performance';

interface SmoothScrollContextType {
  scrollTo: (target: string | number, options?: ScrollOptions) => void;
  isScrolling: boolean;
}

interface ScrollOptions {
  duration?: number;
  easing?: string;
  offset?: number;
}

const SmoothScrollContext = createContext<SmoothScrollContextType | undefined>(undefined);

interface SmoothScrollProviderProps {
  children: ReactNode;
  enabled?: boolean;
}

export function SmoothScrollProvider({ children, enabled = true }: SmoothScrollProviderProps) {
  const { throttle, debounce } = usePerformance();
  const isScrollingRef = useRef(false);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Enhanced smooth scrolling
    const smoothScrollTo = (target: Element | number, options: ScrollOptions = {}) => {
      const {
        duration = 800,
        easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        offset = 0
      } = options;

      let targetPosition: number;

      if (typeof target === 'number') {
        targetPosition = target;
      } else {
        const rect = target.getBoundingClientRect();
        targetPosition = window.pageYOffset + rect.top - offset;
      }

      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      let startTime: number | null = null;

      isScrollingRef.current = true;

      function animation(currentTime: number) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // Easing function (cubic bezier approximation)
        const ease = (t: number) => {
          return t * t * (3 - 2 * t); // Smooth step function
        };

        const easedProgress = ease(progress);
        window.scrollTo(0, startPosition + distance * easedProgress);

        if (progress < 1) {
          requestAnimationFrame(animation);
        } else {
          isScrollingRef.current = false;
        }
      }

      requestAnimationFrame(animation);
    };

    // Optimize scroll event handling
    const optimizedScrollHandler = throttle(() => {
      // Handle scroll events with throttling for better performance
      document.body.style.transform = `translateZ(0)`; // Force hardware acceleration
    }, 16);

    const optimizedResizeHandler = debounce(() => {
      // Handle resize events
      window.dispatchEvent(new Event('optimizedResize'));
    }, 250);

    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    window.addEventListener('resize', optimizedResizeHandler, { passive: true });

    // Set up smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      window.removeEventListener('scroll', optimizedScrollHandler as EventListener);
      window.removeEventListener('resize', optimizedResizeHandler as EventListener);
      document.documentElement.style.scrollBehavior = '';
    };
  }, [enabled, throttle, debounce]);

  const scrollTo = (target: string | number, options?: ScrollOptions) => {
    if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    } else {
      window.scrollTo({
        top: target,
        behavior: 'smooth'
      });
    }
  };

  const contextValue = {
    scrollTo,
    isScrolling: isScrollingRef.current
  };

  return (
    <SmoothScrollContext.Provider value={contextValue}>
      <div className="scroll-smooth hw-accelerated">
        {children}
      </div>
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  const context = useContext(SmoothScrollContext);
  if (!context) {
    throw new Error('useSmoothScroll must be used within a SmoothScrollProvider');
  }
  return context;
}