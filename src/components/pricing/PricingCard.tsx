'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { TiltCard } from '@/components/shared/TiltCard';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
  highlight?: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
  index: number;
  billingCycle: 'monthly' | 'annual';
}

export const PricingCard = memo(function PricingCard({ plan, index, billingCycle }: PricingCardProps) {
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
      <TiltCard 
        className={`relative h-full w-full ${plan.highlight ? 'scale-105' : ''}`}
        disabled={!plan.highlight}
      >
        <div className={`bg-card rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out border h-full flex flex-col ${
          plan.popular 
            ? 'border-primary ring-2 ring-primary/20' 
            : 'border-primary/10 hover:border-primary/30 hover:shadow-xl'
        }`}>
          {plan.popular && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
          )}
          <div className="p-6 flex-1 flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl font-headline font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-headline font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-2">{plan.period}</span>
              </div>
              <p className="text-muted-foreground">{plan.description}</p>
            </div>
            
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button
                          className={`w-full ${
                            plan.popular
                              ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                              : 'border border-primary bg-background hover:bg-primary/10'
                          }`}
                        >
                          {plan.buttonText}
                        </Button>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
});