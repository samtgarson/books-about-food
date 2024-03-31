import cors from '@koa/cors'
import * as Sentry from '@sentry/node'
import Koa from 'koa'
import { agent } from './agent'
import { apiRouter } from './api'

Sentry.init({
  dsn: process.env.SENTRY_DSN
})

const app = new Koa()

const allowedOrigins = [
  'https://www.booksaboutfood.info',
  'https://www.booksabout.food',
  'https://app.forestadmin.com'
]
app.use(
  cors({
    origin(ctx) {
      if (process.env.NODE_ENV !== 'production') return '*'
      if (
        ctx.request.headers.origin &&
        allowedOrigins.includes(ctx.request.headers.origin)
      ) {
        return ctx.request.headers.origin
      }
      return allowedOrigins[0]
    },
    credentials: true,
    privateNetworkAccess: true
  })
)
agent.mountOnKoa(app)
app.use(apiRouter.routes()).use(apiRouter.allowedMethods())

app.on('error', (err, ctx) => {
  console.error(err)
  Sentry.withScope((scope) => {
    scope.setSDKProcessingMetadata({ request: ctx.request })
    Sentry.captureException(err)
  })
})

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5001
app.listen(port, async () => {
  console.log(`> Ready on port ${port}`)
  const res = await fetch(`http://localhost:${port}/api/inngest`, {
    method: 'PUT'
  })

  if (res.ok) console.log('> Inngest client registered')
  else console.error('> Failed to register Inngest client', await res.text())
})
