import cn from 'classnames'
import { Loader as LoaderIcon } from 'react-feather'

export const Loader = ({
  className,
  size = 24
}: {
  className?: string
  size?: number
}) => (
  <LoaderIcon
    strokeWidth={1}
    size={size}
    className={cn('animate-spin', className)}
  />
)
