'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { TiltCard } from '@/components/shared/TiltCard';
import { Badge } from '@/components/ui/badge';

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  imageUrl: string;
  icon: string;
}

interface ServiceCardProps {
  service: Service;
  index: number;
}

export const ServiceCard = memo(function ServiceCard({ service, index }: ServiceCardProps) {
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
              src={service.imageUrl}
              alt={service.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-2xl">
              {service.icon}
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-2xl font-headline font-bold mb-3">{service.title}</h3>
            <p className="text-muted-foreground mb-4 flex-1">{service.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {service.features.map((feature, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
});