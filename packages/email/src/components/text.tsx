import React from 'react'
import cx from 'classnames'
import { MjmlText } from 'mjml-react'
import { spacing } from '../theme'

type TextProps = {
  maxWidth?: number
} & React.ComponentProps<typeof MjmlText>

export default function Text({ children, maxWidth, ...props }: TextProps) {
  if (maxWidth) {
    return (
      <MjmlText
        {...props}
        paddingBottom={`${spacing.s6}px`}
        cssClass={cx(props.cssClass)}
      >
        <div style={{ maxWidth }}>{children}</div>
      </MjmlText>
    )
  } else
    return (
      <MjmlText
        {...props}
        paddingBottom={`${spacing.s8}px`}
        cssClass={cx(props.cssClass)}
      >
        {children}
      </MjmlText>
    )
}
