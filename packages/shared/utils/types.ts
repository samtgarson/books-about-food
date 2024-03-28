export type Hsl = { h: number; s: number; l: number }

export const isHsl = (input: unknown): input is Hsl =>
  typeof input === 'object' &&
  input !== null &&
  'h' in input &&
  's' in input &&
  'l' in input

export const toColorString = (color: Hsl): string =>
  `hsl(${color.h}, ${color.s}%, ${color.l}%)`
