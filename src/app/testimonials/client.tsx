'use client';

import { useState, useEffect } from 'react';
import { motion, Transition, Easing } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { AnimatedHeading } from '@/components/shared/AnimatedHeading';
import { AnimatedBackground } from '@/components/shared/AnimatedBackground';
import { usePreset, PresetMode } from '@/hooks/use-preset';
import { TestimonialCard } from '@/components/testimonials/TestimonialCard';
import { CaseStudyCard } from '@/components/testimonials/CaseStudyCard';
import { Skeleton } from '@/components/ui/skeleton';

interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  companyName: string;
  testimonial: string;
  rating: number;
  clientImageUrl: string;
}

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

export function TestimonialsClient() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'testimonials' | 'caseStudies'>('testimonials');
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch testimonials
        const testimonialsQuery = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
        const testimonialsSnapshot = await getDocs(testimonialsQuery);
        const testimonialsData: Testimonial[] = [];
        testimonialsSnapshot.forEach((doc) => {
          testimonialsData.push({ id: doc.id, ...doc.data() } as Testimonial);
        });
        setTestimonials(testimonialsData);

        // Fetch case studies
        const caseStudiesQuery = query(collection(db, 'caseStudies'), orderBy('createdAt', 'desc'));
        const caseStudiesSnapshot = await getDocs(caseStudiesQuery);
        const caseStudiesData: CaseStudy[] = [];
        caseStudiesSnapshot.forEach((doc) => {
          caseStudiesData.push({ id: doc.id, ...doc.data() } as CaseStudy);
        });
        setCaseStudies(caseStudiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
              Client Stories
            </AnimatedHeading>
          </motion.div>
          
          <motion.p variants={itemVariants} className="mt-6 text-lg md:text-xl text-muted-foreground">
            Don't just take our word for it. Hear from our clients and explore how we've helped businesses 
            achieve their goals through innovative digital solutions.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-16"
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-12">
            <div className="inline-flex p-1 bg-card/50 backdrop-blur-sm rounded-xl border border-primary/10">
              <button
                className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === 'testimonials'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('testimonials')}
              >
                Testimonials
              </button>
              <button
                className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === 'caseStudies'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('caseStudies')}
              >
                Case Studies
              </button>
            </div>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="space-y-4"
                >
                  <Skeleton className="h-64 w-full rounded-2xl" />
                </motion.div>
              ))}
            </div>
          ) : activeTab === 'testimonials' ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    variants={itemVariants}
                    className="h-full"
                  >
                    <TestimonialCard testimonial={testimonial} index={index} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {caseStudies.map((caseStudy, index) => (
                  <motion.div
                    key={caseStudy.id}
                    variants={itemVariants}
                    className="h-full"
                  >
                    <CaseStudyCard caseStudy={caseStudy} index={index} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mt-24 text-center"
        >
          <motion.div variants={itemVariants}>
            <AnimatedHeading variant="geometric" size="lg" backgroundClassName="mb-6">
              Results That Speak Volumes
            </AnimatedHeading>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-12">
            {[
              {
                value: '250+',
                label: 'Projects Completed',
              },
              {
                value: '98%',
                label: 'Client Retention',
              },
              {
                value: '300%',
                label: 'Avg. ROI Increase',
              },
              {
                value: '24/7',
                label: 'Support Available',
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-primary/10"
              >
                <div className="text-3xl font-headline font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
}