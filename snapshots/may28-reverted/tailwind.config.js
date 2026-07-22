/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#2C2C2A',
          soft: '#3C3C3A',
          muted: '#5A5A58',
          faint: '#888780',
        },
      },
    },
  },
  plugins: [],
};
