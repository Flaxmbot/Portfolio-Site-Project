'use client';

import { useState, useEffect } from 'react';
import { motion, Transition, Easing } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { AnimatedHeading } from '@/components/shared/AnimatedHeading';
import { TeamMember } from '@/components/about/TeamMember';
import { AnimatedBackground } from '@/components/shared/AnimatedBackground';
import { usePreset, PresetMode } from '@/hooks/use-preset';
import { Skeleton } from '@/components/ui/skeleton';

interface TeamMemberData {
  id: string;
  name: string;
  role: string;
 bio: string;
 imageUrl: string;
 socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
 };
}

export default function AboutPage() {
 const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);
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
    const fetchTeamMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'team'));
        const members: TeamMemberData[] = [];
        querySnapshot.forEach((doc) => {
          members.push({ id: doc.id, ...doc.data() } as TeamMemberData);
        });
        setTeamMembers(members);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
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
        ease: "easeOut" as Easing,
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
              About Us
            </AnimatedHeading>
          </motion.div>
          
          <motion.p variants={itemVariants} className="mt-6 text-lg md:text-xl text-muted-foreground">
            We're a passionate team of designers, developers, and digital strategists dedicated to creating
            exceptional digital experiences that drive real business results.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-headline font-bold text-center mb-12">
            Our Story
          </motion.h2>
          <motion.div variants={itemVariants} className="max-w-3xl mx-auto bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-primary/10">
            <p className="text-lg text-muted-foreground mb-4">
              Founded in 2020, Aether Portfolio began with a simple mission: to bridge the gap between
              creative vision and technical execution. What started as a small team of two has grown into
              a diverse collective of over 15 talented individuals.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              We believe that great digital experiences are born from the intersection of art and science.
              Our approach combines cutting-edge technology with human-centered design to create solutions
              that not only look beautiful but also drive measurable business outcomes.
            </p>
            <p className="text-lg text-muted-foreground">
              Today, we work with startups and enterprises across industries, helping them navigate the
              digital landscape and achieve their boldest ambitions.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-headline font-bold text-center mb-12">
            Meet Our Team
          </motion.h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="space-y-4"
                >
                  <Skeleton className="h-64 w-full rounded-2xl" />
                  <Skeleton className="h-8 w-3/4 mx-auto" />
                  <Skeleton className="h-6 w-1/2 mx-auto" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  variants={itemVariants}
                  className="h-full"
                >
                  <TeamMember member={member} index={index} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mt-24 text-center"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-headline font-bold mb-6">
            Our Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: 'Innovation',
                description: 'We push boundaries and embrace emerging technologies to create cutting-edge solutions.',
              },
              {
                title: 'Collaboration',
                description: 'We believe the best results come from diverse perspectives working together toward a common goal.',
              },
              {
                title: 'Excellence',
                description: 'We strive for perfection in everything we do, never settling for anything less than our best.',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 hover:border-primary/30 transition-all duration-300"
              >
                <h3 className="text-xl font-headline font-bold mb-3 text-primary">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
}