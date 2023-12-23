import { renderEmailTemplate, sendMail } from '@books-about-food/email'
import crypto from 'crypto'
import { inngest } from '..'

export const email = inngest.createFunction(
  { id: 'email', name: 'Send an email' },
  { event: 'jobs.email' },
  async ({ event }) => {
    if (!event.user?.email) return { success: false, message: 'No user' }
    const component = renderEmailTemplate(event.data)

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
