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
                'leave': 'leave 0.3s ease-in',
                'welcome-orbit': 'welcome-orbit 8s linear infinite',
                'welcome-fade-up': 'welcome-fade-up 0.6s ease-out both',
                'welcome-scale-in': 'welcome-scale-in 0.5s ease-out both',
                'welcome-pulse': 'welcome-pulse 2s ease-in-out infinite',
                'hero-fade-up': 'welcome-fade-up 0.7s ease-out both',
                'badge-spin-fast': 'spin 3s linear infinite'
            },
            keyframes: {
                enter: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' }
                },
                leave: {
                    '0%': { opacity: '1', transform: 'scale(1)' },
                    '100%': { opacity: '0', transform: 'scale(0.9)' }
                },
                'welcome-orbit': {
                    '0%': { transform: 'rotate(0deg) translateX(72px) rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg) translateX(72px) rotate(-360deg)' }
                },
                'welcome-fade-up': {
                    '0%': { opacity: '0', transform: 'translateY(24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                'welcome-scale-in': {
                    '0%': { opacity: '0', transform: 'scale(0.85)' },
                    '100%': { opacity: '1', transform: 'scale(1)' }
                },
                'welcome-pulse': {
                    '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(40, 160, 174, 0.4)' },
                    '50%': { transform: 'scale(1.05)', boxShadow: '0 0 0 12px rgba(40, 160, 174, 0)' }
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
