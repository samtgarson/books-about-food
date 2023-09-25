import { User } from 'database'
import Link from 'next/link'
import { fetchFavourites } from 'src/services/favourites/fetch-favourites'
import { ProfileListSection } from '../profiles/list-section'

export type FavouritesListProps = { user: User }

export const FavouritesList = async ({ user }: FavouritesListProps) => {
  const { data: favourites } = await fetchFavourites.call(undefined, user)

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
