import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Container } from 'src/components/atoms/container'
import { FavouritesList } from 'src/components/favourites/favourites-list'
import { getUser } from 'src/services/auth/get-user'

const Page = async () => {
  const user = await getUser.call()
  if (!user) notFound()

  return (
    <Container>
      <h1>Account</h1>
      <Suspense fallback="Loading favourites">
        {/** @ts-expect-error RSC */}
        <FavouritesList user={user} />
      </Suspense>
    </Container>
  )
}

export default Page
