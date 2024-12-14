import { inngest } from '@books-about-food/core/jobs'
import { sendEmail } from '@books-about-food/email'

export const email = inngest.createFunction(
  { id: 'email', name: 'Send an email' },
  { event: 'jobs.email' },
  async ({ event }) => {
    if (!event.user) return { success: false, message: 'No user' }
    const sentMessage = await sendEmail(
      event.user.email,
      event.user.name || null,
      event.data
    )

    return { success: true, res: sentMessage }
  }
)
