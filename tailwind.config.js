/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      colors: {
        gwewe: {
          black: '#0a0a0a',
          white: '#f5f5f5',
          grey: '#888888',
        }
      }
    },
  },
  plugins: [],
}
