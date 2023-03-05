import React from 'react'
import cx from 'classnames'
import { MjmlButton } from 'mjml-react'

import { colors, fontSize, lineHeight, spacing } from '../theme'

type ButtonProps = React.ComponentProps<typeof MjmlButton>

export default function Button(props: ButtonProps) {
  return (
    <MjmlButton
      lineHeight={lineHeight.tight}
      fontSize={fontSize.base}
      innerPadding="10px 16px"
      paddingBottom={spacing.s8}
      align="left"
      backgroundColor={colors.white}
      border="1px solid #000000"
      borderRadius="0px"
      color={colors.black}
      cssClass={cx('button', props.cssClass)}
      {...props}
    />
  )
}
