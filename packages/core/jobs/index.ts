import { BookVote } from '@books-about-food/database'
import { EmailTemplate } from '@books-about-food/email'
import { sentryMiddleware } from '@inngest/middleware-sentry'
import { EventSchemas, Inngest } from 'inngest'

let middleware: ConstructorParameters<typeof Inngest>[0]['middleware']
if (process.env.SENTRY_DSN) {
  middleware = [sentryMiddleware()]
}

type JobData<Data extends Record<string, unknown>> = {
  data: Data
  user?: { email: string; name?: string | null }
}

// Create a client to send and receive events
export const inngest = new Inngest({
  id: 'books-about-food',
  schemas: new EventSchemas().fromRecord<{
    'book.updated': JobData<{
      id: string | string[] | 'all'
      coverImageChanged?: boolean
    }>
    'jobs.email': JobData<EmailTemplate>
    'jobs.send-verification': JobData<{ email: string }>
    'votes.created': JobData<Pick<BookVote, 'userId' | 'bookId'>>
    'votes.submitted': JobData<{ userId: string; voteIds: string[] }>
  }>(),
  middleware
})
