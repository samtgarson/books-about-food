if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config() // eslint-disable-line
}

import { createAgent } from '@forestadmin/agent'
import { createSqlDataSource } from '@forestadmin/datasource-sql'
import express from 'express'
import { getEnv } from 'shared'

// Create your Forest Admin agent
const agent = createAgent({
  // These process.env variables should be provided in the onboarding
  authSecret: getEnv('FOREST_AUTH_SECRET'),
  envSecret: getEnv('FOREST_ENV_SECRET'),
  isProduction: process.env.NODE_ENV === 'production'
})

const app = express()

agent
  .addDataSource(createSqlDataSource(getEnv('DATABASE_URL')))
  .mountOnExpress(app)
  .start()

const port = process.env.PORT || 3001
if (process.env.NODE_ENV === 'development') {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
}

export default app
