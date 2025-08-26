'use client';

import { motion } from "framer-motion";
import { SimpleHero } from "@/components/landing/SimpleHero";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { useProjects } from "@/hooks/use-projects";
import { usePreset } from "@/hooks/use-preset";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { PresetSwitcher } from "@/components/shared/PresetSwitcher";
import { EnhancedSection } from "@/components/shared/EnhancedSection";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";

export default function Home() {
  const { projects, loading } = useProjects();
  const { preset, setPreset, isEnhanced, isDynamic, isMinimal } = usePreset();
  const featuredProjects = projects.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isEnhanced ? 0.1 : 0.05,
        delayChildren: isEnhanced ? 0.2 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: isEnhanced ? 20 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isEnhanced ? 0.6 : 0.3,
        ease: "easeOut" as const
      }
    }
  };

  const ContentWrapper = isEnhanced ? motion.div : 'div';
  const SectionWrapper = isEnhanced ? EnhancedSection : 'section';

  // Map preset modes to background variants
  const getBackgroundVariant = () => {
    switch (preset) {
      case 'enhanced':
        return 'particles';
      case 'dynamic':
        return 'waves';
      case 'minimal':
        return 'gradient';
      case 'cosmic':
        return 'geometric';
      default:
        return 'particles';
    }
  };

  return (
    <AnimatedBackground
      variant={isEnhanced || isDynamic || preset === 'cosmic' ? getBackgroundVariant() : undefined}
      preset={preset}
    >
      <ContentWrapper
        {...(isEnhanced ? {
          variants: containerVariants,
          initial: "hidden",
          animate: "visible"
        } : {})}
        className="container mx-auto px-4"
      >
        <SimpleHero />
        
        <SectionWrapper
          {...(isEnhanced ? {
            className: "py-24",
            delay: 0.3
          } : {
            className: "py-24"
          })}
        >
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-headline font-bold text-center mb-4 ${
              isEnhanced
                ? 'bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-shift'
                : ''
            }`}>
              Featured Work
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Here's a glimpse of our recent projects. Dive into our full portfolio to see the breadth of our work.
            </p>
          </div>
          
          {loading ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${
              isEnhanced ? 'motion-safe:animate-pulse' : ''
            }`}>
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="space-y-4"
                  {...(isEnhanced ? {
                    variants: itemVariants,
                    initial: "hidden",
                    animate: "visible",
                    transition: { delay: i * 0.1 }
                  } : {})}
                >
                  <Skeleton className={`h-48 w-full ${isEnhanced ? 'animate-pulse' : ''}`} />
                  <Skeleton className={`h-8 w-1/2 ${isEnhanced ? 'animate-pulse' : ''}`} />
                  <Skeleton className={`h-6 w-3/4 ${isEnhanced ? 'animate-pulse' : ''}`} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ gridAutoRows: '1fr' }}>
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-16">
            <MagneticButton
              asChild
              className={`group ${
                isEnhanced ? 'animate-pulse-glow' : ''
              }`}
            >
              <Link href="/projects">
                View All Projects
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
          </div>
        </SectionWrapper>
      </ContentWrapper>

    </AnimatedBackground>
  );
}