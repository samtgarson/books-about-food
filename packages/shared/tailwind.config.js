/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'mobile-only': { max: '640px' },
        short: { raw: '(max-height: 650px)' }
      }
    }
  }
}
