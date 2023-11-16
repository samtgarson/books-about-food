import { renderEmailTemplate, sendMail } from '@books-about-food/email'
import { createJob } from './base'

export const email = createJob(
  { id: 'email', name: 'Send an email' },
  'email',
  async ({ event }) => {
    if (!event.user?.email) return { success: false, message: 'No user' }
    const component = renderEmailTemplate(event.data)

    const sentMessage = await sendMail({
      component,
      to: event.user.email
    })

    return { success: true, res: sentMessage }
  }
)
