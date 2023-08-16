import { FC } from 'react'

export type CentererProps = {
  id: string
  slideWidth: number | false
  lastSlideWidth?: number | false
  mdSlideWidth?: number | false
  mdLastSlideWidth?: number | false
  lgSlideWidth?: number | false
  lgLastSlideWidth?: number | false
}

export const Centerer: FC<CentererProps> = ({
  id,
  slideWidth,
  mdSlideWidth,
  lgSlideWidth,
  lastSlideWidth = slideWidth,
  mdLastSlideWidth = mdSlideWidth,
  lgLastSlideWidth
}) => (
  <>
    {slideWidth && (
      <style>{`
        #${id} li:first-child {
          margin-left: calc(50% - ${slideWidth / 2}px);
        }
      `}</style>
    )}
    {lastSlideWidth && (
      <style>{`
        #${id} li:last-child {
          margin-right: calc(50% - ${lastSlideWidth / 2}px);
        }
      `}</style>
    )}
    {mdSlideWidth && (
      <style>{`
        @media (min-width: 768px) {
          #${id} li:first-child {
            margin-left: calc(50% - ${mdSlideWidth / 2}px);
          }
        }
      `}</style>
    )}
    {mdLastSlideWidth && (
      <style>{`
        @media (min-width: 768px) {
          #${id} li:last-child {
            margin-right: calc(50% - ${mdLastSlideWidth / 2}px);
          }
        }
      `}</style>
    )}
    {lgSlideWidth && (
      <style>{`
        @media (min-width: 1280px) {
          #${id} li:first-child {
            margin-left: calc(50% - ${lgSlideWidth / 2}px);
          }
        }
      `}</style>
    )}
    {lgLastSlideWidth && (
      <style>{`
        @media (min-width: 1280px) {
          #${id} li:last-child {
            margin-right: calc(50% - ${lgLastSlideWidth / 2}px);
          }
        }
      `}</style>
    )}
  </>
)
