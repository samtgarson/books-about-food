'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import type { ActionResult } from '../components/actions/action-button'

export async function featureProfile(profileId: string): Promise<ActionResult> {
  try {
    const payload = await getPayload({ config })

    // Check if profile exists
    const profile = await payload.findByID({
      collection: 'profiles',
      id: profileId
    })

    if (!profile) {
      return { success: false, error: 'Profile not found' }
    }

    // Check if profile is already featured
    const existing = await payload.find({
      collection: 'featured-profiles',
      where: {
        profile: { equals: profileId }
      },
      limit: 1
    })

    if (existing.docs.length > 0) {
      return { success: false, error: 'Profile is already featured' }
    }

    // Create new featured profile entry (featured indefinitely by default)
    await payload.create({
      collection: 'featured-profiles',
      data: {
        profile: profileId
      }
    })

    return { success: true, message: 'Profile featured on homepage' }
  } catch (error) {
    console.error('Error featuring profile:', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to feature profile'
    }
  }
}

export async function unfeatureProfile(
  profileId: string
): Promise<ActionResult> {
  try {
    const payload = await getPayload({ config })

    // Find the featured profile entry
    const existing = await payload.find({
      collection: 'featured-profiles',
      where: {
        profile: { equals: profileId }
      },
      limit: 1
    })

    if (existing.docs.length === 0) {
      return { success: false, error: 'Profile is not featured' }
    }

    // Delete the featured profile entry
    await payload.delete({
      collection: 'featured-profiles',
      id: existing.docs[0].id
    })

    return { success: true, message: 'Profile removed from homepage' }
  } catch (error) {
    console.error('Error unfeaturing profile:', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to unfeature profile'
    }
  }
}
