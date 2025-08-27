'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { TiltCard } from '@/components/shared/TiltCard';
import { Badge } from '@/components/ui/badge';

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  imageUrl: string;
  clientLogoUrl: string;
  tags: string[];
}

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  index: number;
}

export const CaseStudyCard = memo(function CaseStudyCard({ caseStudy, index }: CaseStudyCardProps) {
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
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="h-full"
    >
      <TiltCard className="relative h-full w-full">
        <div className="bg-card rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-primary/20 border-primary/10 h-full flex flex-col">
          <div className="relative h-48 w-full">
            <Image
              src={caseStudy.imageUrl}
              alt={caseStudy.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-full p-2">
              <Image
                src={caseStudy.clientLogoUrl}
                alt={caseStudy.title}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-2xl font-headline font-bold mb-2">{caseStudy.title}</h3>
            <p className="text-muted-foreground mb-4 flex-1">{caseStudy.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {caseStudy.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="mt-auto">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Results:</span>
                <div className="flex space-x-2">
                  {caseStudy.results.slice(0, 3).map((result, idx) => (
                    <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {result}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
});