import cors from '@koa/cors'
import { neonConfig } from '@neondatabase/serverless'
import * as Sentry from '@sentry/node'
import Koa from 'koa'
import ws from 'ws'
import { agent } from './agent'
import { apiRouter } from './api'

console.log('SETTING NEON CONFIG')
neonConfig.webSocketConstructor = ws

Sentry.init({
  dsn: process.env.SENTRY_DSN
})

const app = new Koa()

app.use(
  cors({
    origin: 'https://app.forestadmin.com',
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
