const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{jsx,tsx}"],
  theme: {
    extend: {
        colors: {
            'main-blue': '#2374E1',
            'main-blue-hover': '#2f7ce3',
            'main-white': '#fefefe',
            'light-gray': '#e1e3e8',
            'nav-search-gray': '#cdcdcd',
            'very-light-gray': '#EBEBEB',
            'very-light-gray-hover': '#E6E6E6',
            'main-black': '#292929',
            'paragraph-text': '#4b4b4b',
            'side-text-gray': '#879198',
            'main-black-hover': '#323232',
            'pop-up-bg': 'rgba(0, 0, 0, 0.16)',
            'main-white-hover': '#f9f9f9',
            'error-red': 'rgba(255, 0, 0, 0.08)',
            'error-red-hover': 'rgba(255, 0, 0, 0.10)',
            'error-text': '#F43C3C',
            'light-green': '#36BF54',
            'light-border-gray': '#e2e2e2',
            'disabled-gray': '#E0E0E0'
        },
        dropShadow: {
            'search-bar': '0px 0px 1px #DDDDDD',
        },
        boxShadow: {
            'pop-up': '0px 0px 14px 3px rgba(0, 0, 0, 0.10), 0px 8px 10px 0px rgba(0, 0, 0, 0.04)',
            'medium': '0px 0px 5px 2px rgba(0, 0, 0, 0.10), 0px 0px 5px 0px rgba(0, 0, 0, 0.04)',
            'post': 'rgba(0, 0, 0, 0.10) 0px 2px 4px 0px',
            'info-component': 'rgba(0, 0, 0, 0.05) 0px 1px 4px 0px',
            'profile-page-container': '0px 1px 8px -6px rgba(0, 0, 0, 0.62)'
        },
        fontFamily: {
            railway: ['"Nunito Sans"', ...defaultTheme.fontFamily.sans]
        }
    },
    screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1338px',
        xxl: '1600px'
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/line-clamp'),
  ],
}
