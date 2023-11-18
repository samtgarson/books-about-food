import { MjmlText } from '@faire/mjml-react'
import cx from 'classnames'
import React from 'react'
import { spacing, fontSize as themeFontSize } from '../theme'

type TextProps = {
  maxWidth?: number
  fontSize?: keyof typeof themeFontSize
} & Omit<React.ComponentProps<typeof MjmlText>, 'fontSize'>

export default function Text({
  children,
  maxWidth,
  fontSize = 'base',
  ...props
}: TextProps) {
  if (maxWidth) {
    return (
      <MjmlText
        {...props}
        fontSize={themeFontSize[fontSize]}
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
        fontSize={themeFontSize[fontSize]}
        paddingBottom={`${spacing.s6}px`}
        cssClass={cx(props.cssClass)}
      >
        {children}
      </MjmlText>
    )
}
