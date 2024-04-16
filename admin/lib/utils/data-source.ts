import { getEnv } from '@books-about-food/shared/utils/get-env'
import { createSqlDataSource } from '@forestadmin/datasource-sql'
import pg from 'pg'
import { parse } from 'pg-connection-string'

const parsed = parse(getEnv('DATABASE_URL', process.env.DATABASE_URL))

const sslOptions = {
  sslMode: 'required',
  dialectOptions: {
    application_name: 'admin',
    ssl: {
      rejectUnauthorized: false,
      require: true
    }
  }
}

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
