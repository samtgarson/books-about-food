import { SignInButtons } from 'src/components/auth/sign-in-buttons'

export default async function SignInPage({
  searchParams
}: {
  params: { slug: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const callbackUrl = searchParams?.callbackUrl || '/'

  return (
    <>
      <SignInButtons callbackUrl={`${callbackUrl}`} />
    </>
  )
}
