import { SignInButtons } from 'src/components/auth/sign-in-buttons'
import { PageProps } from 'src/components/types'

export default async function SignInPage({
  searchParams
}: PageProps<{ slug: string }>) {
  const callbackUrl = searchParams?.callbackUrl || '/'

  return (
    <>
      <SignInButtons callbackUrl={`${callbackUrl}`} />
    </>
  )
}
