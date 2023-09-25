import { Metadata } from 'next'
import Link from 'next/link'
import { SignInButtons } from 'src/components/auth/sign-in-buttons'
import { Logo } from 'src/components/nav/logo'
import { PageProps } from 'src/components/types'

export const metadata: Metadata = {
  title: 'Sign In'
}

export default async function SignInPage({
  searchParams
}: PageProps<{ slug: string }>) {
  const callbackUrl = searchParams?.callbackUrl || '/'

  return (
    <>
      <Link href="/" className="mb-20 block">
        <Logo />
      </Link>
      <SignInButtons callbackUrl={`${callbackUrl}`} />
    </>
  )
}
