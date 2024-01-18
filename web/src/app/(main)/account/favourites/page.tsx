import { Metadata } from 'next'
import { Suspense } from 'react'
import { AccountHeader } from 'src/components/accounts/header'
import { Loader } from 'src/components/atoms/loader'
import { FavouritesList } from 'src/components/favourites/favourites-list'
import { getSessionUser } from 'src/utils/user'

export const metadata: Metadata = {
  title: 'Favourites'
}

const Page = async () => {
  const user = await getSessionUser()

  if (!user) return null
  return (
    <div className="flex flex-col gap-8">
      <AccountHeader title="Your Favourite People" />
      <Suspense fallback={<Loader />}>
        <FavouritesList />
      </Suspense>
    </div>
  )
}

export default Page
