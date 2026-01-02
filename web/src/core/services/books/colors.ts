export enum NamedColor {
  red = 'red',
  orange = 'orange',
  yellow = 'yellow',
  lime = 'lime',
  green = 'green',
  cyan = 'cyan',
  blue = 'blue',
  purple = 'purple',
  pink = 'pink',
  brown = 'brown',
  gray = 'gray',
  black = 'black',
  white = 'white'
}

export type OddColors =
  | NamedColor.white
  | NamedColor.black
  | NamedColor.brown
  | NamedColor.gray

export const namedHueMap: Record<NamedColor, number> = {
  red: 0,
  orange: 30,
  yellow: 55,
  lime: 90,
  green: 120,
  cyan: 180,
  blue: 230,
  purple: 270,
  pink: 300,
  brown: 15,
  gray: 0,
  black: 0,
  white: 0
}
