import { Button as EmailButton } from '@react-email/components'
import cx from 'classnames'
import React from 'react'

type ButtonProps = React.ComponentProps<typeof EmailButton>

export default function Button(props: ButtonProps) {
  return (
    <EmailButton
      className={cx(
        props.className,
        'py-3 px-5 border text-16 border-solid border-black bg-white'
      )}
      {...props}
    />
  )
}
