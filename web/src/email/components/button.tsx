import { Button as EmailButton } from '@react-email/components'
import cx from 'classnames'
import React from 'react'

type ButtonProps = React.ComponentProps<typeof EmailButton>

export default function Button(props: ButtonProps) {
  return (
    <EmailButton
      className={cx(
        props.className,
        'border border-solid border-black bg-white px-5 py-3 text-16'
      )}
      {...props}
    />
  )
}
