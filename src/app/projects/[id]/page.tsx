
'use client';

import React from 'react';
import { useActionState, useEffect, useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Loader2, Globe } from 'lucide-react';

import { useProjects } from '@/hooks/use-projects';
import type { Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Typewriter } from '@/components/shared/Typewriter';
import { handleGenerateCaseStudy, type FormState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  // Direct access to params.id is correct for Client Components
  // Server Components would need to use React.use(params) to unwrap params if it's a Promise
  const { id } = React.use(params);
  const { projects, loading } = useProjects();
  const [project, setProject] = useState<Project | null | undefined>(null);

  useEffect(() => {
    if (!loading) {
      const foundProject = projects.find((p) => p.id === id);
      setProject(foundProject);
    }
  }, [id, projects, loading]);
  
  const { toast } = useToast();
  
  const initialState: FormState = {
    message: null,
    caseStudyDescription: project?.caseStudy.aiGeneratedDescription || null,
    errors: {},
  };
  
  const [state, formAction, isPending] = useActionState(handleGenerateCaseStudy, initialState);
  
  const [initialDescription, setInitialDescription] = useState(
    project?.caseStudy.aiGeneratedDescription || ''
    );

  useEffect(() => {
    if (state.caseStudyDescription) {
      setInitialDescription(state.caseStudyDescription);
    }
     if (project?.caseStudy.aiGeneratedDescription) {
      setInitialDescription(project.caseStudy.aiGeneratedDescription);
    }
    if (state.message && state.message.startsWith('An unexpected error')) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, project, toast]);
  
  useEffect(() => {
    if (!loading && project === undefined) {
      notFound();
    }
  }, [loading, project])

  if (loading || project === null) {
    return (
       <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-48 mb-8" />
          <Skeleton className="h-20 w-3/4 mb-4" />
          <div className="flex flex-wrap gap-2 mb-8">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="relative w-full h-96 rounded-lg overflow-hidden mb-12 shadow-lg" />
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <Skeleton className="h-6 w-24 mb-4" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div>
              <Skeleton className="h-6 w-24 mb-4" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div>
              <Skeleton className="h-6 w-24 mb-4" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
     return notFound();
  }


  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>

        <h1 className="font-headline text-5xl md:text-7xl font-bold mb-4">{project.title}</h1>
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="relative w-full h-96 rounded-lg overflow-hidden mb-12 shadow-lg">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover"
            data-ai-hint={project['data-ai-hint'] || ''}
          />
        </div>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-headline prose-a:text-primary hover:prose-a:text-accent">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="text-muted-foreground">The Problem</h3>
              <p>{project.caseStudy.problem}</p>
            </div>
            <div>
              <h3 className="text-muted-foreground">The Solution</h3>
              <p>{project.caseStudy.solution}</p>
            </div>
            <div>
              <h3 className="text-muted-foreground">The Outcome</h3>
              <p>{project.caseStudy.outcome}</p>
            </div>
          </div>

          <Separator className="my-12" />
          <div className="bg-card p-8 rounded-lg border border-primary/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-primary m-0">AI-Generated Case Study</h2>
              <form action={formAction}>
                <input type="hidden" name="projectName" value={project.title} />
                <input type="hidden" name="projectDescription" value={`${project.caseStudy.problem} ${project.caseStudy.solution} ${project.caseStudy.outcome}`} />
                <input type="hidden" name="projectUrl" value={project.projectUrl} />
                <input type="hidden" name="technologiesUsed" value={project.tags.join(', ')} />
                 <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </form>
            </div>
            {initialDescription ? (
              <Typewriter
                key={initialDescription}
                text={initialDescription}
                className="text-muted-foreground italic"
              />
            ) : (
               <p className="text-muted-foreground italic">
                Click the button to generate a case study with AI.
              </p>
            )}
          </div>

          {project.projectUrl && project.projectUrl !== '#' && (
            <div className="text-center mt-12">
              <Button asChild size="lg">
                <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-5 w-5" />
                  Visit Live Site
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

