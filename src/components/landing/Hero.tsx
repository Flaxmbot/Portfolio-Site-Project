
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, MoveRight } from "lucide-react";
import Image from "next/image";
import { useMagnetic } from "@/hooks/use-magnetic";
import { useRef } from "react";
import { AnimatedHeading } from "../shared/AnimatedHeading";

const MagneticButton = ({ children, ...props }: React.ComponentProps<typeof Button>) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { x, y, handleMouseMove, handleMouseLeave } = useMagnetic(ref);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      <Button ref={ref} {...props}>
        {children}
      </Button>
    </motion.div>
  );
}


export function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      },
    },
  };

  return (
    <section ref={containerRef} className="relative text-center py-28 md:py-40 min-h-[80vh] flex flex-col justify-center items-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1529346761619-15a01e517a16?q=80&w=2070&auto=format&fit=crop"
            alt="Abstract background"
            data-ai-hint="abstract space"
            fill
            className="object-cover opacity-20"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 -z-[5] bg-gradient-to-b from-background via-background/80 to-background" />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 z-10"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <AnimatedHeading 
            variant="gradient" 
            size="xl"
            backgroundClassName="rounded-2xl"
          >
            Aether Portfolio
          </AnimatedHeading>
        </motion.div>
        <motion.p
          variants={itemVariants}
          className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto text-muted-foreground"
        >
          Crafting <span className="text-primary font-semibold">Ideas</span> into Digital <span className="text-accent font-semibold">Impact</span>
        </motion.p>
        <motion.div variants={itemVariants} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton asChild size="lg" className="group">
            <Link href="/projects">
              Explore Our Work
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </MagneticButton>
          <MagneticButton asChild size="lg" variant="outline" className="group">
            <Link href="/proposal">
              Generate Proposal
              <MoveRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </MagneticButton>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute bottom-10"
      >
        <ArrowDown className="w-8 h-8 text-muted-foreground" />
      </motion.div>
    </section>
  );
}