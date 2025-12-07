'use server'

import { fetchProfiles } from '@books-about-food/core/services/profiles/fetch-profiles'
import { call } from 'src/utils/service'
import { stringify } from 'src/utils/superjson'

export async function fetchProfilesByLocation(locationId: string) {
  const { data } = await call(fetchProfiles, {
    locationIds: [locationId],
    perPage: 'all'
  })
  return stringify(data?.profiles || [])
}
