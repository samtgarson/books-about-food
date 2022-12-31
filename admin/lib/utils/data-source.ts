import { createSqlDataSource } from '@forestadmin/datasource-sql'
import pg from 'pg'
import { parse } from 'pg-connection-string'
import { getEnv } from 'shared'

const parsed = parse(getEnv('DATABASE_URL'))

export const datasource = createSqlDataSource({
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
