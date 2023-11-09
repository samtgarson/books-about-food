'use server'

import { fetchFavourite } from 'core/services/favourites/fetch-favourite'
import { updateFavourite } from 'core/services/favourites/update-favourite'
import { call } from 'src/utils/service'

export async function fetch(profileId: string) {
  const { data: favourite } = await call(fetchFavourite, { profileId })
  return !!favourite
}

export async function mutate(profileId: string, isFavourite: boolean) {
  const { data: favourite } = await call(updateFavourite, {
    profileId,
    isFavourite
  })
  return !!favourite
}
