import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Electric blue primary system
        primary: {
          50: 'var(--color-electric-50)',
          100: 'var(--color-electric-100)',
          200: 'var(--color-electric-200)',
          300: 'var(--color-electric-300)',
          400: 'var(--color-electric-400)',
          500: 'var(--color-electric-500)',
          600: 'var(--color-electric-600)',
          700: 'var(--color-electric-700)',
          800: 'var(--color-electric-800)',
          900: 'var(--color-electric-900)',
        },
        // Charcoal background system
        charcoal: {
          50: 'var(--color-charcoal-50)',
          100: 'var(--color-charcoal-100)',
          200: 'var(--color-charcoal-200)',
          300: 'var(--color-charcoal-300)',
          400: 'var(--color-charcoal-400)',
          500: 'var(--color-charcoal-500)',
          600: 'var(--color-charcoal-600)',
          700: 'var(--color-charcoal-700)',
          800: 'var(--color-charcoal-800)',
          900: 'var(--color-charcoal-900)',
          950: 'var(--color-charcoal-950)',
        },
        // Semantic colors
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        'surface-3': 'var(--color-surface-3)',
        'surface-4': 'var(--color-surface-4)',
        text: 'var(--color-text)',
        muted: 'var(--color-text-muted)',
        subtle: 'var(--color-text-subtle)',
        // Status colors
        success: {
          50: 'var(--color-success-50)',
          100: 'var(--color-success-100)',
          600: 'var(--color-success-600)',
        },
        error: {
          50: 'var(--color-error-50)',
          100: 'var(--color-error-100)',
          600: 'var(--color-error-600)',
        },
        warning: {
          50: 'var(--color-warning-50)',
          100: 'var(--color-warning-100)',
          600: 'var(--color-accent-600)',
        },
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        base: 'var(--radius-base)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        base: 'var(--shadow-base)',
        lg: 'var(--shadow-lg)',
        neon: 'var(--shadow-neon)',
      },
      backdropBlur: {
        glass: 'var(--glass-backdrop)',
      },
      animation: {
        'fade-in-up': 'fadeInUp var(--motion-duration-normal) var(--motion-easing)',
      },
    },
  },
  plugins: [],
} satisfies Config