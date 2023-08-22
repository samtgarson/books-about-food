import { User } from 'database'
import { fetchFavourites } from 'src/services/favourites/fetch-favourites'
import { ProfileListSection } from '../profiles/list-section'
import Link from 'next/link'

export type FavouritesListProps = { user: User }

export const FavouritesList = async ({ user }: FavouritesListProps) => {
  const favourites = await fetchFavourites.call(undefined, user)

  if (!favourites?.length)
    return (
      <p>
        You have no favourites!{' '}
        <Link href="/people" className="underline">
          Find some
        </Link>
      </p>
    )

  return <ProfileListSection title="Favourites" profiles={favourites} />
}
