import { Loader as LoaderIcon } from 'react-feather'
import cn from 'classnames'

export const Loader = ({ className }: { className?: string }) => (
  <LoaderIcon
    strokeWidth={1}
    size={24}
    className={cn('animate-spin', className)}
  />
)
