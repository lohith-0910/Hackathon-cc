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
        azure: {
          50: '#F0F7FF',
          100: '#E0EFFE',
          200: '#BAE0FD',
          300: '#7CD0FC',
          400: '#38BDF8',
          500: '#0078D4', // Azure Blue
          600: '#0062AD',
          700: '#004E8C',
          800: '#003A6B',
          900: '#00274A',
        },
        navy: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
        },
        slatebg: '#F8FAFC',
        cardbg: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        'modal': '0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
}

