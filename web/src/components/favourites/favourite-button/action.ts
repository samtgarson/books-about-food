'use server'

import { fetchFavourite } from 'src/services/favourites/fetch-favourite'
import { updateFavourite } from 'src/services/favourites/update-favourite'

export async function fetch(profileId: string) {
  const { data: favourite } = await fetchFavourite.call({ profileId })
  return !!favourite
}

export async function mutate(profileId: string, isFavourite: boolean) {
  const { data: favourite } = await updateFavourite.call({
    profileId,
    isFavourite
  })
  return !!favourite
}
