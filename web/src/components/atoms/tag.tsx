import cn from 'classnames'
import { ReactNode } from 'react'

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
        'all-caps-sm sm:all-caps px-3 py-1.5 whitespace-nowrap',
        className,
        colors[color]
      )}
      {...props}
    >
      {children}
    </div>
  )
}
