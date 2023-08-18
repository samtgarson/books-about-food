import { FC, ComponentProps } from 'react'
import cn from 'classnames'

export const ContactLink: FC<ComponentProps<'a'> & { subject?: string }> = ({
  className,
  subject = 'General enquiry',
  ...props
}) => (
  <a
    href={`mailto:aboutcookbooks@gmail.com?subject=${encodeURIComponent(
      subject
    )}`}
    target="_blank"
    rel="noreferrer"
    className={cn('underline', className)}
    {...props}
  />
)
