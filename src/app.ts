import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'
import cookie from '@fastify/cookie'
import { transactionRoutes } from './routes/transactions'

export const app = fastify()

app.register(cookie)
app.register(transactionRoutes, {
  prefix: 'transactions',
})

app.get('/', () => {
  return 'Hello, world!'
  // return { amount: 0.1 + 0.2 }
})

app.get('/sqlite', async () => {
  const res = await knex('sqlite_schema').select('*')
  return res
})
