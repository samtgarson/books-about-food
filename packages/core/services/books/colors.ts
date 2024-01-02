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
