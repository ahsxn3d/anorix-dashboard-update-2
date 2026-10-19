/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-void': '#0A0A0A',
        'card-dark': '#111111',
        'card-hover': '#171717',
        'neon-purple': '#3B82F6',
        'neon-cyan': '#A1A1A1',
        'neon-emerald': '#22C55E',
        'neon-pink': '#A1A1A1',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'float-slow': 'floatOrb 8s ease-in-out infinite',
        'float-reverse': 'floatOrb 10s ease-in-out infinite reverse',
        'spin-slow': 'spinSlow 12s linear infinite',
        'spin-reverse-slow': 'spinReverseSlow 16s linear infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'radar': 'radarWave 2.5s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'bounce-rotate': 'bounceRotateIn 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'bounce-rotate-subtle': 'bounceRotateSubtle 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'letter-bounce': 'bounceRotateIn 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
      keyframes: {
        floatOrb: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-15px) scale(1.08)' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        spinReverseSlow: {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        pulseGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 30px rgba(161, 161, 161, 0.4))' },
          '50%': { filter: 'drop-shadow(0 0 25px rgba(59, 130, 246, 0.9)) drop-shadow(0 0 45px rgba(161, 161, 161, 0.7))' },
        },
        radarWave: {
          '0%': { transform: 'scale(0.8)', opacity: '0.9' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        bounceRotateIn: {
          '0%': { opacity: '0', transform: 'translateY(-34px) rotate(-16deg) scale(0.15)', filter: 'blur(4px)' },
          '50%': { opacity: '1', transform: 'translateY(6px) rotate(4deg) scale(1.16)', filter: 'blur(0px)' },
          '75%': { transform: 'translateY(-3px) rotate(-2deg) scale(0.98)' },
          '90%': { transform: 'translateY(1px) rotate(0.5deg) scale(1.01)' },
          '100%': { opacity: '1', transform: 'translateY(0) rotate(0deg) scale(1)', filter: 'blur(0px)' },
        },
        bounceRotateSubtle: {
          '0%': { opacity: '0', transform: 'translateY(-20px) rotate(-8deg) scale(0.2)' },
          '60%': { opacity: '1', transform: 'translateY(4px) rotate(2deg) scale(1.08)' },
          '100%': { opacity: '1', transform: 'translateY(0) rotate(0deg) scale(1)' },
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(59, 130, 246, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.08) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '32px 32px',
      },
    },
  },
  plugins: [],
};
