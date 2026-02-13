/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        fade: 'fadeOut 4s ease forwards',         // your existing fade
        fadeIn: 'fadeIn 0.5s ease-out forwards',  // fade in for overlay
        bounceIcon: 'bounceIcon 1s infinite',     // bounce animation for trophy
        pulseText: 'pulseText 1s infinite',      // pulse for streak text
        confetti: 'confetti 1s linear infinite', // confetti bars
      },
      keyframes: {
        fadeOut: {
          '0%': { opacity: 1 },
          '80%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.8)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        bounceIcon: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15%)' },
        },
        pulseText: {
          '0%, 100%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.1)', opacity: 0.9 },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
          '100%': { transform: 'translateY(200px) rotate(360deg)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}
