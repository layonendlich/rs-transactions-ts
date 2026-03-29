import { env } from './env'
import { knex as knexSetup, Knex } from 'knex'

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: env.DATABASE_URL || './app.db',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: env.DATABASE_MIGRATIONS || './migrations',
  },
}

export const knex = knexSetup(config)
