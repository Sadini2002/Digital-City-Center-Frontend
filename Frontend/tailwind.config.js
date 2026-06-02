/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6d28d9',
          50: '#f5f3ff',
          100: '#ede9fe',
        },
      },
    },
  },
  plugins: [],
}