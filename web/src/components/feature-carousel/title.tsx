import { motion } from 'framer-motion'
import { useFeatureCarouselItem } from './use-feature-carousel-item'
import cn from 'classnames'
import format from 'date-fns/format'

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
  const { display, attrs, current } = useFeatureCarouselItem({
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
      className={cn(attrs.className, 'h-96')}
      onClick={(e) => {
        e.preventDefault()
        if (!current) onClick?.()
      }}
    >
      <div className="flex flex-col gap-4">
        <p className="all-caps">{date}</p>
        <h2 className="text-64">Today&apos;s Specials</h2>
      </div>
    </motion.div>
  )
}
