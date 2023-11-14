import { fetchFavourites } from '@books-about-food/core/services/favourites/fetch-favourites'
import { User } from '@books-about-food/database'
import Link from 'next/link'
import { call } from 'src/utils/service'
import { ProfileListSection } from '../profiles/list-section'

export type FavouritesListProps = { user: User }

export const FavouritesList = async ({ user }: FavouritesListProps) => {
  const { data: favourites } = await call(fetchFavourites, undefined, user)

  if (!favourites?.length)
    return (
      <p>
        You have no favourites!{' '}
        <Link href="/people" className="underline">
          Find some
        </Link>
      </p>
    )

  return (
    <ProfileListSection
      title="Favourites"
      profiles={favourites}
      data-superjson
    />
  )
}
