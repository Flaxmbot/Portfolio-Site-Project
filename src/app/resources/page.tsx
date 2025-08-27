'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { AnimatedHeading } from '@/components/shared/AnimatedHeading';
import { AnimatedBackground } from '@/components/shared/AnimatedBackground';
import { usePreset, PresetMode } from '@/hooks/use-preset';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { Skeleton } from '@/components/ui/skeleton';

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

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
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
    const fetchResources = async () => {
      try {
        const resourcesQuery = query(collection(db, 'resources'), orderBy('date', 'desc'));
        const resourcesSnapshot = await getDocs(resourcesQuery);
        const resourcesData: Resource[] = [];
        resourcesSnapshot.forEach((doc) => {
          resourcesData.push({ id: doc.id, ...doc.data() } as Resource);
        });
        setResources(resourcesData);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'guides', name: 'Guides' },
    { id: 'templates', name: 'Templates' },
    { id: 'tools', name: 'Tools' },
    { id: 'case-studies', name: 'Case Studies' },
  ];

  const filteredResources = activeCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === activeCategory);

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
              Resources & Guides
            </AnimatedHeading>
          </motion.div>
          
          <motion.p variants={itemVariants} className="mt-6 text-lg md:text-xl text-muted-foreground">
            Access our collection of resources, guides, and templates to help you succeed in your digital journey. 
            Download, learn, and implement proven strategies.
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
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card/50 backdrop-blur-sm text-muted-foreground hover:text-foreground border border-primary/10'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {loading ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="space-y-4"
              >
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-2/3" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ gridAutoRows: '1fr' }}>
              {filteredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  variants={itemVariants}
                  className="h-full"
                >
                  <ResourceCard resource={resource} index={index} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mt-24 text-center"
        >
          <motion.div variants={itemVariants}>
            <AnimatedHeading variant="geometric" size="lg" backgroundClassName="mb-6">
              Stay Updated
            </AnimatedHeading>
          </motion.div>
          
          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
            Subscribe to our newsletter and never miss an update on the latest resources, guides, and industry insights.
          </motion.p>
          
          <motion.div variants={itemVariants} className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-l-lg border border-r-0 border-primary/20 bg-card/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-r-lg font-medium hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
}