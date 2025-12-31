'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import type { ActionResult } from '../components/actions/action-button'

export async function approveClaim(claimId: string): Promise<ActionResult> {
  try {
    const payload = await getPayload({ config })

    // Get the claim with its relationships
    const claim = await payload.findByID({
      collection: 'claims',
      id: claimId,
      depth: 1
    })

    if (!claim) {
      return { success: false, error: 'Claim not found' }
    }

    if (claim.approvedAt) {
      return { success: false, error: 'Claim already approved' }
    }

    if (claim.cancelledAt) {
      return { success: false, error: 'Claim was cancelled' }
    }

    const profileId =
      typeof claim.profile === 'string' ? claim.profile : claim.profile?.id
    const userId = typeof claim.user === 'string' ? claim.user : claim.user?.id

    if (!profileId || !userId) {
      return { success: false, error: 'Invalid claim data' }
    }

    // Update the claim with approvedAt
    await payload.update({
      collection: 'claims',
      id: claimId,
      data: {
        approvedAt: new Date().toISOString()
      }
    })

    // Link the profile to the user
    await payload.update({
      collection: 'profiles',
      id: profileId,
      data: {
        user: userId
      }
    })

    return { success: true, message: 'Claim approved successfully' }
  } catch (error) {
    console.error('Error approving claim:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to approve claim'
    }
  }
}

export async function cancelClaim(claimId: string): Promise<ActionResult> {
  try {
    const payload = await getPayload({ config })

    const claim = await payload.findByID({
      collection: 'claims',
      id: claimId
    })

    if (!claim) {
      return { success: false, error: 'Claim not found' }
    }

    if (claim.cancelledAt) {
      return { success: false, error: 'Claim already cancelled' }
    }

    if (claim.approvedAt) {
      return { success: false, error: 'Cannot cancel an approved claim' }
    }

    await payload.update({
      collection: 'claims',
      id: claimId,
      data: {
        cancelledAt: new Date().toISOString()
      }
    })

    return { success: true, message: 'Claim cancelled' }
  } catch (error) {
    console.error('Error cancelling claim:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel claim'
    }
  }
}
