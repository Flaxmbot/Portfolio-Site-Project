'use client';

import { motion } from "framer-motion";
import { Hero } from "@/components/landing/Hero";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/use-projects";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { EnhancedSection } from "@/components/shared/EnhancedSection";

export default function Home() {
  const { projects, loading } = useProjects();
  const featuredProjects = projects.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4"
    >
      <Hero />
      
      <EnhancedSection className="py-24" delay={0.3}>
        <div className="text-center mb-12">
          <div className="mb-6">
            <h2 className="text-4xl font-headline font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-shift">
              Featured Work
            </h2>
          </div>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Here's a glimpse of our recent projects. Dive into our full portfolio to see the breadth of our work.
          </p>
        </div>
        
        {loading ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div 
                key={i} 
                className="space-y-4"
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { 
                    opacity: 1, 
                    scale: 1,
                    transition: { delay: i * 0.1 }
                  }
                }}
              >
                <Skeleton className="h-48 w-full animate-pulse" />
                <Skeleton className="h-8 w-1/2 animate-pulse" />
                <Skeleton className="h-6 w-3/4 animate-pulse" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        )}
        
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Button asChild size="lg" className="group animate-pulse-glow">
            <Link href="/projects">
              View All Projects <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </EnhancedSection>
    </motion.div>
  );
}