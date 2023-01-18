import { ComponentProps, FC } from 'react'

export type DetailProps = ComponentProps<'div'>

export const Detail: FC<DetailProps> = ({ children, ...props }) => {
  if (!children) return null
  return (
    <div
      className="border-y border-y-black w-full max-w-md py-4 -mb-px"
      {...props}
    >
      {children}
    </div>
  )
}
