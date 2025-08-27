
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Aether Portfolio',
  description: 'Get in touch with our team of expert designers, developers, and digital strategists. Have a project in mind? Let\'s discuss how we can help you achieve your business goals.',
  keywords: ['contact', 'get in touch', 'digital agency', 'web development', 'UI/UX design'],
  openGraph: {
    title: 'Contact Us | Aether Portfolio',
    description: 'Get in touch with our team of expert designers, developers, and digital strategists. Have a project in mind? Let\'s discuss how we can help you achieve your business goals.',
  },
};

import { ContactForm } from '@/components/contact/ContactForm';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';
import { AnimatedShinyText } from '@/components/shared/AnimatedShinyText';
import { cn } from '@/lib/utils';

const socialLinks = [
  {
    name: 'GitHub',
    icon: Github,
    url: 'https://github.com',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://linkedin.com',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    url: 'https://twitter.com',
  },
];

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
           <div className="z-10 flex min-h-[8rem] items-center justify-center">
            <AnimatedShinyText className="inline-flex items-center justify-center whitespace-pre-wrap text-center text-5xl font-headline font-bold leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-6xl">
                Get In Touch
            </AnimatedShinyText>
          </div>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground">
            Have a project in mind, or just want to say hello? Fill out the form below or connect with us on social media.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="order-2 md:order-1">
             <ContactForm />
          </div>
          <div className="order-1 md:order-2 space-y-8">
             <div>
                <h3 className="text-2xl font-headline font-bold mb-4">Contact Information</h3>
                <div className="space-y-4 text-muted-foreground">
                    <div className="flex items-center gap-4">
                        <Mail className="w-5 h-5 text-primary"/>
                        <a href="mailto:contact@aether.com" className="hover:text-primary transition-colors">contact@aether.com</a>
                    </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-headline font-bold mb-4">Follow Us</h3>
                <div className="flex space-x-6">
                {socialLinks.map(link => (
                    <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <link.icon className="w-7 h-7" />
                        <span className="sr-only">{link.name}</span>
                    </a>
                ))}
                </div>
              </div>
            
            {/* Trust Signals */}
            <div className="mt-8 p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-primary/10">
              <h3 className="text-xl font-headline font-bold mb-4">Why Choose Us?</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>24/7 Support</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>98% Client Retention</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>300% Avg. ROI Increase</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>250+ Projects Completed</span>
                </li>
              </ul>
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
              <a href="/proposal">
                Generate AI Proposal
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
  );
}
