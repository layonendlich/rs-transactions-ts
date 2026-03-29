import { test, expect, beforeAll, afterAll, beforeEach, describe } from 'vitest'
import supertest from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  test('New transaction', async () => {
    const response = await supertest(app.server).post('/transactions').send({
      title: 'Transaction test',
      amount: 5000,
      type: 'credit',
    })

    expect(response.statusCode).toEqual(201)
  })

  test('Get all transactions', async () => {
    const response = await supertest(app.server).post('/transactions').send({
      title: 'Transaction test',
      amount: 500,
      type: 'credit',
    })

    const cookie = response.get('Set-Cookie')

    const response2 = await supertest(app.server)
      .get('/transactions')
      .set('Cookie', cookie)

    expect(response2.statusCode).toEqual(200)
  })

  test('Get a specific transactions', async () => {
    const response = await supertest(app.server).post('/transactions').send({
      title: 'Transaction test',
      amount: 500,
      type: 'credit',
    })

    const cookie = response.get('Set-Cookie')
    const id = response.body.transaction.uuid

    const response2 = await supertest(app.server)
      .get(`/transactions/${id}`)
      .set('Cookie', cookie)

    expect(response2.statusCode).toEqual(200)
  })

  test('Get transactions summary', async () => {
    const response = await supertest(app.server).post('/transactions').send({
      title: 'Transaction test',
      amount: 500,
      type: 'credit',
    })

    const cookie = response.get('Set-Cookie')

    const response2 = await supertest(app.server)
      .post('/transactions')
      .set('Cookie', cookie)
      .send({
        title: 'Transaction test',
        amount: 10,
        type: 'debit',
      })

    const response3 = await supertest(app.server)
      .get(`/transactions/summary`)
      .set('Cookie', cookie)

    expect(response3.body.amount).toEqual(490)
  })
})
