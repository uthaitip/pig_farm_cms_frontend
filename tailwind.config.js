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
          DEFAULT: '#22c55e',
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
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
