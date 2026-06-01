/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'bg-dcc-topbar',
    'bg-dcc-bar',
    'bg-dcc-auth',
    'text-dcc-accent',
  ],
  theme: {
    screens: {
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        dcc: {
          primary: '#5113D7',
          'primary-hover': '#3F0EAA',
          accent: '#00D1FF',
          topbar: '#1A1523',
          bar: '#1A1523',
          footer: '#1A1523',
          auth: '#F8F9FD',
        },
      },
    },
  },
  plugins: [],
}
