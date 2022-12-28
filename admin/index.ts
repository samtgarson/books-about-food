if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config() // eslint-disable-line
}

import { createAgent } from '@forestadmin/agent'
import { createSqlDataSource } from '@forestadmin/datasource-sql'
import { getEnv } from 'shared'
import { parse } from 'pg-connection-string'
import pg from 'pg'

// Create your Forest Admin agent
const agent = createAgent({
  // These process.env variables should be provided in the onboarding
  authSecret: getEnv('FOREST_AUTH_SECRET'),
  envSecret: getEnv('FOREST_ENV_SECRET'),
  isProduction: process.env.NODE_ENV === 'production'
})

const parsed = parse(getEnv('DATABASE_URL'))
const datasource = createSqlDataSource({
  username: parsed.user ?? undefined,
  password: parsed.password ?? undefined,
  host: parsed.host ?? undefined,
  port: parsed.port ? parseInt(parsed.port) : undefined,
  database: parsed.database ?? undefined,
  dialect: 'postgres',
  dialectModule: pg,
  pool: {
    max: 1
  }
})
agent.addDataSource(datasource).start()

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001
agent.mountOnStandaloneServer(port)
