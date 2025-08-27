'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { TiltCard } from '@/components/shared/TiltCard';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Download } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  tags: string[];
  readTime: string;
  category: string;
  downloadUrl?: string;
}

interface ResourceCardProps {
  resource: Resource;
  index: number;
}

export function ResourceCard({ resource, index }: ResourceCardProps) {
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
        <div className="bg-card rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-primary/20 border border-primary/10 h-full flex flex-col">
          <div className="relative h-48 w-full">
            <Image
              src={resource.imageUrl}
              alt={resource.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex flex-wrap gap-2 mb-3">
              {resource.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <h3 className="text-2xl font-headline font-bold mb-2">{resource.title}</h3>
            <p className="text-muted-foreground mb-4 flex-1">{resource.excerpt}</p>
            <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4 text-primary" />
                  <span>{resource.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{resource.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-primary" />
                <span>{resource.readTime}</span>
              </div>
            </div>
            <Link
              href={`/blog/resources/${resource.id}`}
              className="mt-4 inline-block text-primary font-medium hover:underline"
            >
              Read More
            </Link>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}