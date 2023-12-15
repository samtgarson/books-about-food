import { EmailTemplate } from '@books-about-food/email'
import { EventSchemas, Inngest } from 'inngest'
import { createSentryMiddleware } from './middleware/sentry'

let middleware: ConstructorParameters<typeof Inngest>[0]['middleware']
if (process.env.SENTRY_DSN) {
  const sentry = createSentryMiddleware(process.env.SENTRY_DSN)
  middleware = [sentry]
}

// Create a client to send and receive events
export const inngest = new Inngest({
  id: 'books-about-food',
  schemas: new EventSchemas().fromRecord<{
    'book.updated': {
      data: {
        id: string | string[] | 'all'
        coverImageChanged?: boolean
      }
    }
    'jobs.email': { data: EmailTemplate }
  }>(),
  middleware
})
