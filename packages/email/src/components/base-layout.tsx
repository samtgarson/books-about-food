import {
  Mjml,
  MjmlAll,
  MjmlAttributes,
  MjmlBody,
  MjmlColumn,
  MjmlDivider,
  MjmlHead,
  MjmlPreview,
  MjmlSection,
  MjmlStyle,
  MjmlWrapper
} from '@faire/mjml-react'
import { ReactNode } from 'react'
import { colors, screens, spacing, themeDefaults } from '../theme'
import Header from './header'
import Text from './text'

type BaseLayoutProps = {
  width?: number
  style?: string
  children: ReactNode
  recipientName?: string
  preview?: string
}

export default function BaseLayout({
  width = 600,
  children,
  style,
  recipientName,
  preview
}: BaseLayoutProps) {
  return (
    <Mjml>
      <MjmlHead>
        {preview && <MjmlPreview>{preview}</MjmlPreview>}
        <MjmlAttributes>
          <MjmlAll {...themeDefaults} />
        </MjmlAttributes>
        <MjmlStyle>{`
          body {
            -webkit-font-smoothing: antialiased;
            min-width: 320px;
            background-color: ${colors.grey};
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
        <MjmlWrapper padding="40px 20px 0">
          <MjmlSection>
            <MjmlColumn>
              <Header />
              <MjmlDivider
                borderColor={colors.khaki}
                borderWidth={1}
                paddingBottom={spacing.s8}
              />
              {recipientName ? (
                <Text>Dear {recipientName},</Text>
              ) : (
                <Text>Hi there,</Text>
              )}
            </MjmlColumn>
          </MjmlSection>
          {children}
          <MjmlSection paddingTop="20px">
            <MjmlColumn>
              <Text>
                Cheers,
                <br />
                <br />
                Jamin & Sam at Books About Food
              </Text>
              <MjmlDivider
                borderColor={colors.khaki}
                borderWidth={1}
                paddingBottom={spacing.s8}
              />
              <Text fontSize="sm" color={colors.neutralGrey}>
                Copyright © Books About Food {new Date().getFullYear()}
              </Text>
            </MjmlColumn>
          </MjmlSection>
        </MjmlWrapper>
      </MjmlBody>
    </Mjml>
  )
}
