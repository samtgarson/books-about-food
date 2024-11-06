import cn from 'classnames'
import Image from 'next/image'
import logo from 'src/app/(main)/top-ten/2024/home-logo.svg'
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
            'flex flex-col lg:flex-row lg:justify-between items-center z-10 transition-opacity mx-auto lg:mx-0 w-full gap-12',
            !current && 'opacity-0'
          )}
        >
          <div
            className={cn(
              'flex flex-col justify-center items-center lg:items-start gap-8'
            )}
          >
            <h2 className="text-24 sm:text-40 lg:text-48 mobile-only:text-center">
              Voting for the 2024 Top 10
              <br />
              cookbooks is now open!
            </h2>
            <Button variant="tertiary">Vote Now</Button>
          </div>
          <Image
            src={logo}
            aria-hidden
            className={cn(
              'lg:mr-[15vw] order-first lg:order-none mobile-only:w-44'
            )}
            alt="BAF Top 10"
          />
        </div>
        <Image
          src={bg}
          aria-hidden
          className={cn(
            'absolute -mx-4 md:-mx-16 inset-0 w-[calc(100%+8em)] h-[calc(100%-1px)] object-cover object-right z-0 transition-opacity ease-out',
            !current && 'opacity-0'
          )}
          alt="BAF Top 10"
        />
      </>
    </FeatureCarouselSlide>
  )
}
