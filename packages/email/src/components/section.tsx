import { MjmlColumn, MjmlSection } from '@faire/mjml-react'
import { ComponentProps, ReactNode } from 'react'
import { colors, spacing } from '../theme'

export function Section({
  white,
  box,
  children,
  ...props
}: {
  white?: boolean
  box?: boolean
  children: ReactNode
} & ComponentProps<typeof MjmlSection>) {
  const spacier = white || box
  return (
    <MjmlSection {...props} paddingBottom={spacier ? spacing.s6 : undefined}>
      <MjmlColumn
        backgroundColor={white ? colors.white : colors.transparent}
        border={box ? '1px solid black' : undefined}
        padding={spacier ? `${spacing.s6}px ${spacing.s6}px 0px` : 0}
      >
        {children}
      </MjmlColumn>
    </MjmlSection>
  )
}
