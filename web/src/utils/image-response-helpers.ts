import { readFile } from 'fs/promises'
import { ImageResponse } from 'next/og'

type FontOptions = Exclude<
  ConstructorParameters<typeof ImageResponse>[1],
  undefined
>['fonts']

const regularFontUrl = new URL(
  '../assets/fonts/Graphik-Regular-Trial.otf',
  new URL(import.meta.url)
)
const mediumFontUrl = new URL(
  '../assets/fonts/Graphik-Medium-Trial.otf',
  new URL(import.meta.url)
)

export async function loadFonts(): Promise<FontOptions> {
  const [regularData, mediumData] = await Promise.all([
    readFile(regularFontUrl),
    readFile(mediumFontUrl)
  ])

  return [
    {
      data: regularData,
      name: 'Graphik',
      style: 'normal',
      weight: 400
    },
    {
      data: mediumData,
      name: 'Graphik',
      style: 'normal',
      weight: 700
    }
  ]
}
