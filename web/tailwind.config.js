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
        },
        'scale-in': {
          from: { transform: 'scale(0.9)', opacity: 0 },
          to: { transform: 'scale(1)', opacity: 1 }
        },
        'accordion-open': {
          from: { height: '0px', opacity: 0 },
          to: { height: 'var(--radix-accordion-content-height)', opacity: 1 }
        },
        'accordion-close': {
          from: { height: 'var(--radix-accordion-content-height)', opacity: 1 },
          to: { height: '0px', opacity: 0 }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out both',
        'fade-out': 'fade-out 0.2s ease-out both',
        'fade-slide-in': 'fade-slide-in 0.4s ease-out both',
        'slow-spin': 'spin 60s linear infinite',
        'scale-in': 'scale-in 0.2s ease-out both',
        'accordion-open': 'accordion-open 0.2s ease-out both',
        'accordion-close': 'accordion-close 0.2s ease-out both'
      },
      screens: {
        'mobile-only': { max: '767px' }
      },
      zIndex: {
        nav: 60,
        sheet: 70,
        'interactive-ui': 80,
        'page-transition': 1000,
        'mouse-pointer': 1001
      }
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#1D1D1B',
      white: '#fff',
      grey: '#F0EEEB',
      sand: '#E7E5E2',
      khaki: '#DDD8D1',
      'neutral-grey': '#BDBFC2',
      'neutral-light-grey': '#F7F7F7',
      'blue-grey': '#EEF1F4',
      primary: {
        blue: '#839DFF',
        lime: '#C7E171',
        purple: '#C67CFF',
        red: '#ED7656',
        yellow: '#EACA36'
      },
      secondary: {
        blue: '#C3D6FF',
        yellow: '#FAE068'
      },
      tertiary: {
        blue: '#E0EAFF'
      }
    },
    fontWeight: {
      normal: 400,
      medium: 500
    },
    fontSize: {
      10: ['10px', '12px'],
      12: ['12px', '14px'],
      14: ['14px', '22px'],
      16: ['16px', '24px'],
      18: ['18px', '28px'],
      20: ['20px', '24px'],
      24: ['24px', '29px'],
      28: ['28px', '34px'],
      32: ['32px', '38px'],
      40: ['40px', '48px'],
      48: ['48px', '58px'],
      64: ['64px', '77px']
    },
    autoGrid: {
      md: '150px',
      lg: '250px',
      xl: '350px',
      '2xl': '450px'
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
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
