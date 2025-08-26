"use client";

import { Project } from "@/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, X } from "lucide-react";
import Image from "next/image";

interface ProjectModalProps {
  project: Project | null;
  open: boolean;
 onClose: () => void;
}

export function ProjectModal({ project, open, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-w-5xl md:max-w-6xl lg:max-w-7xl">
        <DialogHeader className="flex flex-row justify-between items-start">
          <div>
            <DialogTitle className="text-3xl font-headline">{project.title}</DialogTitle>
            <DialogDescription className="mt-2">
              {project.description}
            </DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="relative w-full h-80 rounded-lg overflow-hidden">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-primary">The Problem</h3>
              <p className="text-muted-foreground">{project.caseStudy.problem}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-primary">The Solution</h3>
              <p className="text-muted-foreground">{project.caseStudy.solution}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-primary">The Outcome</h3>
              <p className="text-muted-foreground">{project.caseStudy.outcome}</p>
            </div>
          </div>
          
          {project.projectUrl && project.projectUrl !== '#' && (
            <div className="flex justify-center pt-4">
              <Button asChild>
                <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-5 w-5" />
                  Visit Live Site
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}