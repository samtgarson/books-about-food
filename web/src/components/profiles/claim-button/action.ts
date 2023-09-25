'use server'

import { createClaim } from 'src/services/claims/create-claim'
import { destroyClaim } from 'src/services/claims/destroy-claim'
import { fetchClaim } from 'src/services/claims/fetch-claim'

export async function fetch(profileId: string) {
  const { data } = await fetchClaim.call({ profileId })
  return data || null
}

export async function create(profileId: string) {
  const { data } = await createClaim.call({ profileId })
  return data
}

export async function destroy(claimId?: string) {
  if (!claimId) return
  return await destroyClaim.call({ claimId })
}
