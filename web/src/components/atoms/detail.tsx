import { ComponentProps, FC } from 'react'

export type DetailProps = ComponentProps<'div'>

export const Detail: FC<DetailProps> = ({ children, ...props }) => {
  if (!children) return null
  return (
    <div
      className="border-y border-y-black w-100vw sm:max-w-md py-4 -mb-px -mx-5 sm:mx-0 px-5 sm:px-0"
      {...props}
    >
      {children}
    </div>
  )
}
