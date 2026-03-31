import { Metadata } from 'next'
import Link from 'next/link'
import { SignInButtons } from 'src/components/auth/sign-in-buttons'
import { Logo } from 'src/components/nav/logo'

export const metadata: Metadata = {
  title: 'Sign In'
}

const errors: Record<string, string> = {
  OAuthAccountNotLinked:
    'To confirm your identity, sign in with the same account you used originally and connect your new account in the settings page.',
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
          {errors[error as string] || errors.default}
        </p>
      )}
      <SignInButtons callbackUrl={`${callbackUrl}`} />
    </div>
  )
}
