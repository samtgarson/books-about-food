import { FC, memo, useContext } from 'react'
import { CarouselContext } from './context'

export type CentererProps = {
  slideWidth: number | false
  lastSlideWidth?: number | false
  mdSlideWidth?: number | false
  mdLastSlideWidth?: number | false
  lgSlideWidth?: number | false
  lgLastSlideWidth?: number | false
  xxlSlideWidth?: number | false
  xxlLastSlideWidth?: number | false
}

export const Centerer: FC<CentererProps> = memo(function Centerer({
  slideWidth,
  mdSlideWidth,
  lgSlideWidth,
  xxlSlideWidth,
  lastSlideWidth = slideWidth,
  mdLastSlideWidth = mdSlideWidth,
  lgLastSlideWidth = lgSlideWidth,
  xxlLastSlideWidth = xxlSlideWidth
}) {
  const { id } = useContext(CarouselContext)
  let __html = ''
  if (slideWidth) {
    __html += `
        [id="${id}"] li:first-child {
          padding-left: calc(50% - ${slideWidth / 2}px);
        }
      `
  }
  if (lastSlideWidth) {
    __html += `
        [id="${id}"] li:last-child {
          padding-right: calc(50% - ${lastSlideWidth / 2}px);
        }
      `
  }
  if (mdSlideWidth) {
    __html += `
        @media (min-width: 768px) {
          [id="${id}"] li:first-child {
            padding-left: calc(50% - ${mdSlideWidth / 2}px);
          }
        }
      `
  }
  if (mdLastSlideWidth) {
    __html += `
        @media (min-width: 768px) {
          [id="${id}"] li:last-child {
            padding-right: calc(50% - ${mdLastSlideWidth / 2}px);
          }
        }
      `
  }
  if (lgSlideWidth) {
    __html += `
        @media (min-width: 1280px) {
          [id="${id}"] li:first-child {
            padding-left: calc(50% - ${lgSlideWidth / 2}px);
          }
        }
      `
  }
  if (lgLastSlideWidth) {
    __html += `
        @media (min-width: 1280px) {
          [id="${id}"] li:last-child {
            padding-right: calc(50% - ${lgLastSlideWidth / 2}px);
          }
        }
      `
  }
  if (xxlSlideWidth) {
    __html += `
        @media (min-width: 1536px) {
          [id="${id}"] li:first-child {
            padding-left: calc(50% - ${xxlSlideWidth / 2}px);
          }
        }
      `
  }
  if (xxlLastSlideWidth) {
    __html += `
        @media (min-width: 1536px) {
          [id="${id}"] li:last-child {
            padding-right: calc(50% - ${xxlLastSlideWidth / 2}px);
          }
        }
      `
  }

  return <style dangerouslySetInnerHTML={{ __html }} />
})
