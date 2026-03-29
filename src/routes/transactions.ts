import type { FastifyInstance } from 'fastify'
import crypto from 'node:crypto'
import { knex } from '../database'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId

      const res = await knex('transactions')
        .where('session_id', sessionId)
        .select()
      return { transactions: res }
    },
  )

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const sessionId = request.cookies.sessionId

      const res = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { amount: res.amount || 0 }
    },
  )

  app.get(
    '/:uuid',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId

      const getTransactionParamsSchema = z.object({
        uuid: z.string().uuid(),
      })

      const { uuid } = getTransactionParamsSchema.parse(request.params)

      if (!uuid || uuid === '') {
        return reply.status(400).send({ transaction: null })
      }

      const res = await knex('transactions')
        .where({
          uuid,
          session_id: sessionId,
        })
        .first()

      if (!res) {
        return reply.status(404).send({ transaction: null })
      }

      return { transaction: res }
    },
  )

  app.post('/', async (request, reply) => {
    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = crypto.randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 31,
      })
    }

    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      typeof request.body === 'string'
        ? JSON.parse(request.body)
        : request.body,
    )

    const transaction = {
      uuid: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    }

    const res = await knex('transactions').insert(transaction).returning('*')

    if (res[0]) reply.status(201)

    return { transaction: res[0] }
  })
}
