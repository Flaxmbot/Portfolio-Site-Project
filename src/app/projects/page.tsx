
'use client';

import { ProjectCard } from "@/components/projects/ProjectCard";
import { AnimatedHeading } from "@/components/shared/AnimatedHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/hooks/use-projects";
import { usePreset, PresetMode } from "@/hooks/use-preset";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";

export default function ProjectsPage() {
  const { projects, loading } = useProjects();

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
      variant={isEnhanced || isDynamic || preset === 'cosmic' ? getBackgroundVariant() : undefined}
      preset={preset as Exclude<PresetMode, 'quantum'>}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <AnimatedHeading
            variant="geometric"
            size="xl"
            backgroundClassName="mb-6"
          >
            Our Portfolio
          </AnimatedHeading>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground">
            We transform ambitious ideas into exceptional digital experiences. Explore our collection of case studies to see how we drive success for our clients.
          </p>
        </div>

         {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ gridAutoRows: '1fr' }}>
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
        )}
        
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
        
        {/* Testimonials Section */}
        <div className="mt-24">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-headline font-bold text-center mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-shift">
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
              <div
                key={index}
                className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-primary/10"
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
              </div>
            ))}
          </div>
        </div>
        
        {/* Client Logos Section */}
        <div className="mt-24">
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
                <div
                  key={index}
                  className="flex justify-center items-center h-16 opacity-70 hover:opacity-100 transition-opacity"
                >
                  <img
                    src={logo}
                    alt={`Client ${index + 1}`}
                    className="max-h-12 w-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Enhanced CTA Section */}
        <div className="mt-24 max-w-4xl mx-auto text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 border border-primary/20">
          <h2 className="text-4xl font-headline font-bold mb-6">
            Ready to Start Your Project?
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
              <a href="/proposal">
                Generate AI Proposal
              </a>
            </button>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
}