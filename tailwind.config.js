/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lab: {
          blue: '#2563EB',
          sky: '#3B82F6',
          cyan: '#06B6D4',
          mint: '#10B981',
          lightMint: '#ECFEFF',
          bg: '#F8FAFC',
          yellow: '#F59E0B',
          purple: '#8B5CF6'
        }
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif']
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
