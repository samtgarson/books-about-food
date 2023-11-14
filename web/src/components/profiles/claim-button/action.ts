'use server'

import { createClaim } from '@books-about-food/core/services/claims/create-claim'
import { destroyClaim } from '@books-about-food/core/services/claims/destroy-claim'
import { fetchClaim } from '@books-about-food/core/services/claims/fetch-claim'
import { call } from 'src/utils/service'

export async function fetch(profileId: string) {
  const { data } = await call(fetchClaim, { profileId })
  return data || null
}

export async function create(profileId: string) {
  const { data } = await call(createClaim, { profileId })
  return data
}

export async function destroy(claimId?: string) {
  if (!claimId) return
  return await call(destroyClaim, { claimId })
}
