import cn from 'classnames'
import { ComponentProps, FC } from 'react'

export type DetailProps = ComponentProps<'div'> & {
  maxWidth?: boolean
  column?: boolean
}

export const Detail: FC<DetailProps> = ({
  children,
  className,
  maxWidth,
  column,
  ...props
}) => {
  if (!children) return null
  return (
    <div
      className={cn(
        '-mx-5 -mb-px border-y border-y-black px-5 py-4 sm:mx-0 sm:px-0',
        {
          'sm:max-w-md': maxWidth,
          'min-w-[250px] flex-grow basis-full sm:basis-[calc(50%-8px)]': column
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
