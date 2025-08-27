'use client';

import { useState } from 'react';
import { motion, Transition, Easing } from 'framer-motion';
import { AnimatedHeading } from '@/components/shared/AnimatedHeading';
import { AnimatedBackground } from '@/components/shared/AnimatedBackground';
import { usePreset, PresetMode } from '@/hooks/use-preset';
import { ServiceCard } from '@/components/services/ServiceCard';
import { Badge } from '@/components/ui/badge';

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  imageUrl: string;
  icon: string;
}

export function ServicesClient() {
  const { preset, isEnhanced, isDynamic } = usePreset();
  const [activeCategory, setActiveCategory] = useState('all');

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

  const services: Service[] = [
    {
      id: '1',
      title: 'Web Development',
      description: 'Custom websites and web applications built with modern technologies for optimal performance and user experience.',
      features: ['React/Next.js', 'Node.js', 'Database Integration', 'Responsive Design', 'SEO Optimization'],
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800',
      icon: '💻',
    },
    {
      id: '2',
      title: 'UI/UX Design',
      description: 'Beautiful and intuitive user interfaces designed to enhance engagement and drive conversions.',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design', 'Usability Testing'],
      imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800',
      icon: '🎨',
    },
    {
      id: '3',
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile applications for iOS and Android with seamless user experiences.',
      features: ['React Native', 'Flutter', 'iOS/Android', 'Push Notifications', 'App Store Deployment'],
      imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800',
      icon: '📱',
    },
    {
      id: '4',
      title: 'AI Integration',
      description: 'Leverage artificial intelligence to automate processes, enhance user experiences, and gain insights.',
      features: ['Machine Learning', 'Natural Language Processing', 'Computer Vision', 'Chatbots', 'Predictive Analytics'],
      imageUrl: 'https://images.unsplash.com/photo-1677442135722-5f1e06a4e6d?auto=format&fit=crop&w=800',
      icon: '🤖',
    },
    {
      id: '5',
      title: 'E-commerce Solutions',
      description: 'Complete online store solutions with payment integration, inventory management, and analytics.',
      features: ['Shopify Integration', 'Payment Processing', 'Inventory Management', 'Order Fulfillment', 'Analytics Dashboard'],
      imageUrl: 'https://images.unsplash.com/photo-1563017468-7cf44a1db57c?auto=format&fit=crop&w=800',
      icon: '🛒',
    },
    {
      id: '6',
      title: 'Cloud Services',
      description: 'Scalable cloud infrastructure and deployment solutions for optimal performance and reliability.',
      features: ['AWS/Azure', 'CI/CD Pipelines', 'Containerization', 'Serverless', 'Monitoring & Logging'],
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800',
      icon: '☁️',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'development', name: 'Development' },
    { id: 'design', name: 'Design' },
    { id: 'ai', name: 'AI & Tech' },
  ];

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => {
        if (activeCategory === 'development') {
          return ['1', '3', '6'].includes(service.id);
        }
        if (activeCategory === 'design') {
          return service.id === '2';
        }
        if (activeCategory === 'ai') {
          return ['4', '5'].includes(service.id);
        }
        return true;
      });

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
              Our Services
            </AnimatedHeading>
          </motion.div>
          
          <motion.p variants={itemVariants} className="mt-6 text-lg md:text-xl text-muted-foreground">
            We offer a comprehensive suite of digital services designed to transform your ideas into reality. 
            From concept to launch, we're your partner in digital innovation.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-16"
        >
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={activeCategory === category.id ? "default" : "secondary"}
                className="cursor-pointer px-4 py-2 text-lg rounded-full transition-all duration-300 hover:scale-105"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className="h-full"
              >
                <ServiceCard service={service} index={index} />
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
              Our Process
            </AnimatedHeading>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto mt-12">
            {[
              {
                step: '01',
                title: 'Discovery',
                description: 'We dive deep into your business goals, target audience, and project requirements.',
              },
              {
                step: '02',
                title: 'Strategy',
                description: 'We develop a comprehensive plan and timeline tailored to your specific needs.',
              },
              {
                step: '03',
                title: 'Execution',
                description: 'Our team brings the vision to life with cutting-edge technology and design.',
              },
              {
                step: '04',
                title: 'Launch & Support',
                description: 'We deploy your solution and provide ongoing support for continued success.',
              },
            ].map((process, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group"
              >
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 h-full transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-lg">
                  <div className="text-5xl font-headline font-bold text-primary/20 mb-4">{process.step}</div>
                  <h3 className="text-xl font-headline font-bold mb-3">{process.title}</h3>
                  <p className="text-muted-foreground">{process.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
}