import cn from 'classnames'
import { ReactNode, type JSX } from 'react'

const colors = {
  white: 'bg-white',
  lime: 'bg-primary-lime',
  purple: 'bg-primary-purple',
  grey: 'bg-neutral-grey',
  red: 'bg-primary-red text-white'
}

export type TagProps = {
  children: ReactNode
  className?: string
  color?: keyof typeof colors
} & JSX.IntrinsicElements['div']

export function Tag({
  children,
  className,
  color = 'white',
  ...props
}: TagProps) {
  return (
    <div
      className={cn(
        'all-caps-sm sm:all-caps whitespace-nowrap px-3 py-1.5',
        className,
        colors[color]
      )}
      {...props}
    >
      {children}
    </div>
  )
}
