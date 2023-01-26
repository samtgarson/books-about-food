import { ComponentProps, FC } from 'react'
import cn from 'classnames'

export type DetailProps = ComponentProps<'div'>

export const Detail: FC<DetailProps> = ({ children, className, ...props }) => {
  if (!children) return null
  return (
    <div
      className={cn(
        'border-y border-y-black w-100vw sm:max-w-md py-4 -mb-px -mx-5 sm:mx-0 px-5 sm:px-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
