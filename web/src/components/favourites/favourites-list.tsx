import { User } from 'database'
import { fetchFavourites } from 'src/services/favourites/fetch-favourites'

export type FavouritesListProps = { user: User }

export const FavouritesList = async ({ user }: FavouritesListProps) => {
  const favourites = await fetchFavourites.call(undefined, user)

  return (
    <div>
      {favourites?.length
        ? favourites.map((favourite) => (
            <div key={favourite.id}>{favourite.profile.name}</div>
          ))
        : 'No favourites'}
    </div>
  )
}
