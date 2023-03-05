import { EMAIL_PREFERENCES_URL } from 'mailing-core'
import { MjmlColumn, MjmlSection, MjmlText, MjmlWrapper } from 'mjml-react'
import { fontSize } from '../theme'
import Link from './link'

type FooterProps = {
  includeUnsubscribe?: boolean
}

export default function Footer({ includeUnsubscribe = false }: FooterProps) {
  return (
    <>
      <MjmlWrapper backgroundColor="#fff" fullWidth padding="32px 20px 24px">
        <MjmlSection>
          <MjmlColumn>
            <MjmlText fontSize={fontSize.xs}>
              Copyright © Books About Food {new Date().getFullYear()}
            </MjmlText>

            {includeUnsubscribe && (
              <MjmlText align="center" fontSize={fontSize.xs} paddingTop={12}>
                You&rsquo;re receiving this email because you asked for
                occasional updates about Mailing. If you don&rsquo;t want to
                receive these in the future, you can{' '}
                <Link textDecoration="underline" href={EMAIL_PREFERENCES_URL}>
                  unsubscribe.
                </Link>
              </MjmlText>
            )}
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
    </>
  )
}
