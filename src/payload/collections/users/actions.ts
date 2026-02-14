'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import type { ActionResult } from '../../components/actions/action-button'

export async function approveUser(userId: string): Promise<ActionResult> {
  try {
    const payload = await getPayload({ config })

    const user = await payload.findByID({
      collection: 'users',
      id: userId
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    if (user.role !== 'waitlist') {
      return { success: false, error: 'User is not on the waitlist' }
    }

    await payload.update({
      collection: 'users',
      id: userId,
      data: {
        role: 'user'
      }
    })

    // TODO: Trigger welcome email via Inngest
    // await inngest.send({ name: 'user/approved', data: { userId } })

    return { success: true, message: 'User approved and moved off waitlist' }
  } catch (error) {
    console.error('Error approving user:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to approve user'
    }
  }
}
