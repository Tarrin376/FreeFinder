/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{jsx,tsx}"],
  theme: {
    extend: {
        colors: {
            'main-purple': '#714cfe',
            'main-purple-hover': '#7f5efe',
            'main-white': '#fafafa',
            'light-gray': '#DDDDDD',
            'nav-search-gray': '#cdcdcd',
            'very-light-gray': '#EBEBEB',
            'very-light-gray-hover': '#E6E6E6',
            'main-black': '#212121',
            'paragraph-text': '#4b4b4b',
            'side-text-gray': '#879198',
            'main-black-hover': 'rgba(51, 51, 51, 1)',
            'error-red': '#B00020',
            'pop-up-bg': 'rgba(149, 149, 149, 0.10)',
            'rating-text': 'rgba(255, 194, 0, 1)',
            'main-white-hover': '#f8f8f8'
        },
        dropShadow: {
            'search-bar': '0px 0px 1px #DDDDDD',
        },
        boxShadow: {
            'pop-up': '0px 0px 1px 0px rgba(0, 0, 0, 0.17), 0px 0px 14px 3px rgba(0, 0, 0, 0.12), 0px 8px 10px 0px rgba(0, 0, 0, 0.14)',
            'post': '0px 3px 10px -7px rgba(0, 0, 0, 0.42)',
            'profile-page-container': '0px 1px 8px -6px rgba(0, 0, 0, 0.62)'
        },
    },
    screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1338px',
        xxl: '1700px'
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/line-clamp'),
  ],
}
