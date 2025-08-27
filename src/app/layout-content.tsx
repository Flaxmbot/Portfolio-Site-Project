'use client';

import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { usePreset } from '@/hooks/use-preset';
import { GlobalPresetSwitcher } from '@/components/shared/GlobalPresetSwitcher';
import { QuantumCursor } from '@/components/shared/QuantumCursor';
import { FullPageQuantumBackground } from '@/components/shared/FullPageQuantumBackground';
import { LiveChatWidget } from '@/components/shared/LiveChatWidget';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { preset } = usePreset();
  
  const showFullPageQuantumBackground = preset === 'quantum' || preset === 'cosmic';
  
  if (showFullPageQuantumBackground) {
    return (
      <>
        <FullPageQuantumBackground />
        <QuantumCursor />
        <Navbar />
        <main className="flex-grow relative z-10">{children}</main>
        <Footer />
        <Toaster />
        <GlobalPresetSwitcher />
        <LiveChatWidget />
      </>
    );
  }
  
  return (
    <>
      <QuantumCursor />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Toaster />
      <GlobalPresetSwitcher />
      <LiveChatWidget />
    </>
  );
}