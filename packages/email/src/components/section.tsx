import { MjmlColumn, MjmlSection } from '@faire/mjml-react'
import { ReactNode } from 'react'
import { colors, spacing } from '../theme'

export function Section({
  white,
  children
}: {
  white?: boolean
  children: ReactNode
}) {
  return (
    <MjmlSection>
      <MjmlColumn
        backgroundColor={white ? colors.white : colors.transparent}
        padding={white ? `${spacing.s8}px ${spacing.s7}px` : 0}
      >
        {children}
      </MjmlColumn>
    </MjmlSection>
  )
}
