import type {Config} from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {height: '0'},
          to: {height: 'var(--radix-accordion-content-height)'},
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: '0'},
        },
        'smooth-fade-in': {
          'from': { opacity: '0', transform: 'translateY(20px) translateZ(0)' },
          'to': { opacity: '1', transform: 'translateY(0) translateZ(0)' }
        },
        'smooth-scale-in': {
          'from': { opacity: '0', transform: 'scale(0.95) translateZ(0)' },
          'to': { opacity: '1', transform: 'scale(1) translateZ(0)' }
        },
        'buttery-smooth-float': {
          '0%, 100%': { transform: 'translateY(0) translateZ(0)' },
          '50%': { transform: 'translateY(-8px) translateZ(0)' }
        },
        'ultra-smooth-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1) translateZ(0)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02) translateZ(0)' }
        },
        'fade-in-up': {
          'from': { opacity: '0', transform: 'translateY(30px) translateZ(0)' },
          'to': { opacity: '1', transform: 'translateY(0) translateZ(0)' }
        },
        'slide-in-left': {
          'from': { opacity: '0', transform: 'translateX(-30px) translateZ(0)' },
          'to': { opacity: '1', transform: 'translateX(0) translateZ(0)' }
        },
        'slide-in-right': {
          'from': { opacity: '0', transform: 'translateX(30px) translateZ(0)' },
          'to': { opacity: '1', transform: 'translateX(0) translateZ(0)' }
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'smooth-fade-in': 'smooth-fade-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'smooth-scale-in': 'smooth-scale-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'buttery-float': 'buttery-smooth-float 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
        'ultra-smooth-pulse': 'ultra-smooth-pulse 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
        'fade-in-up': 'fade-in-up 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'slide-in-left': 'slide-in-left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'slide-in-right': 'slide-in-right 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.foreground / 0.8'),
            '--tw-prose-headings': theme('colors.foreground'),
            '--tw-prose-lead': theme('colors.foreground'),
            '--tw-prose-links': theme('colors.primary.DEFAULT'),
            '--tw-prose-bold': theme('colors.foreground'),
            '--tw-prose-counters': theme('colors.muted.foreground'),
            '--tw-prose-bullets': theme('colors.border'),
            '--tw-prose-hr': theme('colors.border'),
            '--tw-prose-quotes': theme('colors.foreground'),
            '--tw-prose-quote-borders': theme('colors.primary.DEFAULT'),
            '--tw-prose-captions': theme('colors.muted.foreground'),
            '--tw-prose-code': theme('colors.foreground'),
            '--tw-prose-pre-code': theme('colors.foreground'),
            '--tw-prose-pre-bg': theme('colors.muted.DEFAULT'),
            '--tw-prose-th-borders': theme('colors.border'),
            '--tw-prose-td-borders': theme('colors.border'),
          },
        },
      }),
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
export default config;
