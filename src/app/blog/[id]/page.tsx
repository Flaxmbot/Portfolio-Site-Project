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
import { ArrowLeft, Calendar, Clock, User, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  tags: string[];
  readTime: string;
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
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
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'blog', params.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as BlogPost);
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
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
              <div className="h-12 w-3/4 bg-muted animate-pulse rounded" />
              <div className="flex flex-wrap gap-4">
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                <div className="h-6 w-20 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-64 w-full rounded-2xl bg-muted animate-pulse" />
              <div className="space-y-4">
                <div className="h-6 w-full bg-muted animate-pulse rounded" />
                <div className="h-6 w-5/6 bg-muted animate-pulse rounded" />
                <div className="h-6 w-4/5 bg-muted animate-pulse rounded" />
                <div className="h-6 w-full bg-muted animate-pulse rounded" />
                <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  if (!post) {
    return (
      <AnimatedBackground
        variant={isEnhanced || isDynamic || preset === 'cosmic' ? getBackgroundVariant() : undefined}
        preset={preset as Exclude<PresetMode, 'quantum'>}
      >
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-headline font-bold mb-6">Post Not Found</h1>
            <p className="text-lg text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/blog">
              <Button className="group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Blog
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
            <Link href="/blog" className="group inline-flex items-center text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Blog
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mb-8">
            <AnimatedHeading
              variant="geometric"
              size="xl"
              backgroundClassName="mb-6"
            >
              {post.title}
            </AnimatedHeading>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-8 text-muted-foreground">
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </motion.div>
          
          <motion.div variants={itemVariants} className="relative h-96 w-full rounded-2xl overflow-hidden mb-12 shadow-lg">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="prose prose-lg max-w-none dark:prose-invert">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-lg text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-16 pt-8 border-t border-primary/10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-muted-foreground">
                <p className="font-medium">Written by {post.author}</p>
                <p className="text-sm">Published on {post.date}</p>
              </div>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
}