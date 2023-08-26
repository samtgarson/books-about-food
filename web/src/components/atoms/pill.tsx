import { ComponentProps, forwardRef } from 'react'
import cn from 'classnames'

export type PillProps = {
  selected?: boolean
  disabled?: boolean
} & ComponentProps<'span'>

export const Pill = forwardRef<HTMLSpanElement, PillProps>(
  ({ children, selected, className, disabled, ...props }, ref) => (
    <span
      ref={ref}
      {...props}
      className={cn(
        'px-4 py-3 rounded-full text-14 border border-black flex items-center justify-center leading-none flex-shrink-0',
        selected ? 'bg-black text-white' : 'text-black',
        disabled && 'pointer-events-none',
        className
      )}
    >
      {children}
    </span>
  )
)

Pill.displayName = 'Pill'
