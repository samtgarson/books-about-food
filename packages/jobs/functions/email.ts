import { inngest } from '@books-about-food/core/jobs'
import { renderEmailTemplate, sendMail } from '@books-about-food/email'
import crypto from 'crypto'

export const email = inngest.createFunction(
  { id: 'email', name: 'Send an email' },
  { event: 'jobs.email' },
  async ({ event }) => {
    if (!event.user) return { success: false, message: 'No user' }
    const component = renderEmailTemplate(event.user.name || null, event.data)

    const id = crypto.randomUUID()
    const sentMessage = await sendMail({
      component,
      to: event.user.email,
      messageId: id,
      dangerouslyForceDeliver: process.env.DANGER_SEND_EMAILS === 'true'
    })

    return { success: true, res: sentMessage }
  }
)
