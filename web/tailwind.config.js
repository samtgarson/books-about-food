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
      },
      keyframes: {
        'collapsible-open': {
          from: { height: 0 },
          to: { height: 'var(--radix-collapsible-content-height)' }
        },
        'collapsible-closed': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 }
        },
        'fade-out': {
          from: { opacity: 1 },
          to: { opacity: 0 }
        },
        'fade-slide-in': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        'collapsible-open': 'collapsible-open 0.3s ease-out both',
        'collapsible-closed': 'collapsible-closed 0.3s 0.1s ease-out both',
        'fade-in': 'fade-in 0.2s ease-out both',
        'fade-out': 'fade-out 0.2s ease-out both',
        'fade-slide-in': 'fade-slide-in 0.4s ease-out both'
      }
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#1D1D1B',
      white: '#fff',
      grey: '#F0EEEB',
      sand: '#E7E5E2',
      darkSand: '#C1BFBD'
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
      lg: '250px',
      xl: '350px'
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
