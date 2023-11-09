import { Metadata } from 'next'
import { Suspense } from 'react'
import { FavouritesList } from 'src/components/favourites/favourites-list'
import { getUser } from 'src/utils/service'

export const metadata: Metadata = {
  title: 'Favourites'
}

const Page = async () => {
  const user = await getUser()

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
