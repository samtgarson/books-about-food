import { ReactNode } from 'react'
import cn from 'classnames'

const colors = {
  white: 'bg-white',
  lime: 'bg-primary-lime',
  purple: 'bg-primary-purple',
  grey: 'bg-neutral-grey'
}

export type TagProps = {
  children: ReactNode
  className?: string
  color?: keyof typeof colors
}

export function Tag({ children, className, color = 'white' }: TagProps) {
  return (
    <div className={cn('all-caps px-3 py-1.5', className, colors[color])}>
      {children}
    </div>
  )
}
