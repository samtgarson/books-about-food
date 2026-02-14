// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: 0,

  debug: false,

  replaysOnErrorSampleRate: 0,

  replaysSessionSampleRate: 0

  // integrations: [
  //   Sentry.replayIntegration({
  //     mask: ['input[type=password]', 'input[type=email]'],
  //     blockAllMedia: true
  //   })
  // ]
})
