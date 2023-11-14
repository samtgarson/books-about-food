import { renderEmailTemplate, sendMail } from '@books-about-food/email'
import { inngest } from '..'

export const email = inngest.createFunction(
  {
    id: 'email',
    name: 'Send an email'
  },
  { event: 'email' },
  async ({ event }) => {
    try {
      if (!event.user) return
      const component = renderEmailTemplate(event.data)

      const res = await sendMail({
        component,
        to: event.user.email
      })

      return { event, res }
    } catch (error) {
      console.error(error)
      return { event, error: (error as Error).message }
    }
  }
)
