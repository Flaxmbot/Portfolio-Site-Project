"use client";

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedHeadingProps {
  children: ReactNode;
  variant?: 'geometric' | 'simple' | 'waves';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  backgroundClassName?: string;
  className?: string;
}

export function AnimatedHeading({ 
  children, 
  variant = 'simple', 
  size = 'md',
  backgroundClassName = '',
  className = ''
}: AnimatedHeadingProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  };

  const baseClasses = cn(
    'font-bold text-foreground',
    sizeClasses[size],
    className
  );

  if (variant === 'geometric') {
    return (
      <div className={backgroundClassName}>
        <h1 className={cn(
          baseClasses,
          'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'
        )}>
          {children}
        </h1>
      </div>
    );
  }

  return (
    <h1 className={baseClasses}>
      {children}
    </h1>
  );
}