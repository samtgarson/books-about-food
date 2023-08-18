import { FC, ComponentProps } from 'react'
import cn from 'classnames'

export const ContactLink: FC<ComponentProps<'a'>> = ({
  className,
  ...props
}) => (
  <a
    href="mailto:aboutcookbooks@gmail.com"
    target="_blank"
    rel="noreferrer"
    className={cn('underline', className)}
    {...props}
  />
)
