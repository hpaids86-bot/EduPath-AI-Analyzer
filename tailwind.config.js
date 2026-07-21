/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./frontend/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        themeBg: 'var(--bg-main)',
        themeSidebar: 'var(--bg-sidebar)',
        themeCard: 'var(--bg-card)',
        themeBorder: 'var(--border-color)',
        themeText: 'var(--text-primary)',
        themeMuted: 'var(--text-secondary)',
        themeAccent: 'var(--accent-primary)',
        themeAccentSec: 'var(--accent-secondary)',
        themeGlow: 'var(--accent-glow)',
        themeAccentSoft: 'var(--accent-soft)',
        themeAccentSecSoft: 'var(--accent-sec-soft)',

        // Glassmorphism System Colors (Cream Theme)
        glassBase: '#FDFBF7',
        glassBaseTo: '#EAE5D8',
        glassBg: 'rgba(255, 255, 255, 0.45)',
        glassBorder: 'rgba(30, 41, 59, 0.08)',
        glassBorderHover: 'rgba(79, 70, 229, 0.40)',
        violetAccent: '#4F46E5',
        tealAccent: '#0D9488',
        textGlass: '#1E293B',
        textGlassMuted: 'rgba(71, 85, 105, 0.8)',
        semanticHigh: '#F59E0B',
        semanticLow: '#64748B',
        semanticSuccess: '#10B981',
        semanticError: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.02em',
      }
    },
  },
  plugins: [],
}

