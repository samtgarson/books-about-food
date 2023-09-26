'use client'
import cn from 'classnames'
import { Grid, List } from 'react-feather'

export type DisplayToggleProps = {
  className?: string
  display?: 'grid' | 'list'
  onChange?: (display: 'grid' | 'list') => void
}

export function DisplayToggle({
  className,
  display,
  onChange
}: DisplayToggleProps) {
  return (
    <button
      className={cn('flex gap-2 items-center', className)}
      onClick={() => onChange?.(display === 'list' ? 'grid' : 'list')}
    >
      <span className={cn('p-1', display === 'grid' && 'bg-white')}>
        <Grid strokeWidth={1} />
      </span>
      <span className={cn('p-1', display === 'list' && 'bg-white')}>
        <List strokeWidth={1} />
      </span>
    </button>
  )
}
