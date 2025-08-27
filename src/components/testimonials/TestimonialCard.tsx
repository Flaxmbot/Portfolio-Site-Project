'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { TiltCard } from '@/components/shared/TiltCard';

interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  companyName: string;
 testimonial: string;
  rating: number;
  clientImageUrl: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

export const TestimonialCard = memo(function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
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
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center mb-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                <Image
                  src={testimonial.clientImageUrl}
                  alt={testimonial.clientName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-headline font-bold">{testimonial.clientName}</h3>
                <p className="text-sm text-muted-foreground">{testimonial.clientRole}, {testimonial.companyName}</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4 flex-1 italic">"{testimonial.testimonial}"</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
});