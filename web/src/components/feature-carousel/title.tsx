import cn from 'classnames'
import format from 'date-fns/format'
import { mouseAttrs } from '../atoms/mouse'
import { FeatureCarouselSlide } from './slide'
import { useFeatureCarouselItem } from './use-feature-carousel-item'

export function Title({
  index,
  currentIndex,
  id,
  onClick
}: {
  index: number
  currentIndex: number
  id: string
  onClick: () => void
}) {
  const {
    position,
    display,
    attrs,
    current,
    next,
    prev,
    className,
    mouseProps
  } = useFeatureCarouselItem({
    index,
    currentIndex,
    centered: false,
    imageWidth: 100,
    title: true
  })

  if (!display) return null
  const date = format(new Date(), 'EEE d MMM')

  return (
    <FeatureCarouselSlide
      layoutId={id}
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
      href="#"
      {...mouseAttrs({
        ...mouseProps,
        mode: next ? 'next' : prev ? 'prev' : 'default'
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
