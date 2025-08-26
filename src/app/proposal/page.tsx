
'use client';

import { ProposalForm } from "@/components/proposal/ProposalForm";
import { AnimatedHeading } from "@/components/shared/AnimatedHeading";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { usePreset } from "@/hooks/use-preset";

export default function ProposalPage() {
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

  return (
    <AnimatedBackground
      variant={isEnhanced || isDynamic ? getBackgroundVariant() : undefined}
      preset={preset}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
              <AnimatedHeading
                variant="geometric"
                size="xl"
                backgroundClassName="mb-6"
              >
                Proposals
              </AnimatedHeading>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground">
              Fill out the details below, and our AI will craft a professional proposal outline tailored to your project. Let's build something amazing together.
            </p>
          </div>
          <ProposalForm />
        </div>
      </div>
    </AnimatedBackground>
  );
}