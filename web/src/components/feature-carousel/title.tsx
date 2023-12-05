import cn from 'classnames'
import format from 'date-fns/format'
import { motion } from 'framer-motion'
import { mouseAttrs } from '../atoms/mouse'
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
  onClick?: () => void
}) {
  const { display, attrs, current, next, prev, className, mouseProps } =
    useFeatureCarouselItem({
      index,
      currentIndex,
      centered: false,
      imageWidth: 100
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
        '!pointer-events-auto min-w-[65vw] justify-center lg:justify-between',
        current && 'lg:-ml-[7vw] z-0',
        !current && 'cursor-pointer'
      )}
      onClick={(e) => {
        e.preventDefault()
        if (!current) onClick?.()
      }}
      {...mouseAttrs({
        ...mouseProps,
        mode: next ? 'next' : prev ? 'prev' : 'default'
      })}
    >
      <div
        className={cn(
          'pointer-events-none flex flex-col gap-4 transition',
          current ? 'text-white' : 'opacity-10'
        )}
      >
        <p className="all-caps">{date}</p>
        <h2 className="text-64">Today&apos;s Specials</h2>
      </div>
    </motion.div>
  )
}
