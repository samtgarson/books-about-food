import type { Payload } from 'payload'
import { sendEmail } from 'src/email'
import { inngest } from 'src/jobs'

export const email = inngest.createFunction(
  { id: 'email', name: 'Send an email' },
  { event: 'jobs.email' },
  async ({
    event,
    payload
  }: {
    event: {
      user?: { email: string; name?: string | null }
      data: Parameters<typeof sendEmail>[3]
    }
    payload: Payload
  }) => {
    if (!event.user) return { success: false, message: 'No user' }
    await sendEmail(
      payload,
      event.user.email,
      event.user.name || null,
      event.data
    )

    return { success: true }
  }
)
