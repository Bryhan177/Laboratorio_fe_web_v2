/** @type {import('tailwindcss').Config} */
const primeui = require('tailwindcss-primeui');
module.exports = {
    darkMode: ['selector', '[class="app-dark"]'],
    content: ['./src/**/*.{html,ts,scss,css}', './index.html'],
    plugins: [primeui],
    theme: {
        screens: {
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            '2xl': '1920px'
        },
        extend: {
            animation: {
                'enter': 'enter 0.3s ease-out',
                'leave': 'leave 0.3s ease-in'
            },
            keyframes: {
                enter: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' }
                },
                leave: {
                    '0%': { opacity: '1', transform: 'scale(1)' },
                    '100%': { opacity: '0', transform: 'scale(0.9)' }
                }
            },
            maskImage: {
                'gradient-to-r': 'linear-gradient(to right, transparent, black)',
                'gradient-to-l': 'linear-gradient(to left, transparent, black)',
                'gradient-to-b': 'linear-gradient(to bottom, transparent, black)',
                'gradient-to-t': 'linear-gradient(to top, transparent, black)'
            }
        }
    }
};
