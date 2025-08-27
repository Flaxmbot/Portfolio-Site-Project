
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/hooks/use-auth';
import { PresetProvider } from '@/hooks/use-preset';
import { GlobalPresetSwitcher } from '@/components/shared/GlobalPresetSwitcher';
import { QuantumCursor } from '@/components/shared/QuantumCursor';
import { LayoutContent } from './layout-content';
import { SmoothScrollProvider } from '@/components/shared/SmoothScrollProvider';

export const metadata: Metadata = {
  title: {
    default: 'Aether Portfolio - AI-Powered Digital Solutions',
    template: '%s | Aether Portfolio'
  },
  description: 'AI-Powered Marketing Portfolio - We create exceptional digital experiences that drive real business results',
  keywords: ['digital agency', 'web development', 'UI/UX design', 'AI integration', 'marketing portfolio'],
  authors: [{ name: 'Aether Portfolio' }],
  creator: 'Aether Portfolio',
  publisher: 'Aether Portfolio',
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aether-portfolio.com',
    title: 'Aether Portfolio - AI-Powered Digital Solutions',
    description: 'We create exceptional digital experiences that drive real business results',
    siteName: 'Aether Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aether Portfolio - AI-Powered Digital Solutions',
    description: 'We create exceptional digital experiences that drive real business results',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen flex flex-col bg-background")}>
        <AuthProvider>
          <PresetProvider>
            <SmoothScrollProvider>
              <LayoutContent>
                {children}
              </LayoutContent>
            </SmoothScrollProvider>
          </PresetProvider>
        </AuthProvider>
      </body>
    </html>
  );
}