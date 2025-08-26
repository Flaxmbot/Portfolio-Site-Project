
'use client';

import { ProjectCard } from "@/components/projects/ProjectCard";
import { AnimatedHeading } from "@/components/shared/AnimatedHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/hooks/use-projects";
import { usePreset } from "@/hooks/use-preset";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";

export default function ProjectsPage() {
  const { projects, loading } = useProjects();

  const { preset, isEnhanced, isDynamic } = usePreset();
  
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
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <AnimatedHeading
            variant="geometric"
            size="xl"
            backgroundClassName="mb-6"
          >
            Our Portfolio
          </AnimatedHeading>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground">
            We transform ambitious ideas into exceptional digital experiences. Explore our collection of case studies to see how we drive success for our clients.
          </p>
        </div>

         {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ gridAutoRows: '1fr' }}>
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
        )}
      </div>
    </AnimatedBackground>
  );
}