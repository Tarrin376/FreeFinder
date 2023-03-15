const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{jsx,tsx}"],
  theme: {
    extend: {
        colors: {
            'main-red': '#F00C3C',
            'main-white': '#fafafa',
            'light-gray': '#DDDDDD',
            'nav-search-gray': '#cdcdcd',
            'main-purple-hover': '#731EEE',
            'very-light-gray': '#EBEBEB',
            'very-light-gray-hover': '#E6E6E6',
            'main-black': '#212121',
            'search-text': '#606163',
            'side-text-gray': '#7B7B7B',
            'invalid-input-red': '#C11103',
            'main-black-hover': 'rgba(51, 51, 51, 1)'
        },
        dropShadow: {
            'search-bar': '0px 0px 1px #DDDDDD',
        },
        boxShadow: {
            'pop-up': '0px 4px 5px 0px rgba(0, 0, 0, 0.2), 0px 3px 14px 3px rgba(0, 0, 0, 0.12), 0px 8px 10px 1px rgba(0, 0, 0, 0.14)'
        },
        fontFamily: {
            roboto: ['"Open Sans"', ...defaultTheme.fontFamily.sans]
        }
    },
    screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1338px',
        xxl: '1500px'
    },
  },
  plugins: [],
}
