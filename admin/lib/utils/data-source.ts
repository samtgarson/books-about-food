import { getEnv } from '@books-about-food/shared/utils/get-env'
import { createSqlDataSource } from '@forestadmin/datasource-sql'
import { neonConfig } from '@neondatabase/serverless'
import pg from 'pg'
import { parse } from 'pg-connection-string'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

const parsed = parse(getEnv('DATABASE_URL', process.env.DATABASE_URL))

const sslOptions =
  process.env.NODE_ENV === 'production'
    ? {
        sslMode: 'required',
        dialectOptions: {
          application_name: 'admin',
          ssl: {
            rejectUnauthorized: false,
            require: true
          }
        }
      }
    : {}

// @ts-expect-error weird typing here
export const datasource = createSqlDataSource({
  username: parsed.user ?? undefined,
  password: parsed.password ?? undefined,
  host: parsed.host ?? undefined,
  port: parsed.port ? parseInt(parsed.port) : undefined,
  database: parsed.database ?? undefined,
  dialect: 'postgres',
  dialectModule: pg,
  ...sslOptions,
  pool: {
    max: 1
  }
})
