import { createAgent } from '@forestadmin/agent'
import { createSqlDataSource } from '@forestadmin/datasource-sql'
import pg from 'pg'
import { parse } from 'pg-connection-string'
import { getEnv } from 'shared'

const agent = createAgent({
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
