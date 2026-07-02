import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        brand: {
          red: '#C0161D',
          gold: '#B8860B',
        },
        ink: {
          DEFAULT: '#0A0A0A',
          2: '#1F2937',
          3: '#374151',
          4: '#6B7280',
          5: '#9CA3AF',
          6: '#D1D5DB',
        },
        pearl: '#F6F7F9',
        mist: '#EEF0F3',
        snow: '#FAFBFC',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        urdu: ['Noto Nastaliq Urdu', 'serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            a: { color: '#C0161D' },
          },
        },
      },
      animation: {
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'ticker': 'ticker 40s linear infinite',
        'in': 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slide-down': 'slideDown 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slide-left': 'slideLeft 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '100% 0' },
          '100%': { backgroundPosition: '-100% 0' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 2px 12px rgba(192, 22, 29, 0.35)',
          },
          '50%': {
            opacity: '0.9',
            boxShadow: '0 2px 20px rgba(192, 22, 29, 0.5)',
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
