import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Container } from 'src/components/atoms/container'
import { SignOutButton } from 'src/components/auth/sign-out-button'
import { FavouritesList } from 'src/components/favourites/favourites-list'
import { getUser } from 'src/services/auth/get-user'

const Page = async () => {
  const user = await getUser.call()
  if (!user) redirect('auth/sign-in')

  return (
    <Container>
      <h1>Account</h1>
      <Suspense fallback="Loading favourites">
        {/* @ts-expect-error RSC */}
        <FavouritesList user={user} />
      </Suspense>
      <SignOutButton />
    </Container>
  )
}

export default Page
