/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Os tokens do design system expostos como cores do Tailwind, para as
      // classes passarem a dizer a intenção (bg-surface, text-muted) em vez de
      // uma opacidade sobre branco (bg-white/5), que só funciona no escuro.
      colors: {
        bg: 'var(--bg)',
        'bg-blur': 'var(--bg-blur)',
        glow: 'var(--glow)',
        'glow-2': 'var(--glow-2)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        line: 'var(--border)',
        ink: 'var(--text)',
        muted: 'var(--text-2)',
        faint: 'var(--text-3)',
        accent: 'var(--accent)',
        'accent-solid': 'var(--accent-solid)',
        'accent-fill': 'var(--accent-fill)',
        'accent-fill-hover': 'var(--accent-fill-hover)',
        'accent-fill-ink': 'var(--accent-fill-ink)',
        'accent-soft': 'var(--accent-soft)',
        'accent-ink': 'var(--accent-ink)',
        'accent-soft-2': 'var(--accent-soft-2)',
        'accent-line': 'var(--accent-line)',
        ok: 'var(--ok)',
        'ok-soft': 'var(--ok-soft)',
        'ok-soft-2': 'var(--ok-soft-2)',
        'ok-line': 'var(--ok-line)',
        info: 'var(--info)',
        'info-soft': 'var(--info-soft)',
        'info-soft-2': 'var(--info-soft-2)',
        'info-line': 'var(--info-line)',
        danger: 'var(--danger)',
        'danger-soft': 'var(--danger-soft)',
        'danger-soft-2': 'var(--danger-soft-2)',
        'danger-line': 'var(--danger-line)',
        overlay: 'var(--overlay)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':  'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
