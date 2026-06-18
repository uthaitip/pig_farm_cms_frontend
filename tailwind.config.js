/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './node_modules/flowbite/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5F7A61',
          50:  '#f2f5f2',
          100: '#dce5dd',
          200: '#beccbf',
          300: '#96ab97',
          400: '#7a927b',
          500: '#5F7A61',
          600: '#4c634e',
          700: '#3c4e3d',
          800: '#2d3b2e',
        },
        appsuccess:  '#3A9B38',
        apperror:    '#FF0000',
        appwarning:  '#FF8A00',
        appgray:     '#999999',
        appblack:    '#333333',
        appborder:   '#EEEEEE',
        appdisabled: '#DDDDDD',
      },
      fontFamily: {
        sans:    ['Sarabun', 'sans-serif'],
        sarabun: ['Sarabun', 'sans-serif'],
      },
    },
  },
  plugins: [require('flowbite/plugin')],
}
