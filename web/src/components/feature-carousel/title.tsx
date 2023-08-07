import { motion } from 'framer-motion'
import { useFeatureCarouselItem } from './use-feature-carousel-item'
import cn from 'classnames'
import format from 'date-fns/format'
import { CircleLogo } from '../atoms/circle-logo'

export function Title({
  index,
  currentIndex,
  id,
  onClick
}: {
  index: number
  currentIndex: number
  id: string
  onClick?: () => void
}) {
  const { display, attrs, current, className } = useFeatureCarouselItem({
    index,
    currentIndex,
    centered: false
  })

  if (!display) return null
  const date = format(new Date(), 'EEE d MMM')

  return (
    <motion.div
      layoutId={id}
      layout="position"
      {...attrs}
      className={cn(
        className,
        '!pointer-events-auto justify-center lg:justify-between min-w-[65vw]',
        current && 'lg:-ml-[7vw]'
      )}
      onClick={(e) => {
        e.preventDefault()
        if (!current) onClick?.()
      }}
    >
      <div
        className={cn(
          'flex flex-col gap-4 transition',
          current ? 'text-white' : 'opacity-10'
        )}
      >
        <p className="all-caps">{date}</p>
        <h2 className="text-64">Today&apos;s Specials</h2>
      </div>
    </motion.div>
  )
}
