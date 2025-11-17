/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      '../web/app/**/*.{ts,tsx}',
      '../ui/src/**/*.{ts,tsx}',
    ],
    theme: {
      extend: {},
    },
    plugins: [require('tailwind-animate')],
  };