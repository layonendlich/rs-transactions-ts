import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  SERVICE_PORT: z.string().default('3333'),
  SERVICE_HOST: z.string().default('0.0.0.0'),

  DATABASE_URL: z.string().default('./db/app.db'),
  DATABASE_MIGRATIONS: z.string().default('./db/migrations'),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment error')
}

export const env = _env.data
