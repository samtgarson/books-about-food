import { readFile } from 'fs/promises'
import { ImageResponse } from 'next/og'
import { join } from 'node:path'

type FontOptions = Exclude<
  ConstructorParameters<typeof ImageResponse>[1],
  undefined
>['fonts']

export async function loadFonts(): Promise<FontOptions> {
  const [regularData, mediumData] = await Promise.all([
    readFile(join(process.cwd(), 'src/assets/fonts/Graphik-Regular-Trial.otf')),
    readFile(join(process.cwd(), 'src/assets/fonts/Graphik-Medium-Trial.otf'))
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
