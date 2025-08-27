'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { AnimatedHeading } from '@/components/shared/AnimatedHeading';
import { AnimatedBackground } from '@/components/shared/AnimatedBackground';
import { usePreset, PresetMode } from '@/hooks/use-preset';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Download, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

export default function ResourcePage({ params }: { params: { id: string } }) {
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
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
    const fetchResource = async () => {
      try {
        const docRef = doc(db, 'resources', params.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setResource({ id: docSnap.id, ...docSnap.data() } as Resource);
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching resource:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchResource();
    }
  }, [params.id]);

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resource?.title,
          text: resource?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <AnimatedBackground
        variant={isEnhanced || isDynamic || preset === 'cosmic' ? getBackgroundVariant() : undefined}
        preset={preset as Exclude<PresetMode, 'quantum'>}
      >
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <div className="h-10 w-10 rounded-full mr-4 bg-muted animate-pulse" />
              <div className="h-6 w-24 bg-muted animate-pulse" />
            </div>
            
            <div className="space-y-6">
              <div className="h-12 w-3/4 bg-muted animate-pulse" />
              <div className="flex flex-wrap gap-4">
                <div className="h-6 w-32 bg-muted animate-pulse" />
                <div className="h-6 w-24 bg-muted animate-pulse" />
                <div className="h-6 w-20 bg-muted animate-pulse" />
              </div>
              <div className="h-64 w-full rounded-2xl bg-muted animate-pulse" />
              <div className="space-y-4">
                <div className="h-6 w-full bg-muted animate-pulse" />
                <div className="h-6 w-5/6 bg-muted animate-pulse" />
                <div className="h-6 w-4/5 bg-muted animate-pulse" />
                <div className="h-6 w-full bg-muted animate-pulse" />
                <div className="h-6 w-3/4 bg-muted animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  if (!resource) {
    return (
      <AnimatedBackground
        variant={isEnhanced || isDynamic || preset === 'cosmic' ? getBackgroundVariant() : undefined}
        preset={preset as Exclude<PresetMode, 'quantum'>}
      >
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-headline font-bold mb-6">Resource Not Found</h1>
            <p className="text-lg text-muted-foreground mb-8">
              The resource you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/blog/resources">
              <Button className="group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Resources
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

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
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <Link href="/blog/resources" className="group inline-flex items-center text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Resources
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mb-8">
            <AnimatedHeading
              variant="geometric"
              size="xl"
              backgroundClassName="mb-6"
            >
              {resource.title}
            </AnimatedHeading>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-8 text-muted-foreground">
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>{resource.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{resource.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>{resource.readTime}</span>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-8">
            {resource.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                <span className="mr-1">#</span>
                {tag}
              </Badge>
            ))}
          </motion.div>
          
          <motion.div variants={itemVariants} className="relative h-96 w-full rounded-2xl overflow-hidden mb-12 shadow-lg">
            <Image
              src={resource.imageUrl}
              alt={resource.title}
              fill
              className="object-cover"
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="prose prose-lg max-w-none dark:prose-invert">
            {resource.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-lg text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </motion.div>
          
          {resource.downloadUrl && (
            <motion.div variants={itemVariants} className="mt-12 p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-primary/10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-headline font-bold mb-2">Download Resource</h3>
                  <p className="text-muted-foreground">
                    Get this resource as a downloadable file to use in your projects.
                  </p>
                </div>
                <a 
                  href={resource.downloadUrl}
                  download
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  <Download className="h-5 w-5" />
                  Download Now
                </a>
              </div>
            </motion.div>
          )}
          
          <motion.div variants={itemVariants} className="mt-16 pt-8 border-t border-primary/10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-muted-foreground">
                <p className="font-medium">Written by {resource.author}</p>
                <p className="text-sm">Published on {resource.date}</p>
              </div>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/blog/resources">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Resources
                  </Link>
                </Button>
                <Button onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Link href="/contact">
                  <Button>
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
}