import prisma from '@books-about-food/database'
import Button from '../components/button'
import { Section } from '../components/section'
import Text from '../components/text'
import { EmailTemplate } from '../utils/create-template'

export type VerifyEmailInput = {
  url: string
  email: string
}

export type VerifyEmailProps = {
  url: string
  newUser?: boolean
}

export class VerifyEmail extends EmailTemplate<
  VerifyEmailInput,
  VerifyEmailProps
> {
  static key = 'verifyEmail' as const
  subject = ({ newUser }: Partial<VerifyEmailProps>) =>
    newUser ? `Welcome to Books About Food!` : `Sign in to Books About Food`
  preview = 'Verify your email address'

  async transform() {
    const { url, email } = this.props
    const user = await prisma.user.findUnique({ where: { email } })
    const newUser = !user || !user?.emailVerified
    return { url, newUser }
  }

  content({ url, newUser }: VerifyEmailProps) {
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
}
