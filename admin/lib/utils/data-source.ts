import { createSqlDataSource } from '@forestadmin/datasource-sql'
import pg from 'pg'
import { parse } from 'pg-connection-string'
import { getEnv } from 'shared/utils/get-env'

const parsed = parse(getEnv('DATABASE_URL', process.env.DIRECT_DATABASE_URL))

export const datasource = createSqlDataSource({
  username: parsed.user ?? undefined,
  password: parsed.password ?? undefined,
  host: parsed.host ?? undefined,
  port: parsed.port ? parseInt(parsed.port) : undefined,
  database: parsed.database ?? undefined,
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions:
    process.env.NODE_ENV === 'development'
      ? undefined
      : {
        ssl: {
          require: true
        }
      },
  pool: {
    max: 1
  }
})
