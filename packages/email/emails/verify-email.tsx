import prisma from '@books-about-food/database'
import { Text } from '@react-email/components'
import Button from '../components/button'
import { emailTemplate } from '../utils/create-template'

export type VerifyEmailInput = {
  url: string
  email: string
}

export type VerifyEmailProps = {
  url: string
  newUser?: boolean
}

export default emailTemplate({
  component({ url, newUser }: VerifyEmailProps) {
    return (
      <>
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
        <Text>
          <a
            className="font-mono"
            href={url}
            style={{ overflowWrap: 'anywhere' }}
          >
            {url}
          </a>
        </Text>
      </>
    )
  },
  previewProps: {
    url: 'http://booksaboutfood.info/api/auth/callback/email?callbackUrl=http%3A%2F%2Flocalhost%3A5000%2Faccount&token=f16dc233cd515c03e4e7e47ed92c9bd7680ac0884dcfdfc180678b755b77bdff&email=samtgarson%40gmail.com',
    newUser: true
  },
  subject: ({ newUser }) =>
    newUser ? `Welcome to Books About Food!` : `Sign in to Books About Food`,
  preview: 'Verify your email address',
  async transform({ url, email }: VerifyEmailInput) {
    const user = await prisma.user.findUnique({ where: { email } })
    const newUser = !user || !user?.emailVerified
    return { url, newUser }
  }
})
