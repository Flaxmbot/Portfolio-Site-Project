'use client';

import Link from "next/link";
import { ArrowRight, MoveRight } from "lucide-react";
import { usePreset } from "@/hooks/use-preset";
import { AnimatedHeading } from "../shared/AnimatedHeading";
import { MagneticButton } from "../shared/MagneticButton";
import { EnhancedHero } from "./EnhancedHero";
import { QuantumBackground } from "../shared/QuantumBackground";
import { QuantumButton } from "../shared/QuantumButton";
import { QuantumText } from "../shared/QuantumText";
import Spline from '@splinetool/react-spline';
import { useState, useCallback } from 'react';

export function SimpleHero() {
  const { isEnhanced, isDynamic, preset } = usePreset();
  const [splineLoaded, setSplineLoaded] = useState(false);

  const handleSplineLoad = useCallback(() => {
    setSplineLoaded(true);
  }, []);

  if (preset === 'quantum') {
    return (
      <section className="relative text-center py-28 md:py-40 min-h-[80vh] flex flex-col justify-center items-center">
        <div className="absolute inset-0 z-0 pointer-events-none spline-container">
          <div className="w-full h-full transform-gpu will-change-transform">
            <Spline
              scene="https://prod.spline.design/7x5pKpanGcLAntaR/scene.splinecode"
              className="w-full h-full"
              onLoad={handleSplineLoad}
              style={{ 
                pointerEvents: 'none',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                perspective: '1000px'
              }}
            />
          </div>
        </div>
        <div className="container mx-auto px-4 z-10 relative">
          <div className="mb-6">
            <QuantumText variant="heading">
              Aether Portfolio
            </QuantumText>
          </div>
          <QuantumText variant="subheading" className="mt-6 max-w-3xl mx-auto">
            Crafting <span className="text-cyan-400 font-semibold">Ideas</span> into Digital <span className="text-magenta-400 font-semibold">Impact</span>
          </QuantumText>
          <div className="mt-12 flex flex-row items-center justify-center gap-4">
            <QuantumButton href="/projects" variant="primary">
              Explore Our Work
              <ArrowRight className="ml-2 h-5 w-5" />
            </QuantumButton>
            <QuantumButton href="/proposal" variant="outline">
              Generate Proposal
              <MoveRight className="ml-2 h-5 w-5" />
            </QuantumButton>
          </div>
        </div>
      </section>
    );
  }

  if (preset === 'cosmic') {
    return (
      <section className="relative text-center py-28 md:py-40 min-h-[80vh] flex flex-col justify-center items-center">
        <div className="absolute inset-0 z-0 pointer-events-none spline-container">
          <div className="w-full h-full transform-gpu will-change-transform">
            <Spline
              scene="https://prod.spline.design/7x5pKpanGcLAntaR/scene.splinecode"
              className="w-full h-full"
              onLoad={handleSplineLoad}
              style={{ 
                pointerEvents: 'none',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                perspective: '1000px'
              }}
            />
          </div>
        </div>
        <div className="container mx-auto px-4 z-10 relative">
          <div className="mb-6">
            <h1 className="text-5xl md:text-7xl font-headline font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Aether Portfolio
            </h1>
          </div>
          <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto text-muted-foreground">
            Crafting <span className="text-indigo-400 font-semibold">Ideas</span> into Digital <span className="text-purple-400 font-semibold">Impact</span>
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton asChild className="group">
              <Link href="/projects">
                Explore Our Work
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
            <MagneticButton asChild className="group border border-input bg-background hover:bg-accent hover:text-accent-foreground">
              <Link href="/proposal">
                Generate Proposal
                <MoveRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
          </div>
        </div>
      </section>
    );
  }

  if (isEnhanced) {
    return (
      <section className="relative text-center py-28 md:py-40 min-h-[80vh] flex flex-col justify-center items-center">
        <div className="absolute inset-0 z-0 pointer-events-none spline-container">
          <div className="w-full h-full transform-gpu will-change-transform">
            <Spline
              scene="https://prod.spline.design/7x5pKpanGcLAntaR/scene.splinecode"
              className="w-full h-full"
              onLoad={handleSplineLoad}
              style={{ 
                pointerEvents: 'none',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                perspective: '1000px'
              }}
            />
          </div>
        </div>
        <div className="container mx-auto px-4 z-10 relative">
          <div className="mb-6">
            <AnimatedHeading
              variant={isDynamic ? "simple" : "geometric"}
              size="xl"
              backgroundClassName="rounded-2xl"
            >
              Aether Portfolio
            </AnimatedHeading>
          </div>
          <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto text-muted-foreground">
            Crafting <span className="text-primary font-semibold">Ideas</span> into Digital <span className="text-accent font-semibold">Impact</span>
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton asChild className="group">
              <Link href="/projects">
                Explore Our Work
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
            <MagneticButton asChild className="group border border-input bg-background hover:bg-accent hover:text-accent-foreground">
              <Link href="/proposal">
                Generate Proposal
                <MoveRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative text-center py-28 md:py-40 min-h-[80vh] flex flex-col justify-center items-center">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full transform-gpu will-change-transform">
          <Spline
            scene="https://prod.spline.design/7x5pKpanGcLAntaR/scene.splinecode"
            className="w-full h-full"
            onLoad={handleSplineLoad}
            style={{ 
              pointerEvents: 'none',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              perspective: '1000px'
            }}
          />
        </div>
      </div>
      <div className="container mx-auto px-4 z-10 relative">
        <h1 className="text-5xl md:text-7xl font-headline font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Aether Portfolio
        </h1>
        <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto text-muted-foreground">
          Crafting <span className="text-primary font-semibold">Ideas</span> into Digital <span className="text-accent font-semibold">Impact</span>
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton asChild className="group">
            <Link href="/projects">
              Explore Our Work
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </MagneticButton>
          <MagneticButton asChild className="group border border-input bg-background hover:bg-accent hover:text-accent-foreground">
            <Link href="/proposal">
              Generate Proposal
              <MoveRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}