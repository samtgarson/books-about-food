import { FC, memo, useContext } from 'react'
import { CarouselContext } from './context'

export type CentererProps = {
  slideWidth: number | false
  lastSlideWidth?: number | false
  mdSlideWidth?: number | false
  mdLastSlideWidth?: number | false
  lgSlideWidth?: number | false
  lgLastSlideWidth?: number | false
}

export const Centerer: FC<CentererProps> = memo(function Centerer({
  slideWidth,
  mdSlideWidth,
  lgSlideWidth,
  lastSlideWidth = slideWidth,
  mdLastSlideWidth = mdSlideWidth,
  lgLastSlideWidth = lgSlideWidth
}) {
  const { id } = useContext(CarouselContext)
  let __html = ''
  if (slideWidth) {
    __html += `
        [id="${id}"] li:first-child {
          margin-left: calc(50% - ${slideWidth / 2}px);
        }
      `
  }
  if (lastSlideWidth) {
    __html += `
        [id="${id}"] li:last-child {
          margin-right: calc(50% - ${lastSlideWidth / 2}px);
        }
      `
  }
  if (mdSlideWidth) {
    __html += `
        @media (min-width: 768px) {
          [id="${id}"] li:first-child {
            margin-left: calc(50% - ${mdSlideWidth / 2}px);
          }
        }
      `
  }
  if (mdLastSlideWidth) {
    __html += `
        @media (min-width: 768px) {
          [id="${id}"] li:last-child {
            margin-right: calc(50% - ${mdLastSlideWidth / 2}px);
          }
        }
      `
  }
  if (lgSlideWidth) {
    __html += `
        @media (min-width: 1280px) {
          [id="${id}"] li:first-child {
            margin-left: calc(50% - ${lgSlideWidth / 2}px);
          }
        }
      `
  }
  if (lgLastSlideWidth) {
    __html += `
        @media (min-width: 1280px) {
          [id="${id}"] li:last-child {
            margin-right: calc(50% - ${lgLastSlideWidth / 2}px);
          }
        }
      `
  }

  return <style dangerouslySetInnerHTML={{ __html }} />
})
