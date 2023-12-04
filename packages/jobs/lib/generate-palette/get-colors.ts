import { Hsl } from '@books-about-food/shared/utils/types'
import { Palette, Swatch, Vec3 } from '@vibrant/color'
import Vibrant from '@vibrant/core'
import { BasicPipeline } from '@vibrant/core/lib/pipeline'
import { Generator } from '@vibrant/generator'
import MMCQ from '@vibrant/quantizer-mmcq'
import { SharpImage } from './image-class'

Vibrant.DefaultOpts.quantizer = 'mmcq'
Vibrant.DefaultOpts.generators = ['default']
Vibrant.DefaultOpts.filters = ['default']
Vibrant.DefaultOpts.ImageClass = SharpImage

const defaultFilter = (r: number, g: number, b: number, a: number) =>
  a >= 125 && !(r > 250 && g > 250 && b > 250)

const DefaultGenerator: Generator = (swatches: Array<Swatch>): Palette => {
  const maxPopulation = _findMaxPopulation(swatches)
  const sorted = swatches.sort((a, b) => b.population - a.population)
  const result: Array<Swatch | null> = []
  for (let i = 0; i < 4; i++) {
    const s = sorted.shift()
    if (!s) break
    const percentage = s.population / maxPopulation
    if (i === 0 || percentage >= 0.3) result.push(s)
  }

  return {
    Vibrant: result[0] || null,
    DarkVibrant: result[1] || null,
    LightVibrant: result[2] || null,
    Muted: result[3] || null,
    DarkMuted: result[4] || null,
    LightMuted: sorted.shift() || null
  }
}

function _findMaxPopulation(swatches: Array<Swatch>): number {
  let p = 0

  swatches.forEach((s) => {
    p = Math.max(p, s.population)
  })

  return p
}

const pipeline = new BasicPipeline().filter
  .register('default', defaultFilter)
  .quantizer.register('mmcq', MMCQ)
  .generator.register('default', DefaultGenerator)

Vibrant.use(pipeline)

const toHsl = (input: Vec3): Hsl => ({
  h: input[0] * 360,
  s: input[1] * 100,
  l: input[2] * 100
})

export const getColors = async (src: string) => {
  const { LightMuted, ...result } = await Vibrant.from(src)
    .maxColorCount(15)
    .getPalette()

  const backgroundColor = LightMuted ? toHsl(LightMuted.hsl) : undefined
  const palette = Object.values(result)
    .filter((color): color is Swatch => color !== null)
    .map((s) => toHsl(s.hsl))
  return { backgroundColor, palette }
}
