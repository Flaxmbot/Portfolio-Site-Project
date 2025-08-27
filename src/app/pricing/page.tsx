'use client';

import { useState } from 'react';
import { motion, Transition, Easing } from 'framer-motion';
import { AnimatedHeading } from '@/components/shared/AnimatedHeading';
import { AnimatedBackground } from '@/components/shared/AnimatedBackground';
import { usePreset, PresetMode } from '@/hooks/use-preset';
import { PricingCard } from '@/components/pricing/PricingCard';
import { Badge } from '@/components/ui/badge';

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

export default function PricingPage() {
  const { preset, isEnhanced, isDynamic } = usePreset();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

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

  const pricingPlans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Starter',
      price: billingCycle === 'annual' ? '$999' : '$1,199',
      period: billingCycle === 'annual' ? '/project' : '/project',
      description: 'Perfect for small businesses and startups looking to establish their online presence.',
      features: [
        'Custom Website Design',
        'Up to 5 Pages',
        'Responsive Design',
        'Basic SEO Setup',
        '1 Month Support',
        'Contact Form Integration'
      ],
      buttonText: 'Get Started'
    },
    {
      id: 'pro',
      name: 'Professional',
      price: billingCycle === 'annual' ? '$2,499' : '$2,999',
      period: billingCycle === 'annual' ? '/project' : '/project',
      description: 'Ideal for growing businesses that need a comprehensive digital solution.',
      features: [
        'Everything in Starter',
        'Up to 10 Pages',
        'Advanced SEO',
        'E-commerce Integration',
        '3 Months Support',
        'Content Management System',
        'Social Media Integration',
        'Performance Optimization'
      ],
      buttonText: 'Get Started',
      popular: true,
      highlight: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingCycle === 'annual' ? '$4,999' : '$5,99',
      period: billingCycle === 'annual' ? '/project' : '/project',
      description: 'For large organizations requiring complex solutions and ongoing partnership.',
      features: [
        'Everything in Professional',
        'Unlimited Pages',
        'Custom Functionality',
        'Advanced Analytics',
        '6 Months Support',
        'Dedicated Project Manager',
        'Priority Development',
        'Ongoing Maintenance',
        'Training & Documentation'
      ],
      buttonText: 'Contact Us'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <AnimatedBackground
      variant={isEnhanced || isDynamic || preset === 'cosmic' ? getBackgroundVariant() : undefined}
      preset={preset as Exclude<PresetMode, 'quantum'>}
    >
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto mb-16 text-center"
        >
          <motion.div variants={itemVariants}>
            <AnimatedHeading variant="geometric" size="xl" backgroundClassName="mb-6">
              Simple, Transparent Pricing
            </AnimatedHeading>
          </motion.div>
          
          <motion.p variants={itemVariants} className="mt-6 text-lg md:text-xl text-muted-foreground">
            Choose the perfect plan for your business needs. All plans include our commitment to quality 
            and results that drive growth.
          </motion.p>
          
          <motion.div variants={itemVariants} className="mt-8 flex justify-center">
            <div className="inline-flex p-1 bg-card/50 backdrop-blur-sm rounded-xl border border-primary/10">
              <button
                className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                  billingCycle === 'monthly'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly Billing
              </button>
              <button
                className={`px-6 py-3 rounded-lg transition-all duration-300 relative ${
                  billingCycle === 'annual'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setBillingCycle('annual')}
              >
                Annual Billing
                <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">
                  Save 20%
                </Badge>
              </button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                variants={itemVariants}
                className="h-full"
              >
                <PricingCard plan={plan} index={index} billingCycle={billingCycle} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mt-24 text-center"
        >
          <motion.div variants={itemVariants}>
            <AnimatedHeading variant="geometric" size="lg" backgroundClassName="mb-6">
              Frequently Asked Questions
            </AnimatedHeading>
          </motion.div>
          
          <div className="max-w-3xl mx-auto mt-12 space-y-6">
            {[
              {
                question: 'Do you offer custom solutions?',
                answer: 'Yes, all our plans can be customized to meet your specific requirements. We work closely with each client to ensure the solution fits their unique needs.'
              },
              {
                question: 'What is your development timeline?',
                answer: 'Timelines vary based on project complexity. Starter projects typically take 2-4 weeks, Professional projects 4-8 weeks, and Enterprise projects 2-6 months.'
              },
              {
                question: 'Do you provide ongoing support?',
                answer: 'Yes, all plans include support periods. We also offer extended support packages for clients who need ongoing maintenance and updates.'
              },
              {
                question: 'Can I upgrade my plan?',
                answer: 'Absolutely. You can upgrade your plan at any time. We\'ll prorate the difference and apply any additional features immediately.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 text-left"
              >
                <h3 className="text-xl font-headline font-bold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
}