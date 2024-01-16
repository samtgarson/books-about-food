// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: 0,

  debug: false,

  replaysOnErrorSampleRate: process.env.NODE_ENV === 'production' ? 1 : 0,

  replaysSessionSampleRate: 0,

  integrations: [
    new Sentry.Replay({
      // Additional Replay configuration goes in here, for example:
      mask: ['input[type=password]', 'input[type=email]'],
      blockAllMedia: true
    })
  ]
})
