import Koa from 'koa'
import { agent } from './agent'
import { apiRouter } from './api'
import cors from '@koa/cors'

const app = new Koa()

app.use(
  cors({
    origin: 'https://app.forestadmin.com',
    credentials: true,
    privateNetworkAccess: true
  })
)
app.use(apiRouter.routes()).use(apiRouter.allowedMethods())
agent.mountOnKoa(app)

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001
app.listen(port)
