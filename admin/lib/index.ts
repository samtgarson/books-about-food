import cors from '@koa/cors'
import Koa from 'koa'
import { agent } from './agent'
import { apiRouter } from './api'

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

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5001
app.listen(port, () => {
  console.log(`> Ready on http://localhost:${port}`)
})
