/* eslint-disable @typescript-eslint/no-require-imports */
const defaultTheme = require('tailwindcss/defaultTheme')

/*************************
 * DEPRECATED, required for react-email for now
 *************************/

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontWeight: {
      normal: 400,
      medium: 500
    },
    extend: {
      fontFamily: {
        sans: [
          'Graphik',
          'var(--font-graphik)',
          ...defaultTheme.fontFamily.sans
        ]
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
    fontSize: {
      10: ['10px', '12px'],
      12: ['12px', '18px'],
      14: ['14px', '22px'],
      16: ['16px', '24px'],
      18: ['18px', '26px'],
      20: ['20px', '28px'],
      24: ['24px', '32px'],
      32: ['32px', '42px'],
      40: ['40px', '48px'],
      48: ['48px', '58px'],
      64: ['64px', '77px']
    }
  }
}
