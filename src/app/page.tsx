'use client';

import { motion } from "framer-motion";
import { SimpleHero } from "@/components/landing/SimpleHero";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { useProjects } from "@/hooks/use-projects";
import { usePreset } from "@/hooks/use-preset";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { PresetSwitcher } from "@/components/shared/PresetSwitcher";
import { EnhancedSection } from "@/components/shared/EnhancedSection";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import Spline from '@splinetool/react-spline';
import { useState, useCallback, lazy, Suspense } from 'react';

// Lazy load spline component for better performance
const LazySpline = lazy(() => import('@splinetool/react-spline'));

export default function Home() {
  const { projects, loading } = useProjects();
  const { preset, setPreset, isEnhanced, isDynamic, isMinimal } = usePreset();
  const featuredProjects = projects.slice(0, 3);
  const [splineLoaded, setSplineLoaded] = useState(false);

  const handleSplineLoad = useCallback(() => {
    setSplineLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isEnhanced ? 0.08 : 0.05, // Reduced stagger for smoothness
        delayChildren: isEnhanced ? 0.1 : 0.05, // Reduced initial delay
        ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic bezier for buttery smooth
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: isEnhanced ? 15 : 8,
      scale: 0.98
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: isEnhanced ? 0.4 : 0.3, // Optimized duration
        ease: [0.25, 0.46, 0.45, 0.94], // Buttery smooth easing
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const ContentWrapper = isEnhanced ? motion.div : 'div';
  const SectionWrapper = isEnhanced ? EnhancedSection : 'section';

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

  const showAnimatedBackground = preset !== 'quantum' && preset !== 'cosmic';
  
  if (showAnimatedBackground) {
    return (
      <AnimatedBackground
        variant={isEnhanced || isDynamic ? getBackgroundVariant() : undefined}
        preset={preset}
      >
        <ContentWrapper
          {...(isEnhanced ? {
            variants: containerVariants,
            initial: "hidden",
            animate: "visible"
          } : {})}
          className="container mx-auto px-4"
        >
          <SimpleHero />
          
          
          <SectionWrapper
            {...(isEnhanced ? {
              className: "py-24",
              delay: 0.3
            } : {
              className: "py-24"
            })}
          >
            <div className="text-center mb-12">
              <h2 className={`text-4xl font-headline font-bold text-center mb-4 ${
                isEnhanced
                  ? 'bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-shift'
                  : ''
              }`}>
                Featured Work
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Here's a glimpse of our recent projects. Dive into our full portfolio to see the breadth of our work.
              </p>
            </div>
            
            {loading ? (
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${
                isEnhanced ? 'motion-safe:animate-pulse' : ''
              }`}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="space-y-4"
                    {...(isEnhanced ? {
                      variants: itemVariants,
                      initial: "hidden",
                      animate: "visible",
                      transition: { delay: i * 0.1 }
                    } : {})}
                  >
                    <Skeleton className={`h-48 w-full ${isEnhanced ? 'animate-pulse' : ''}`} />
                    <Skeleton className={`h-8 w-1/2 ${isEnhanced ? 'animate-pulse' : ''}`} />
                    <Skeleton className={`h-6 w-3/4 ${isEnhanced ? 'animate-pulse' : ''}`} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ gridAutoRows: '1fr' }}>
                {featuredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            )}
            
            <div className="text-center mt-16">
              <MagneticButton
                asChild
                className={`group ${
                  isEnhanced ? 'animate-pulse-glow' : ''
                }`}
              >
                <Link href="/projects">
                  View All Projects
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </MagneticButton>
            </div>
            
            {/* Spline 3D Component with Overlay Text */}
            <div className="py-16 relative">
              {/* Spline Component */}
              <div className="flex justify-center min-h-[500px] pointer-events-none spline-container">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative w-full h-full transform-gpu will-change-transform"
                >
                  <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl"></div>
                  <div className="relative z-10 w-full h-full">
                    <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl animate-pulse"></div>}>
                      <LazySpline
                        scene="https://prod.spline.design/LVXH37kcZ-p6bYeW/scene.splinecode"
                        className="w-full h-full"
                        onLoad={handleSplineLoad}
                        style={{ 
                          pointerEvents: 'none',
                          transform: 'translateZ(0)',
                          backfaceVisibility: 'hidden',
                          perspective: '1000px'
                        }}
                      />
                    </Suspense>
                  </div>
                </motion.div>
              </div>
              
              {/* Overlay Text Container */}
              <div className="absolute inset-0 flex items-center justify-between px-8 pointer-events-none">
                {/* Left Text */}
                <motion.div
                  className="text-left max-w-md bg-background/80 backdrop-blur-sm p-6 rounded-2xl border border-primary/10 pointer-events-auto transform-gpu will-change-transform"
                  initial={{ opacity: 0, x: -30, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                >
                  <h2 className="text-3xl font-headline font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-shift">
                    Innovative Design
                  </h2>
                  <p className="text-base text-muted-foreground mb-6">
                    Experience cutting-edge 3D visuals that bring your ideas to life with stunning realism and interactivity.
                  </p>
                  <motion.button
                    className="group bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-medium transition-all duration-200 transform-gpu will-change-transform"
                    whileHover={{ scale: 1.03, translateZ: 0 }}
                    whileTap={{ scale: 0.97, translateZ: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5 inline-block transition-transform group-hover:translate-x-1 duration-200" />
                  </motion.button>
                </motion.div>
                
                {/* Right Text */}
                <motion.div
                  className="text-right max-w-md bg-background/80 backdrop-blur-sm p-6 rounded-2xl border border-primary/10 pointer-events-auto transform-gpu will-change-transform"
                  initial={{ opacity: 0, x: 30, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                >
                  <h2 className="text-3xl font-headline font-bold mb-4 bg-gradient-to-l from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-shift">
                    Future Technology
                  </h2>
                  <p className="text-base text-muted-foreground mb-6">
                    Harness the power of advanced 3D technology to create immersive experiences that captivate your audience.
                  </p>
                  <motion.button
                    className="group bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-medium transition-all duration-200 transform-gpu will-change-transform"
                    whileHover={{ scale: 1.03, translateZ: 0 }}
                    whileTap={{ scale: 0.97, translateZ: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    Explore More
                    <ArrowRight className="ml-2 h-5 w-5 inline-block transition-transform group-hover:translate-x-1 duration-200" />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </SectionWrapper>
          
          {/* Trust Signals Section */}
          <SectionWrapper
            {...(isEnhanced ? {
              className: "py-16",
              delay: 0.4
            } : {
              className: "py-16"
            })}
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { value: '250+', label: 'Projects Completed' },
                  { value: '98%', label: 'Client Retention' },
                  { value: '300%', label: 'Avg. ROI Increase' },
                  { value: '24/7', label: 'Support Available' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="bg-card/30 backdrop-blur-sm rounded-xl p-6 border border-primary/10 transform-gpu will-change-transform"
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: 0.3 + index * 0.08, // Reduced delay for smoother sequence
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                  >
                    <div className="text-3xl font-headline font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-muted-foreground text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </SectionWrapper>
          
          {/* Testimonials Section */}
          <SectionWrapper
            {...(isEnhanced ? {
              className: "py-24",
              delay: 0.5
            } : {
              className: "py-24"
            })}
          >
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className={`text-4xl font-headline font-bold text-center mb-4 ${
                isEnhanced
                  ? 'bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-shift'
                  : ''
              }`}>
                What Our Clients Say
              </h2>
              <p className="text-center text-muted-foreground max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our clients have to say about working with us.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  quote: "Working with Aether Portfolio transformed our digital presence completely. Their attention to detail and innovative approach exceeded our expectations.",
                  author: "Sarah Johnson",
                  role: "CEO, TechStart Inc.",
                  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100"
                },
                {
                  quote: "The AI proposal generator saved us countless hours. The team delivered exactly what we needed, on time and within budget.",
                  author: "Michael Chen",
                  role: "Product Director, InnovateCo",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100"
                },
                {
                  quote: "Exceptional results from day one. Their strategic approach helped us increase conversions by 150% in just three months.",
                  author: "Emma Rodriguez",
                  role: "Marketing VP, Global Solutions",
                  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 transform-gpu will-change-transform"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.4 + index * 0.1, // Reduced delay for smoother sequence
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                >
                  <div className="flex items-center mb-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="object-cover"
                        width={48}
                        height={48}
                      />
                    </div>
                    <div className="text-left">
                      <h4 className="font-headline font-bold">{testimonial.author}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
          
          {/* Client Logos Section */}
          <SectionWrapper
            {...(isEnhanced ? {
              className: "py-16",
              delay: 0.7
            } : {
              className: "py-16"
            })}
          >
            <div className="max-w-6xl mx-auto">
              <h3 className="text-center text-muted-foreground mb-12">Trusted by innovative companies worldwide</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
                {[
                  "https://logo.clearbit.com/google.com",
                  "https://logo.clearbit.com/microsoft.com",
                  "https://logo.clearbit.com/amazon.com",
                  "https://logo.clearbit.com/netflix.com",
                  "https://logo.clearbit.com/airbnb.com",
                  "https://logo.clearbit.com/uber.com"
                ].map((logo, index) => (
                  <motion.div
                    key={index}
                    className="flex justify-center items-center h-16 opacity-70 hover:opacity-100 transition-opacity"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: [0, -2, 0], // Reduced bounce height
                    }}
                    transition={{
                      delay: 0.8 + index * 0.15, // Increased delay between animations
                      duration: 3, // Slower animation
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  >
                    <img
                      src={logo}
                      alt={`Client ${index + 1}`}
                      className="max-h-12 w-auto"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </SectionWrapper>
          
          {/* Enhanced CTA Section */}
          <SectionWrapper
            {...(isEnhanced ? {
              className: "py-24",
              delay: 0.6
            } : {
              className: "py-24"
            })}
          >
            <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 border border-primary/20">
              <h2 className="text-4xl font-headline font-bold mb-6">
                Ready to Transform Your Digital Presence?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let's discuss how we can help you achieve your business goals with innovative digital solutions.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <MagneticButton
                  asChild
                  className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full text-lg font-medium transition-all duration-300"
                >
                  <Link href="/contact">
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </MagneticButton>
                <MagneticButton
                  asChild
                  className="group border-2 border-primary bg-background hover:bg-primary/10 text-primary px-8 py-4 rounded-full text-lg font-medium transition-all duration-300"
                >
                  <Link href="/proposal">
                    Generate AI Proposal
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </SectionWrapper>
        </ContentWrapper>
      
      </AnimatedBackground>
    );
  }
  
  // For quantum and cosmic presets, don't use AnimatedBackground
  return (
    <ContentWrapper
      {...(isEnhanced ? {
        variants: containerVariants,
        initial: "hidden",
        animate: "visible"
      } : {})}
      className="container mx-auto px-4"
    >
      <SimpleHero />
      
      {/* Spline 3D Component */}
      <div className="py-16 pointer-events-none spline-container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full transform-gpu will-change-transform"
          style={{ minHeight: '500px' }}
        >
          <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl animate-pulse"></div>}>
            <LazySpline
              scene="https://my.spline.design/robotfollowcursorforlandingpage-FaQa6C7fo1R9PCl7wbNT8rpT/"
              className="w-full h-full"
              onLoad={handleSplineLoad}
              style={{ 
                pointerEvents: 'none',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                perspective: '1000px'
              }}
            />
          </Suspense>
        </motion.div>
      </div>
      
      <SectionWrapper
        {...(isEnhanced ? {
          className: "py-24",
          delay: 0.3
        } : {
          className: "py-24"
        })}
      >
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-headline font-bold text-center mb-4 ${
            isEnhanced
              ? 'bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-shift'
              : ''
          }`}>
            Featured Work
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Here's a glimpse of our recent projects. Dive into our full portfolio to see the breadth of our work.
          </p>
        </div>
        
        {loading ? (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${
            isEnhanced ? 'motion-safe:animate-pulse' : ''
          }`}>
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="space-y-4"
                {...(isEnhanced ? {
                  variants: itemVariants,
                  initial: "hidden",
                  animate: "visible",
                  transition: { delay: i * 0.1 }
                } : {})}
              >
                <Skeleton className={`h-48 w-full ${isEnhanced ? 'animate-pulse' : ''}`} />
                <Skeleton className={`h-8 w-1/2 ${isEnhanced ? 'animate-pulse' : ''}`} />
                <Skeleton className={`h-6 w-3/4 ${isEnhanced ? 'animate-pulse' : ''}`} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ gridAutoRows: '1fr' }}>
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
        
        <div className="text-center mt-16">
          <MagneticButton
            asChild
            className={`group ${
              isEnhanced ? 'animate-pulse-glow' : ''
            }`}
          >
            <Link href="/projects">
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </MagneticButton>
        </div>
        
      </SectionWrapper>
      
      {/* Trust Signals Section */}
      <SectionWrapper
        {...(isEnhanced ? {
          className: "py-16",
          delay: 0.4
        } : {
          className: "py-16"
        })}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '250+', label: 'Projects Completed' },
              { value: '98%', label: 'Client Retention' },
              { value: '300%', label: 'Avg. ROI Increase' },
              { value: '24/7', label: 'Support Available' },
            ].map((stat, index) => (
              <div key={index} className="bg-card/30 backdrop-blur-sm rounded-xl p-6 border border-primary/10">
                <div className="text-3xl font-headline font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
      
      {/* Enhanced CTA Section */}
      <SectionWrapper
        {...(isEnhanced ? {
          className: "py-24",
          delay: 0.6
        } : {
          className: "py-24"
        })}
      >
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 border border-primary/20">
          <h2 className="text-4xl font-headline font-bold mb-6">
            Ready to Transform Your Digital Presence?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help you achieve your business goals with innovative digital solutions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <MagneticButton
              asChild
              className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full text-lg font-medium transition-all duration-300"
            >
              <Link href="/contact">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
            <MagneticButton
              asChild
              className="group border-2 border-primary bg-background hover:bg-primary/10 text-primary px-8 py-4 rounded-full text-lg font-medium transition-all duration-300"
            >
              <Link href="/proposal">
                Generate AI Proposal
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
          </div>
        </div>
      </SectionWrapper>
    </ContentWrapper>
  );
}