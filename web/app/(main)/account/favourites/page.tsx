import { Suspense } from 'react'
import { FavouritesList } from 'src/components/favourites/favourites-list'
import { getUser } from 'src/services/auth/get-user'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Favourites'
}

const Page = async () => {
  const user = await getUser.call()

  if (!user) return null
  return (
    <>
      <Suspense fallback="Loading favourites">
        <FavouritesList user={user} />
      </Suspense>
    </>
  )
}

export default Page
