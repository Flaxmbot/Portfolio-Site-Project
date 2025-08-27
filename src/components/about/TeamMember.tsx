'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Twitter, Linkedin, Github } from 'lucide-react';
import { TiltCard } from '@/components/shared/TiltCard';

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

interface TeamMemberProps {
  member: TeamMemberData;
  index: number;
}

export const TeamMember = memo(function TeamMember({ member, index }: TeamMemberProps) {
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
        <div className="bg-card rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-primary/20 border border-primary/10 h-full flex flex-col">
          <div className="relative h-64 w-full">
            <Image
              src={member.imageUrl}
              alt={member.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-2xl font-headline font-bold mb-1">{member.name}</h3>
            <p className="text-primary font-medium mb-3">{member.role}</p>
            <p className="text-muted-foreground mb-4 flex-1">{member.bio}</p>
            <div className="flex space-x-4 mt-auto pt-4">
              {member.socialLinks.twitter && (
                <a 
                  href={member.socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {member.socialLinks.linkedin && (
                <a 
                  href={member.socialLinks.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {member.socialLinks.github && (
                <a 
                  href={member.socialLinks.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
});