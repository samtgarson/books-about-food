import {
  MjmlColumn,
  MjmlSection,
  MjmlText,
  MjmlWrapper
} from '@faire/mjml-react'
import { fontSize } from '../theme'

export default function Footer() {
  return (
    <>
      <MjmlWrapper backgroundColor="#fff" fullWidth padding="32px 20px 24px">
        <MjmlSection>
          <MjmlColumn>
            <MjmlText fontSize={fontSize.xs}>
              Copyright © Books About Food {new Date().getFullYear()}
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
    </>
  )
}
