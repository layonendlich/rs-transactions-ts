import { env } from './env'
import { knex as knexSetup, Knex } from 'knex'

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection:
    env.DATABASE_CLIENT === 'sqlite'
      ? {
          filename: env.DATABASE_URL || './app.db',
        }
      : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: env.DATABASE_MIGRATIONS || './migrations',
  },
}

export const knex = knexSetup(config)
