import * as Sentry from '@sentry/nextjs'

const sharedConfig = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0,
  debug: false
}

export async function register() {
  // vinext doesn't set NEXT_RUNTIME; always init for Node.js server
  if (process.env.NEXT_RUNTIME === 'nodejs' || !process.env.NEXT_RUNTIME) {
    Sentry.init({
      ...sharedConfig
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      ...sharedConfig
    })
  }
}

export const onRequestError = Sentry.captureRequestError
