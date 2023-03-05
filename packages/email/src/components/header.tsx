import { MjmlColumn, MjmlSection, MjmlWrapper } from 'mjml-react'
import { colors, fontSize, fontWeight } from '../theme'
import Link from './link'
import { Logo } from './logo'
import Text from './text'

export default function Header() {
  return (
    <MjmlWrapper padding="40px 20px 0" backgroundColor={colors.white} fullWidth>
      <MjmlSection>
        <MjmlColumn>
          <Text align="left">
            <Link
              fontSize={fontSize.xl}
              fontWeight={fontWeight.bold}
              href="https://booksaboutfood.info"
              textDecoration="none"
            >
              <Logo />
            </Link>
          </Text>
        </MjmlColumn>
      </MjmlSection>
    </MjmlWrapper>
  )
}
