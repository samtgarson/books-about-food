import cn from 'classnames'
import format from 'date-fns/format'
import { useEffect } from 'react'
import { mouseAttrs } from '../atoms/mouse'
import { useNav } from '../nav/context'
import { FeatureCarouselSlide } from './slide'
import { useFeatureCarouselItem } from './use-feature-carousel-item'

export type FeatureCarouselTitleProps = {
  index: number
  currentIndex: number
  id: string
  onClick: () => void
}

export function Title({
  index,
  currentIndex,
  id,
  onClick
}: FeatureCarouselTitleProps) {
  const { position, display, attrs, current, className, mouseProps } =
    useFeatureCarouselItem({
      index,
      currentIndex,
      centered: false,
      imageWidth: 100,
      title: true
    })
  const { setTheme } = useNav()

  useEffect(() => {
    if (!['prev', 'current', 'next'].includes(position)) return
    setTheme(position === 'current' ? 'dark' : 'light')
  }, [position, setTheme])

  if (!display) return null
  const date = format(new Date(), 'EEE d MMM')

  return (
    <FeatureCarouselSlide
      id={id}
      {...attrs}
      className={cn(
        className,
        'justify-center lg:justify-between',
        current && 'pointer-events-none',
        !current && 'cursor-pointer'
      )}
      onClick={onClick}
      position={position}
      {...mouseAttrs({
        ...mouseProps,
        mode: mouseProps.mode === 'clickable' ? 'default' : mouseProps.mode
      })}
    >
      <div
        className={cn(
          'pointer-events-none flex flex-col gap-4 transition pr-36',
          current ? 'text-white' : 'opacity-10'
        )}
      >
        <p className="all-caps">{date}</p>
        <h2 className="text-64">Today&apos;s Specials</h2>
      </div>
    </FeatureCarouselSlide>
  )
}
