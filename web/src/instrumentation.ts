import * as Sentry from '@sentry/nextjs'

const sharedConfig = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0,
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false
}

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // this is your Sentry.init call from `sentry.server.config.js|ts`
    Sentry.init({
      ...sharedConfig,
      integrations: [Sentry.prismaIntegration()]
    })
  }

  // This is your Sentry.init call from `sentry.edge.config.js|ts`
  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      ...sharedConfig
    })
  }
}
