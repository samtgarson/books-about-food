import { ComponentProps, FC } from 'react'
import cn from 'classnames'

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
        'border-y border-y-black w-full py-4 -mb-px -mx-5 sm:mx-0 px-5 sm:px-0',
        {
          'sm:max-w-md': maxWidth,
          'min-w-[250px] basis-[calc(50%-8px)] flex-grow': column
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
