/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'parrot-green': '#22c55e',
        'soft-white': '#fefefe',
        'light-gray': '#f8fafc',
      }
    },
  },
  plugins: [],
}