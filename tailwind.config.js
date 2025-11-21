/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vibrant and eye-catching color palette
        neon: {
          blue: '#00D4FF',
          purple: '#9D4EDD',
          pink: '#FF006E',
          green: '#00FF88',
          yellow: '#FFD700',
          cyan: '#00FFFF',
          magenta: '#FF00FF',
          orange: '#FF4500',
        },
        vibrant: {
          indigo: '#4C1D95',
          rose: '#E11D48',
          emerald: '#059669',
          amber: '#D97706',
          teal: '#0D9488',
          violet: '#7C3AED',
          fuchsia: '#C026D3',
          lime: '#65A30D',
        },
        // Keeping original colors for compatibility
        skyblue: '#87CEEB',
        lavender: '#E6E6FA',
        mint: '#98FB98',
        sage: '#B2AC88',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}

