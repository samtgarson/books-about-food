// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import prisma from '@books-about-food/database'
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0,

  debug: false,

  integrations: [new Sentry.Integrations.Prisma({ client: prisma })]
})
