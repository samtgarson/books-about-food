import cn from 'classnames'
import Image from 'next/image'
import logo from 'src/app/(frontend)/(main)/top-ten/2024/home-logo.svg'
import bg from 'src/app/(frontend)/(main)/top-ten/2024/home.svg'
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
            'z-10 mx-auto flex w-full flex-col items-center gap-12 transition-opacity lg:mx-0 lg:flex-row lg:justify-between',
            !current && 'opacity-0'
          )}
        >
          <div
            className={cn(
              'flex flex-col items-center justify-center gap-8 lg:items-start'
            )}
          >
            <h2 className="text-24 max-sm:text-center sm:text-40 lg:text-48">
              Voting for the 2024 Top 10
              <br />
              cookbooks is now open!
            </h2>
            <Button variant="tertiary">Vote Now</Button>
          </div>
          <Image
            src={logo}
            aria-hidden
            className={cn('order-first max-sm:w-44 lg:order-0 lg:mr-[15vw]')}
            alt="BAF Top 10"
          />
        </div>
        <Image
          src={bg}
          aria-hidden
          className={cn(
            'absolute inset-0 z-0 -mx-4 h-[calc(100%-1px)] w-[calc(100%+8em)] object-cover object-right transition-opacity ease-out md:-mx-16',
            !current && 'opacity-0'
          )}
          alt="BAF Top 10"
        />
      </>
    </FeatureCarouselSlide>
  )
}
