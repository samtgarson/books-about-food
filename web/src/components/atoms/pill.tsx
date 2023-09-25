import cn from 'classnames'
import { ComponentProps, forwardRef } from 'react'

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
        'text-14 flex flex-shrink-0 items-center justify-center rounded-full border border-black px-4 py-3 leading-none',
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
