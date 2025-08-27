'use client';

import { ProposalForm } from "@/components/proposal/ProposalForm";
import { AnimatedHeading } from "@/components/shared/AnimatedHeading";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { usePreset, PresetMode } from "@/hooks/use-preset";

export function ProposalClient() {
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
      preset={preset as Exclude<PresetMode, 'quantum'>}
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
          
          {/* Trust Signals Section */}
          <div className="mt-24">
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
          </div>
          
          {/* Enhanced CTA Section */}
          <div className="mt-24 max-w-4xl mx-auto text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 border border-primary/20">
            <h2 className="text-4xl font-headline font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help you achieve your business goals with innovative digital solutions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full text-lg font-medium transition-all duration-300">
                <a href="/contact">
                  Get Started Today
                </a>
              </button>
              <button className="group border-2 border-primary bg-background hover:bg-primary/10 text-primary px-8 py-4 rounded-full text-lg font-medium transition-all duration-300">
                <a href="tel:+1234567890">
                  Call Us Now
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
}