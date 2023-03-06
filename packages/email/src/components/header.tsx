import { MjmlColumn, MjmlSection, MjmlWrapper } from 'mjml-react'
import { colors, fontSize, fontWeight } from '../theme'
import Link from './link'
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
              <img
                src="https://books-about-food-web.vercel.app/wordmark.png"
                alt="Books About Food"
                width="280"
                height="50"
              />
            </Link>
          </Text>
        </MjmlColumn>
      </MjmlSection>
    </MjmlWrapper>
  )
}
