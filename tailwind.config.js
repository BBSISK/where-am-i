/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eire: {
          emerald: '#059669',
          gold: '#d97706',
          peat: '#292524',
          mist: '#f4f6f8',
          stone: '#78716c'
        }
      }
    },
  },
  plugins: [],
}

