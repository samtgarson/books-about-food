import { MjmlColumn, MjmlSection } from '@faire/mjml-react'
import BaseLayout from '../components/base-layout'
import Button from '../components/button'
import Text from '../components/text'
import { Template } from 'mailing-core'

export type VerifyEmailProps = {
  url: string
  newUser?: boolean
}

const VerifyEmail: Template<VerifyEmailProps> = ({ url, newUser }) => {
  return (
    <BaseLayout>
      <MjmlSection>
        <MjmlColumn>
          {newUser ? (
            <>
              <Text>
                Thanks for joining Books About Food! We&apos;re working hard to
                build the cookbook industry&apos;s new digital home.
              </Text>
              <Text>Click the button below to verify your email address.</Text>
            </>
          ) : (
            <Text>Click the button below to sign in.</Text>
          )}
          <Button href={url}>{newUser ? 'Verify Email' : 'Sign In'}</Button>
          <Text fontSize="sm">
            Or, copy and paste this URL into your browser:
          </Text>
          <Text fontFamily="monospace" fontSize="sm">
            <span
              style={{
                backgroundColor: 'white',
                paddingInline: 6,
                paddingBlock: 4
              }}
            >
              {url}
            </span>
          </Text>
        </MjmlColumn>
      </MjmlSection>
    </BaseLayout>
  )
}
VerifyEmail.subject = ({ newUser }) =>
  newUser ? `Welcome to Books About Food!` : `Sign in to Books About Food`
export default VerifyEmail
