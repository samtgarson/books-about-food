if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config() // eslint-disable-line
}

import { createAgent } from '@forestadmin/agent'
import { createSqlDataSource } from '@forestadmin/datasource-sql'
import { getEnv } from 'shared'

// Create your Forest Admin agent
const agent = createAgent({
  // These process.env variables should be provided in the onboarding
  authSecret: getEnv('FOREST_AUTH_SECRET'),
  envSecret: getEnv('FOREST_ENV_SECRET'),
  isProduction: process.env.NODE_ENV === 'production'
})

agent.addDataSource(createSqlDataSource(getEnv('DATABASE_URL'))).start()

//@ts-expect-error using a private method here
export default agent.getConnectCallback(false)
