import cn from 'classnames'
import { ComponentProps, FC } from 'react'

export const contactProps = (subject: string) => ({
  href: `mailto:jamin@booksabout.food?subject=${encodeURIComponent(subject)}`,
  target: '_blank',
  rel: 'noreferrer'
})

export const ContactLink: FC<ComponentProps<'a'> & { subject?: string }> = ({
  className,
  subject = 'General enquiry',
  ...props
}) => (
  <a
    {...contactProps(subject)}
    className={cn('underline', className)}
    {...props}
  />
)
