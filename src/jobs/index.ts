import { sentryMiddleware } from '@inngest/middleware-sentry'
import { EventSchemas, Inngest } from 'inngest'
import { EmailTemplate } from 'src/email'
import { payloadMiddleware } from './middleware'

const middleware: NonNullable<
  ConstructorParameters<typeof Inngest>[0]['middleware']
> = [payloadMiddleware]

if (process.env.SENTRY_DSN) {
  middleware.push(sentryMiddleware())
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
      id: string | string[]
      coverImageChanged?: boolean
    }>
    'jobs.email': JobData<EmailTemplate>
    'jobs.send-verification': JobData<{ email: string }>
    'votes.created': JobData<{ bookIds: string[] }>
    'votes.submitted': JobData<{ userId: string; voteIds: string[] }>
  }>(),
  middleware,
  env: process.env.RAILWAY_GIT_BRANCH
})
