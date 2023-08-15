import { FC } from 'react'

export type CentererProps = {
  id: string
  slideWidth: number
  lastSlideWidth?: number
  mdSlideWidth?: number
  mdLastSlideWidth?: number
  lgSlideWidth?: number
  lgLastSlideWidth?: number
}

export const Centerer: FC<CentererProps> = ({
  id,
  slideWidth,
  mdSlideWidth,
  lgSlideWidth,
  lastSlideWidth = slideWidth,
  mdLastSlideWidth,
  lgLastSlideWidth
}) => (
  <>
    <style>{`
        #${id} li:first-child {
          margin-left: calc(50% - ${slideWidth / 2}px);
        }

        #${id} li:last-child {
          margin-right: calc(50% - ${lastSlideWidth / 2}px);
        }
      `}</style>
    {mdSlideWidth && (
      <style>{`
        @media (min-width: 768px) {
          #${id} li:first-child {
            margin-left: calc(50% - ${mdSlideWidth / 2}px);
          }

          #${id} li:last-child {
            margin-right: calc(50% - ${(mdLastSlideWidth || mdSlideWidth) / 2
        }px);
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

          #${id} li:last-child {
            margin-right: calc(50% - ${(lgLastSlideWidth || lgSlideWidth) / 2
        }px);
          }
        }
      `}</style>
    )}
  </>
)
