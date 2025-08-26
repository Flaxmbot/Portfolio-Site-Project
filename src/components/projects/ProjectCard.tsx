
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/shared/TiltCard";
import React, { useState } from "react";
import { ProjectModal } from "./ProjectModal";

interface ProjectCardProps {
  project: Project;
  index: number;
}


export function ProjectCard({ project, index }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut" as const
      }
    },
  };
  
  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="group block h-full cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <TiltCard className="relative h-full w-full">
            <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:border-primary group-hover:shadow-2xl group-hover:shadow-primary/20 animate-float flex flex-col">
              <CardHeader className="p-0 flex-shrink-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={project['data-ai-hint']}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-card flex-1 flex flex-col">
                <CardTitle className="font-headline text-2xl mb-2 flex-shrink-0">{project.title}</CardTitle>
                <p className="text-muted-foreground mb-4 flex-1 line-clamp-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 flex-shrink-0 mt-auto">
                  {project.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TiltCard>
        </div>
      </motion.div>
      
      <ProjectModal
        project={isModalOpen ? project : null}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}