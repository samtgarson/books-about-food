export const colors = {
  transparent: 'transparent',
  current: 'currentColor',
  black: '#1D1D1B',
  white: '#fff',
  grey: '#F0EEEB',
  sand: '#E7E5E2',
  khaki: '#DDD8D1',
  neutralGrey: '#585858'
}

export const fontSize = {
  sm: '12px',
  base: '14px',
  md: '18px',
  lg: '20px',
  xl: '24px',
  xxl: '28px'
}

export const lineHeight = {
  tight: '115%',
  base: '150%',
  relaxed: '185%'
}

export const fontWeight = {
  normal: '400',
  bold: '700'
}

export const borderRadius = {
  sm: 8,
  base: 16,
  full: 9999
}

export const fontFamily = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
}

export const spacing = {
  s0: 0,
  s1: 4,
  s3: 8,
  s4: 12,
  s5: 16,
  s6: 20,
  s7: 24,
  s8: 32,
  s9: 40,
  s10: 48,
  s11: 56
} as const

export const screens = {
  xs: '480px',
  sm: '640px'
}

export const themeDefaults = {
  fontFamily: fontFamily.sans,
  lineHeight: lineHeight.base,
  fontWeight: fontWeight.normal,
  fontSize: fontSize.base,
  color: colors.black,
  padding: '0'
}
