import { ButtonHTMLAttributes, FC } from 'react'
import cn from 'classnames'

export type PillProps = {
  selected?: boolean
  disabled?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

export const Pill: FC<PillProps> = ({
  children,
  selected,
  className,
  disabled,
  ...props
}) => (
  <button
    {...props}
    className={cn(
      'px-4 py-2.5 rounded-full text-14 border border-black flex items-center justify-center leading-none flex-shrink-0',
      selected ? 'bg-black text-white' : 'text-black',
      disabled && 'pointer-events-none',
      className
    )}
  >
    {children}
  </button>
)
