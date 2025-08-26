
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
          </div>
        </div>
      </div>
    </div>
  );
}
