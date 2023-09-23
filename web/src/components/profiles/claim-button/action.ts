'use server'

import { createClaim } from 'src/services/claims/create-claim'
import { destroyClaim } from 'src/services/claims/destroy-claim'
import { fetchClaim } from 'src/services/claims/fetch-claim'

export async function fetch(profileId: string) {
  return (await fetchClaim.call({ profileId })) || null
}

export async function create(profileId: string) {
  return await createClaim.call({ profileId })
}

export async function destroy(claimId?: string) {
  if (!claimId) return
  return await destroyClaim.call({ claimId })
}
