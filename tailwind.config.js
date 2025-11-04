/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './App.tsx',
    './{api,components,lib}/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#f8719d',
        'brand-secondary': '#fef2f2',
        'brand-dark': '#0f172a',
        'brand-light': '#f9fafb'
      },
      keyframes: {
        'fade-in-up': {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
          'fade-in-up': 'fade-in-up 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
