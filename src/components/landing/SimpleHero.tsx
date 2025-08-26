'use client';

import Link from "next/link";
import { ArrowRight, MoveRight } from "lucide-react";
import { usePreset } from "@/hooks/use-preset";
import { AnimatedHeading } from "../shared/AnimatedHeading";
import { MagneticButton } from "../shared/MagneticButton";

export function SimpleHero() {
  const { isEnhanced, isDynamic } = usePreset();

  if (isEnhanced) {
    return (
      <section className="relative text-center py-28 md:py-40 min-h-[80vh] flex flex-col justify-center items-center">
        <div className="container mx-auto px-4 z-10">
          <div className="mb-6">
            <AnimatedHeading 
              variant={isDynamic ? "particles" : "gradient"} 
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
            <MagneticButton asChild size="lg" className="group">
              <Link href="/projects">
                Explore Our Work
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
            <MagneticButton asChild size="lg" variant="outline" className="group">
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
    <section className="text-center py-28 md:py-40 min-h-[80vh] flex flex-col justify-center items-center">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-headline font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Aether Portfolio
        </h1>
        <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto text-muted-foreground">
          Crafting <span className="text-primary font-semibold">Ideas</span> into Digital <span className="text-accent font-semibold">Impact</span>
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton asChild size="lg" className="group">
            <Link href="/projects">
              Explore Our Work
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </MagneticButton>
          <MagneticButton asChild size="lg" variant="outline" className="group">
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