/** @type {import('tailwindcss').Config} */
const primeui = require('tailwindcss-primeui');
module.exports = {
  darkMode: ['class', '.app-dark'], // Activa el modo dark cuando se encuentre la clase "app-dark"
  content: ['./src/**/*.{html,ts,scss,css}', './index.html'],
  plugins: [primeui],
  theme: {
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1920px'
    }
  }
};
