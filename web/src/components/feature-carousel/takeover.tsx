import cn from 'classnames'
import Image from 'next/image'
import bg from 'src/app/(main)/top-ten/2024/home.svg'
import { Button } from '../atoms/button'
import { mouseAttrs } from '../atoms/mouse'
import { FeatureCarouselSlide } from './slide'
import { useFeatureCarouselItem } from './use-feature-carousel-item'

export type FeatureCarouselTakeoverProps = {
  index: number
  currentIndex: number
  id: string
  onClick: () => void
}

export function Takeover({
  index,
  currentIndex,
  id,
  onClick
}: FeatureCarouselTakeoverProps) {
  const { position, display, attrs, current, className, mouseProps } =
    useFeatureCarouselItem({
      index,
      currentIndex,
      centered: false,
      imageWidth: 100,
      title: true
    })

  if (!display) return null

  return (
    <FeatureCarouselSlide
      id={id}
      {...attrs}
      className={cn(className, 'justify-center lg:justify-between')}
      onClick={onClick}
      href="/top-ten/2024"
      position={position}
      {...mouseAttrs(mouseProps)}
    >
      <>
        <div
          className={cn(
            'flex flex-col justify-center items-start gap-8 z-10 transition-opacity',
            !current && 'opacity-0'
          )}
        >
          <h2 className="text-48">
            Voting for the 2024 Top 10
            <br />
            cookbooks is now open!
          </h2>
          <Button variant="tertiary">Vote Now</Button>
        </div>
        <Image
          src={bg}
          aria-hidden
          className={cn(
            'absolute inset-0 w-full h-[calc(100%-1px)] object-cover object-right z-0 transition-opacity ease-out',
            !current && 'opacity-0'
          )}
          alt="BAF Top 10"
        />
      </>
    </FeatureCarouselSlide>
  )
}
