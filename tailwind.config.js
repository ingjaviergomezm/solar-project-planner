/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary brand color (amber/orange)
        primary: {
          DEFAULT: '#F59E0B',
          50: '#FEF3C7',
          100: '#FDE68A',
          200: '#FCD34D',
          300: '#FBBF24',
          400: '#F59E0B',
          500: '#D97706',
          600: '#B45309',
          700: '#92400E',
        },
        // Background colors
        background: {
          light: '#F3F4F6',
          dark: '#0F172A',
        },
        // Surface colors for cards
        surface: {
          light: '#FFFFFF',
          dark: '#1E293B',
          darker: '#0F172A',
        },
        // Border colors
        border: {
          light: '#E2E8F0',
          dark: '#334155',
        },
        // Accent colors
        accent: {
          teal: '#14B8A6',
          purple: '#A855F7',
          blue: '#3B82F6',
          green: '#10B981',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(245, 158, 11, 0.3)',
        'glow-lg': '0 4px 14px 0 rgba(245, 158, 11, 0.39)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-dark': '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
