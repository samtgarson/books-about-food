'use client'
import cn from 'classnames'
import { Grid, List } from 'src/components/atoms/icons'
import { useListDisplay } from './list-context'

export type DisplayToggleProps = {
  className?: string
}

export function DisplayToggle({ className }: DisplayToggleProps) {
  const { display, setDisplay } = useListDisplay()

  return (
    <button
      className={cn('flex items-center gap-2', className)}
      onClick={() => setDisplay(display === 'list' ? 'grid' : 'list')}
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
