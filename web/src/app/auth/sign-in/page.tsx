import { Metadata } from 'next'
import Link from 'next/link'
import { SignInButtons } from 'src/components/auth/sign-in-buttons'
import { Logo } from 'src/components/nav/logo'
import { SignInErrorTypes } from 'src/types/next-auth'

export const metadata: Metadata = {
  title: 'Sign In'
}

const errors: Record<SignInErrorTypes, string> = {
  Signin: 'Try signing in with a different account.',
  OAuthSignin: 'Try signing in with a different account.',
  OAuthCallback: 'Try signing in with a different account.',
  OAuthCreateAccount: 'Try signing in with a different account.',
  EmailCreateAccount: 'Try signing in with a different account.',
  Callback: 'Try signing in with a different account.',
  OAuthAccountNotLinked:
    'To confirm your identity, sign in with the same account you used originally and connect your new account in the settings page.',
  EmailSignin: 'The e-mail could not be sent.',
  CredentialsSignin:
    'Sign in failed. Check the details you provided are correct.',
  SessionRequired: 'Please sign in to access this page.',
  default: 'Unable to sign in.'
}

export default async function SignInPage(props: PageProps<'/auth/sign-in'>) {
  const searchParams = await props.searchParams
  const { callbackUrl = '/', error } = searchParams ?? {}

  return (
    <div className="flex flex-col gap-8">
      <Link href="/" className="mb-16 block">
        <Logo />
      </Link>
      {error && (
        <p className="max-w-xl">
          {errors[error as SignInErrorTypes] || errors.default}
        </p>
      )}
      <SignInButtons callbackUrl={`${callbackUrl}`} />
    </div>
  )
}
