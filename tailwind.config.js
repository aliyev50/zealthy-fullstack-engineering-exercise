/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#05807f',
        secondary: '#00a8ff',
        teal: {
          500: '#05807f',
          600: '#04706f',
          700: '#035c5c',
        }
      },
    },
  },
  plugins: [],
} 