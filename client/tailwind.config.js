/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // Vibrant royal purple
          600: '#7c3aed', // Electric violet
          700: '#6d28d9', // Deep royal purple
          800: '#5b21b6', // Deep noble purple
          900: '#3b137b', // Luxurious deep velvet purple
          950: '#1c0b38', // Deepest midnight royal purple
        },
        emerald: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#3b137b',
          950: '#1c0b38',
        },
        indigo: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#3b137b',
          950: '#1c0b38',
        },
        purple: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#3b137b',
          950: '#1c0b38',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706', // Warm amber gold
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Amiri"', 'serif']
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(91, 33, 182, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 10px 30px -5px rgba(59, 19, 123, 0.14), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 25px rgba(217, 119, 6, 0.35)',
        'emerald-glow': '0 0 30px rgba(124, 58, 237, 0.4)',
        'purple-glow': '0 0 30px rgba(124, 58, 237, 0.4)'
      }
    },
  },
  plugins: [],
}
