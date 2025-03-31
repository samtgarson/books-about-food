import { motion } from 'framer-motion'
import Link from 'next/link'
import { ComponentProps } from 'react'
import { CarouselPosition } from './use-feature-carousel-item'

const MotionLink = motion(Link)

export function FeatureCarouselSlide({
  id,
  href = '#',
  className,
  position,
  onClick,
  children,
  ...attrs
}: {
  position: CarouselPosition
  onClick: () => void
  href?: string
} & Omit<ComponentProps<typeof MotionLink>, 'onClick' | 'href'>) {
  return (
    <MotionLink
      layoutId={id}
      data-position={position}
      layout="position"
      href={position == 'current' ? href : '#'}
      {...attrs}
      className={className}
      onClick={(e) => {
        if (position === 'current') return true
        e.preventDefault()
        if (onClick) setTimeout(onClick, 0)
        return false
      }}
      title={
        position === 'next'
          ? 'Next'
          : position === 'prev'
            ? 'Previous'
            : undefined
      }
    >
      {children}
    </MotionLink>
  )
}
