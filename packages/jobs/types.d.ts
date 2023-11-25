declare module 'colorthief' {
  type Color = [number, number, number]
  export function getPalette(
    img: string,
    colorCount?: number,
    quality?: number
  ): Promise<Color[] | null>
}
