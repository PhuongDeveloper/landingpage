/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F7F4EC',
          50: '#FDFBF7',
          100: '#F7F4EC',
          200: '#EFEADB',
          300: '#E4DCBE',
        },
        botanical: {
          DEFAULT: '#354B3C',
          light: '#4A6553',
          dark: '#24372C',
          forest: '#1E2D24',
        },
        sage: {
          DEFAULT: '#8E9B82',
          light: '#A4AD92',
          muted: '#C4CCB8',
        },
        earth: {
          DEFAULT: '#705943',
          light: '#806A50',
          dark: '#544230',
        },
        gold: {
          DEFAULT: '#B7A078',
          light: '#D4C2A0',
          dark: '#96815B',
        },
        charcoal: {
          DEFAULT: '#2C332D',
          muted: '#525B54',
        },
        clay: {
          DEFAULT: '#E8E2D5',
          border: '#DDD6C6',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
