import {
  Mjml,
  MjmlAll,
  MjmlAttributes,
  MjmlBody,
  MjmlColumn,
  MjmlHead,
  MjmlSection,
  MjmlStyle,
  MjmlWrapper
} from '@faire/mjml-react'
import { ReactNode } from 'react'
import { colors, screens, themeDefaults } from '../theme'
import Footer from './footer'
import Header from './header'
import Text from './text'

type BaseLayoutProps = {
  width?: number
  style?: string
  children: ReactNode
}

export default function BaseLayout({
  width = 600,
  children,
  style
}: BaseLayoutProps) {
  return (
    <Mjml>
      <MjmlHead>
        <MjmlAttributes>
          <MjmlAll {...themeDefaults} />
        </MjmlAttributes>
        <MjmlStyle>{`
          body {
            -webkit-font-smoothing: antialiased;
            min-width: 320px;
            background-color: ${colors.white};
          }
          a {
            color: inherit
          }
          .no-wrap {
            white-space: nowrap;
          }
          .hidden {
            display: none;
            max-width: 0px;
            max-height: 0px;
            overflow: hidden;
            mso-hide: all;
          }
          .lg-hidden {
            display: none;
            max-width: 0px;
            max-height: 0px;
            overflow: hidden;
            mso-hide: all;
          }

          /* Large screens */
          @media (min-width:${screens.xs}) {
            .sm-hidden {
              display: none;
              max-width: 0px;
              max-height: 0px;
              overflow: hidden;
              mso-hide: all;
            }
            .lg-hidden {
              display: block !important;
              max-width: none !important;
              max-height: none !important;
              overflow: visible !important;
              mso-hide: none !important;
            }
          }

          /* Email specific Styles */
          ${style}
      `}</MjmlStyle>
      </MjmlHead>

      <MjmlBody width={width}>
        <Header />
        <MjmlWrapper
          padding="40px 20px 0"
          backgroundColor={colors.grey}
          fullWidth
        >
          {children}
          <MjmlSection paddingTop="20px">
            <MjmlColumn>
              <Text>
                Cheers,
                <br />
                <br />
                Jamin & Sam at Books About Food
              </Text>
            </MjmlColumn>
          </MjmlSection>
        </MjmlWrapper>
        <Footer />
      </MjmlBody>
    </Mjml>
  )
}
