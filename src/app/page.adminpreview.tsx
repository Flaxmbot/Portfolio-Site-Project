'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedHeading } from '@/components/shared/AnimatedHeading';
import { AnimatedBackground } from '@/components/shared/AnimatedBackground';
import { AnimatedShinyText } from '@/components/shared/AnimatedShinyText';

export default function AdminPreviewPage() {
  const [currentVariant, setCurrentVariant] = useState<'particles' | 'gradient' | 'waves' | 'geometric'>('particles');

  const variants = [
    { key: 'particles' as const, name: 'Particles', description: 'Floating particles with connections' },
    { key: 'gradient' as const, name: 'Gradient', description: 'Animated radial gradients' },
    { key: 'waves' as const, name: 'Waves', description: 'Flowing wave patterns' },
    { key: 'geometric' as const, name: 'Geometric', description: 'Rotating geometric shapes' }
  ];

  return (
    <div className="container mx-auto px-4 py-16 space-y-16">
      {/* Header */}
      <div className="text-center">
        <AnimatedHeading variant="gradient" size="xl">
          Enhanced Admin System
        </AnimatedHeading>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Deployment-ready admin authentication with enhanced UI/UX featuring animated backgrounds
        </p>
      </div>

      {/* Background Variants Demo */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Animated Background Variants</h2>
          <p className="text-muted-foreground">Choose different animation styles for your headings</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {variants.map((variant) => (
            <Button
              key={variant.key}
              variant={currentVariant === variant.key ? 'default' : 'outline'}
              onClick={() => setCurrentVariant(variant.key)}
            >
              {variant.name}
            </Button>
          ))}
        </div>

        <Card className="p-8">
          <AnimatedHeading 
            variant={currentVariant} 
            size="lg"
            backgroundClassName="mb-4"
          >
            {variants.find(v => v.key === currentVariant)?.name} Demo
          </AnimatedHeading>
          <p className="text-center text-muted-foreground">
            {variants.find(v => v.key === currentVariant)?.description}
          </p>
        </Card>
      </section>

      {/* Admin Features */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔐 Enhanced Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Improved token refresh logic</li>
              <li>• Retry mechanism for auth checks</li>
              <li>• Better error handling</li>
              <li>• Server-side admin verification</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎨 Animated Backgrounds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Particles with connections</li>
              <li>• Animated gradients</li>
              <li>• Flowing wave patterns</li>
              <li>• Geometric shapes</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚡ Performance Optimized
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Canvas-based animations</li>
              <li>• Responsive design</li>
              <li>• Smooth 60fps animations</li>
              <li>• Low CPU usage</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Enhanced Headings Examples */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Enhanced Headings in Action</h2>
          <p className="text-muted-foreground">See how the animated backgrounds enhance different sections</p>
        </div>

        <div className="space-y-8">
          <AnimatedHeading variant="particles" size="lg">
            Aether Portfolio
          </AnimatedHeading>

          <AnimatedHeading variant="geometric" size="md">
            Admin Dashboard
          </AnimatedHeading>

          <AnimatedHeading variant="waves" size="md">
            Proposals
          </AnimatedHeading>

          <AnimatedHeading variant="gradient" size="sm">
            Contact Form
          </AnimatedHeading>
        </div>
      </section>

      {/* Technical Improvements */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>🚀 Deployment Ready Improvements</CardTitle>
            <CardDescription>
              Technical enhancements for production deployment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Authentication Fixes</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Fixed auth state persistence issues</li>
                  <li>• Improved admin permission checks</li>
                  <li>• Added retry logic for network failures</li>
                  <li>• Enhanced server-side verification</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">UI/UX Enhancements</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Animated backgrounds for key headings</li>
                  <li>• Smooth transitions and effects</li>
                  <li>• Responsive design improvements</li>
                  <li>• Modern visual aesthetics</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Simple Background Demo */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Background Components</h2>
          <p className="text-muted-foreground">Standalone animated backgrounds for custom layouts</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <AnimatedBackground variant="particles" className="h-32 rounded-lg border">
            <div className="flex items-center justify-center h-full">
              <span className="text-white font-semibold">Particles Background</span>
            </div>
          </AnimatedBackground>

          <AnimatedBackground variant="geometric" className="h-32 rounded-lg border">
            <div className="flex items-center justify-center h-full">
              <span className="text-white font-semibold">Geometric Background</span>
            </div>
          </AnimatedBackground>
        </div>
      </section>
    </div>
  );
}