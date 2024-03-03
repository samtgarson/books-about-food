import Button from '../components/button'
import { Section } from '../components/section'
import Text from '../components/text'
import { createTemplate } from '../utils/create-template'

export type VerifyEmailProps = {
  url: string
  newUser?: boolean
}

export const VerifyEmail = createTemplate<VerifyEmailProps>({
  subject: ({ newUser }) =>
    newUser ? `Welcome to Books About Food!` : `Sign in to Books About Food`,
  preview: 'Verify your email address',
  content({ url, newUser }) {
    return (
      <Section>
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
        <Text>Or, copy and paste this URL into your browser:</Text>
        <Text fontFamily="monospace" fontSize="sm">
          <a href={url}>{url}</a>
        </Text>
      </Section>
    )
  }
})
