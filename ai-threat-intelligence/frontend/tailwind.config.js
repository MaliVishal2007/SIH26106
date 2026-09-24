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
        cyber: {
          bg: '#050913',
          card: '#0a1226',
          cardHover: '#0e1a38',
          border: 'rgba(0, 240, 255, 0.16)',
          borderSubtle: 'rgba(59, 130, 246, 0.15)',
          cyan: '#00f0ff',
          blue: '#3b82f6',
          indigo: '#6366f1',
          purple: '#a855f7',
          red: '#ef4444',
          orange: '#f97316',
          amber: '#f59e0b',
          green: '#10b981',
          textMuted: '#94a3b8',
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 15px -3px rgba(0, 240, 255, 0.3), 0 0 6px -2px rgba(0, 240, 255, 0.2)',
        'blue-glow': '0 0 15px -3px rgba(59, 130, 246, 0.3)',
        'red-glow': '0 0 15px -3px rgba(239, 68, 68, 0.35)',
        'green-glow': '0 0 15px -3px rgba(16, 185, 129, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar': 'radar 4s linear infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
