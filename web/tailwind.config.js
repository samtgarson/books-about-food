/* eslint-disable import/no-extraneous-dependencies */
const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-graphik)', ...defaultTheme.fontFamily.sans]
      }
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#1D1D1B',
      white: '#fff',
      grey: '#F0EEEB'
    },
    fontWeight: {
      normal: 400,
      medium: 500
    },
    fontSize: {
      10: ['10px', '12px'],
      12: ['12px', '14px'],
      14: ['14px', '17px'],
      16: ['16px', '19px'],
      18: ['18px', '28px'],
      20: ['20px', '24px'],
      24: ['24px', '29px'],
      28: ['28px', '34px'],
      32: ['32px', '38px'],
      48: ['48px', '58px']
    },
    autoGrid: {
      md: '150px',
      lg: '200px'
    }
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'auto-grid': (value) => ({
            gridTemplateColumns: `repeat(auto-fill, minmax(min(${value}, 100%), 1fr))`
          })
        },
        { values: theme('autoGrid') }
      )
    })
  ]
}
